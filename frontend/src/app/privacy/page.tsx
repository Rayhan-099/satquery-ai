export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#111827] text-[#e5e7eb] p-8 font-mono">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="border-b border-[#374151] pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[#f9fafb]">Privacy Policy</h1>
          <p className="text-sm text-[#9ca3af] mt-1">Data usage and retention</p>
        </header>
        <div className="prose prose-invert max-w-none text-sm text-[#d1d5db]">
          <p>SatQuery AI respects your privacy. Uploaded GeoTIFFs and derived metadata are temporarily stored to perform geospatial analysis.</p>
          <p>Queries and generated evidence may be logged to improve the AI Orchestrator's reasoning capabilities, but they are not shared with third parties.</p>
          <p>No PII (Personally Identifiable Information) is permanently extracted from uploaded raster metadata unless explicitly required by the analysis scope.</p>
          <a href="/" className="text-[#60a5fa] hover:underline mt-4 inline-block">Return Home</a>
        </div>
      </div>
    </main>
  );
}
