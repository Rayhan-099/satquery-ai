import requests

stac_url = "https://stac.dataspace.copernicus.eu/v1/search"
payload = {
    "collections": ["SENTINEL-2"],
    "bbox": [12.45, 41.89, 12.55, 41.95],
    "limit": 1
}
res = requests.post(stac_url, json=payload)
print(res.status_code)
if res.status_code == 200:
    data = res.json()
    print(data.keys())
    if 'features' in data and len(data['features']) > 0:
        feat = data['features'][0]
        print("Item:", feat['id'])
        for name, asset in feat.get('assets', {}).items():
            print("Asset:", name, "href:", asset.get('href'))
            r = requests.head(asset['href'], allow_redirects=False)
            print("  Status:", r.status_code)
            break # just test one
