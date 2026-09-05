import requests

url = "https://stac.dataspace.copernicus.eu/v1/collections"
all_cols = []
while url:
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        all_cols.extend([c['id'] for c in data.get('collections', [])])
        url = None
        for link in data.get('links', []):
            if link.get('rel') == 'next':
                url = link['href']
                break
    else:
        print("Error:", res.status_code, res.text)
        break

print(f"Total collections: {len(all_cols)}")
print("Sentinel collections:", [c for c in all_cols if 'SENTINEL' in c.upper()])
