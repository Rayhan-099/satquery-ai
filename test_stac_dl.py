import requests
import json

stac_url = "https://stac.dataspace.copernicus.eu/v1/search"
payload = {
    "collections": ["SENTINEL-2"],
    "bbox": [12.45, 41.89, 12.55, 41.95],
    "datetime": "2023-08-01T00:00:00Z/2023-08-10T23:59:59Z",
    "limit": 1
}
res = requests.post(stac_url, json=payload)
data = res.json()
if 'features' in data and len(data['features']) > 0:
    feat = data['features'][0]
    print("Item:", feat['id'])
    for name, asset in feat.get('assets', {}).items():
        print("Asset:", name, "href:", asset.get('href'))
        # Try downloading one asset (e.g. quicklook or a band if available)
        if 'href' in asset:
            r = requests.get(asset['href'], allow_redirects=False)
            print("  Status:", r.status_code)
