import requests

url = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=Collection/Name eq 'SENTINEL-2'&$top=1"
res = requests.get(url)
if res.status_code == 200:
    data = res.json()
    print("Found products:", len(data.get('value', [])))
    if data.get('value'):
        prod = data['value'][0]
        print("Product Name:", prod.get('Name'))
        print("Product ID:", prod.get('Id'))
        print("Attributes:", list(prod.keys()))
else:
    print("Error:", res.status_code, res.text)
