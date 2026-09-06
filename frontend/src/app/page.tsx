"use client";

import { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const MapViewer = dynamic(() => import('../components/MapViewer'), { ssr: false });

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [scene, setScene] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "discovery">("upload");
  
  // Do NOT remove the existing NEXT_PUBLIC_API_URL until verified
  const API_URL = '/api'; // process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Discovery State
  const [bbox, setBbox] = useState("12.45, 41.89, 12.55, 41.95");
  const [startDate, setStartDate] = useState("2023-08-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2023-08-10T23:59:59Z");
  const [sensor, setSensor] = useState("sentinel-2");
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [ingestingId, setIngestingId] = useState<string | null>(null);
  
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [evidence, setEvidence] = useState<any>(null);
  const [interpretation, setInterpretation] = useState("");
  const [limitations, setLimitations] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setScene(null);
    setEvidence(null);
    setInterpretation("");
    setLimitations([]);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setScene(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError("");
    setDiscoveryResults([]);
    
    try {
      const bboxArray = bbox.split(',').map(s => parseFloat(s.trim()));
      const res = await axios.post(`${API_URL}/discovery/search`, {
        bbox: bboxArray,
        start_date: startDate,
        end_date: endDate,
        sensor: sensor,
        max_cloud_cover: 20.0,
        max_results: 5
      });
      setDiscoveryResults(res.data.results);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleIngestDiscovery = async (productId: string, sceneSensor: string) => {
    setIngestingId(productId);
    setError("");
    
    try {
      const res = await axios.post(`${API_URL}/discovery/ingest`, {
        product_id: productId,
        sensor: sceneSensor
      });
      setScene(res.data);
      setEvidence(null);
      setInterpretation("");
      setLimitations([]);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ingestion failed");
    } finally {
      setIngestingId(null);
    }
  };

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scene || !query.trim()) return;
    setAnalyzing(true);
    setError("");
    setLimitations([]);
    setEvidence(null);
    setInterpretation("");
    
    try {
      const res = await axios.post(`${API_URL}/query`, {
        scene_id: scene.id,
        query: query
      });
      
      if (res.data.status === "completed") {
        setEvidence(res.data.evidence);
        setInterpretation(res.data.interpretation);
      } else {
        setLimitations(res.data.limitations || ["Unsupported or invalid query."]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Query failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <header className="border-b border-[#374151] pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f9fafb]">SatQuery AI</h1>
            <p className="text-sm text-[#9ca3af] mt-1">SIH26167: Multimodal Geospatial Analysis</p>
          </div>
          <div className="flex gap-4 text-xs text-[#9ca3af]">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1f2937] p-4 rounded-sm border border-[#374151]">
              <div className="flex border-b border-[#374151] mb-4">
                <button 
                  className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'upload' ? 'text-[#60a5fa] border-b-2 border-[#60a5fa]' : 'text-[#9ca3af] hover:text-[#d1d5db]'}`}
                  onClick={() => setActiveTab('upload')}
                >
                  Local Upload
                </button>
                <button 
                  className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'discovery' ? 'text-[#60a5fa] border-b-2 border-[#60a5fa]' : 'text-[#9ca3af] hover:text-[#d1d5db]'}`}
                  onClick={() => setActiveTab('discovery')}
                >
                  CDSE Discovery
                </button>
              </div>
              
              {activeTab === 'upload' ? (
                <div className="space-y-4">
                  <div className="border border-dashed border-[#4b5563] p-6 text-center hover:border-[#60a5fa] transition-colors cursor-pointer relative bg-[#111827]">
                    <input 
                      type="file" 
                      accept=".tif,.tiff" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-xs text-[#d1d5db] font-medium break-all">
                      {file ? file.name : "Select GeoTIFF"}
                    </p>
                  </div>

                  <button 
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#374151] disabled:text-[#9ca3af] text-white text-sm font-bold py-2 px-4 rounded-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    {loading ? "Processing..." : "Extract Metadata"}
                  </button>
                  
                  {error && <p className="text-[#f87171] text-xs p-2 bg-[#7f1d1d]/20 border border-[#7f1d1d]">{error}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSearch} className="space-y-3">
                    <div>
                      <label className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Bounding Box</label>
                      <input type="text" value={bbox} onChange={e => setBbox(e.target.value)} className="w-full bg-[#111827] border border-[#374151] p-2 text-xs text-white rounded-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Start Date</label>
                        <input type="text" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[#111827] border border-[#374151] p-2 text-xs text-white rounded-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">End Date</label>
                        <input type="text" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-[#111827] border border-[#374151] p-2 text-xs text-white rounded-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#9ca3af] uppercase tracking-wider block mb-1">Sensor</label>
                      <select value={sensor} onChange={e => setSensor(e.target.value)} className="w-full bg-[#111827] border border-[#374151] p-2 text-xs text-white rounded-sm">
                        <option value="sentinel-2">Sentinel-2 (Optical)</option>
                        <option value="sentinel-1">Sentinel-1 (SAR)</option>
                      </select>
                    </div>
                    <button 
                      type="submit"
                      disabled={searching}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#374151] disabled:text-[#9ca3af] text-white text-xs font-bold py-2 px-4 rounded-sm transition-all uppercase tracking-wide"
                    >
                      {searching ? "Searching..." : "Search CDSE"}
                    </button>
                  </form>
                  {error && <p className="text-[#f87171] text-xs p-2 bg-[#7f1d1d]/20 border border-[#7f1d1d]">{error}</p>}
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {discoveryResults.map((res: any) => (
                      <div key={res.id} className="bg-[#111827] border border-[#374151] p-3 rounded-sm flex flex-col gap-2">
                        <div className="text-xs text-[#d1d5db] font-bold break-all leading-tight">{res.name}</div>
                        <div className="text-[10px] text-[#9ca3af]">Acquired: {new Date(res.acquisition_time).toLocaleDateString()}</div>
                        <button
                          onClick={() => handleIngestDiscovery(res.id, res.sensor)}
                          disabled={ingestingId !== null}
                          className="mt-1 w-full bg-[#10b981] hover:bg-[#059669] disabled:bg-[#374151] text-white text-[10px] font-bold py-1.5 px-2 rounded-sm transition-all uppercase"
                        >
                          {ingestingId === res.id ? "Downloading..." : "Download & Ingest"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {scene && (
              <div className="bg-[#1f2937] p-4 rounded-sm border border-[#374151]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#d1d5db] mb-4">Query Interface</h3>
                
                <form onSubmit={handleQuery} className="space-y-4">
                  <div>
                    <label className="text-xs text-[#9ca3af] block mb-1">Ask about this scene:</label>
                    <textarea 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. Where is vegetation most dense?"
                      className="w-full bg-[#111827] border border-[#374151] p-2 text-sm text-white rounded-sm focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] outline-none min-h-[80px]"
                      disabled={analyzing}
                    />
                    {!query && !analyzing && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => setQuery("Where is vegetation strongest?")} className="text-[10px] bg-[#374151] hover:bg-[#4b5563] text-[#d1d5db] px-2 py-1 rounded-sm transition-colors">Where is vegetation strongest?</button>
                        <button type="button" onClick={() => setQuery("Where is water detected?")} className="text-[10px] bg-[#374151] hover:bg-[#4b5563] text-[#d1d5db] px-2 py-1 rounded-sm transition-colors">Where is water detected?</button>
                        <button type="button" onClick={() => setQuery("Compare VV and VH backscatter.")} className="text-[10px] bg-[#374151] hover:bg-[#4b5563] text-[#d1d5db] px-2 py-1 rounded-sm transition-colors">Compare VV and VH backscatter.</button>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={analyzing || !query.trim()}
                    className="w-full bg-[#059669] hover:bg-[#047857] disabled:bg-[#374151] disabled:text-[#9ca3af] text-white text-sm font-bold py-2 px-4 rounded-sm transition-all uppercase tracking-wide"
                  >
                    {analyzing ? "Analyzing..." : "Submit Query"}
                  </button>
                </form>

                {limitations.length > 0 && (
                  <div className="mt-4 p-4 border border-slate-700 bg-slate-800/50 rounded-sm">
                    <h4 className="text-sm font-bold text-slate-300 uppercase mb-2">Insufficient Evidence</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      SatQuery does not currently have an analysis tool that can reliably answer this question from this scene.
                    </p>
                    <div className="text-xs text-slate-300 mb-2 font-semibold">Available analysis capabilities:</div>
                    <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1 mb-3">
                      <li>Vegetation (NDVI)</li>
                      <li>Water (NDWI)</li>
                      <li>Sentinel-1 Backscatter (VV/VH)</li>
                    </ul>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide border-t border-slate-700 pt-2">
                      System Trace: {limitations[0]}
                    </div>
                  </div>
                )}
                
                {analyzing && (
                  <div className="mt-6 space-y-3">
                    <div className="h-4 bg-slate-800 rounded-sm w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-800 rounded-sm w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-slate-800 rounded-sm w-5/6 animate-pulse"></div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Loading Model (may take up to 20s)...</p>
                  </div>
                )}
              </div>
            )}
            
            {interpretation && (
              <div className="bg-[#1f2937] p-4 rounded-sm border border-[#374151]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#60a5fa] mb-2">Grounded Response</h3>
                <p className="text-sm text-[#e5e7eb] leading-relaxed">{interpretation}</p>
              </div>
            )}

            {evidence && evidence.statistics && (
              <div className="bg-[#1f2937] p-4 rounded-sm border border-[#374151]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#34d399] mb-4">Evidence Statistics</h3>
                <div className="space-y-2 text-xs">
                  {evidence.statistics.mean !== undefined && (
                    <div className="flex justify-between border-b border-[#374151] pb-1">
                      <span className="text-[#9ca3af]">Mean</span>
                      <span className="text-[#e5e7eb] font-mono">{evidence.statistics.mean.toFixed(4)}</span>
                    </div>
                  )}
                  {evidence.statistics.median !== undefined && (
                    <div className="flex justify-between border-b border-[#374151] pb-1">
                      <span className="text-[#9ca3af]">Median</span>
                      <span className="text-[#e5e7eb] font-mono">{evidence.statistics.median.toFixed(4)}</span>
                    </div>
                  )}
                  {evidence.statistics.ratio_mean !== undefined && (
                    <div className="flex justify-between border-b border-[#374151] pb-1">
                      <span className="text-[#9ca3af]">Ratio Mean</span>
                      <span className="text-[#e5e7eb] font-mono">{evidence.statistics.ratio_mean.toFixed(4)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-[#374151] pb-1">
                    <span className="text-[#9ca3af]">Valid Px</span>
                    <span className="text-[#e5e7eb] font-mono">{evidence.statistics.valid_pixels}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-[#030712] rounded-sm border border-[#374151] h-[700px] flex items-center justify-center relative overflow-hidden">
              {!scene ? (
                <div className="text-center text-[#4b5563] text-sm uppercase tracking-widest">
                  <p>Awaiting Scene Selection</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <div className="flex-1 relative z-0">
                    <MapViewer 
                      boundsJson={scene.bounds} 
                      overlayUrl={evidence ? `${API_URL}/${evidence.visualization_asset}` : undefined} 
                    />
                  </div>
                  <div className="bg-[#1f2937] p-4 border-t border-[#374151] flex flex-col sm:flex-row justify-between gap-6">
                    <div>
                      <h3 className="font-bold text-xs text-[#9ca3af] uppercase tracking-wider mb-2">Spatial Bounds</h3>
                      <code className="text-xs text-[#34d399] font-mono bg-[#111827] p-1.5 rounded-sm border border-[#374151] block">
                        {scene.bounds}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#9ca3af] uppercase tracking-wider mb-2">Data Provenance</h3>
                      <div className="flex flex-col gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide inline-block w-fit ${scene.source_type === 'SYNTHETIC_FIXTURE' ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/50' : 'bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/50'}`}>
                          {scene.source_type || "UNKNOWN_SOURCE"}
                        </span>
                        {scene.provenance?.description && (
                           <span className="text-xs text-[#d1d5db]">{scene.provenance.description}</span>
                        )}
                      </div>
                    </div>
                    {evidence && (
                      <div className="text-right">
                        <h3 className="font-bold text-xs text-[#9ca3af] uppercase tracking-wider mb-2">Evidence Export</h3>
                        <a href={`${API_URL}/${evidence.output_raster}`} className="inline-block text-xs text-white bg-[#2563eb] hover:bg-[#1d4ed8] font-bold py-1.5 px-3 rounded-sm transition-colors" download>
                          Download .tif
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
