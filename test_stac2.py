import requests

STAC_URL = "https://stac.dataspace.copernicus.eu/v1/search"
payload = {
    "bbox": [12.45, 41.89, 12.55, 41.95],
    "datetime": "2023-08-01T00:00:00Z/2023-08-10T23:59:59Z",
    "limit": 5
}
res = requests.post(STAC_URL, json=payload)
if res.status_code == 200:
    data = res.json()
    for feat in data.get('features', []):
        print(feat['id'], "->", feat['collection'])
else:
    print(res.status_code, res.text)
