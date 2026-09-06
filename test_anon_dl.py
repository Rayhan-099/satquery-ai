import requests
import sys

# Get a product
url = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=Collection/Name eq 'SENTINEL-2' and contains(Name, 'MSIL2A') and Online eq true&$top=1"
res = requests.get(url)
prod = res.json()['value'][0]
prod_id = prod['Id']
print("Product:", prod['Name'])

# Try to get the quicklook which is usually public
ql_url = f"https://catalogue.dataspace.copernicus.eu/odata/v1/Products({prod_id})/Products('Quicklook')/$value"
res = requests.get(ql_url)
print("Quicklook status:", res.status_code)

# Try to download the actual product (which should require auth)
dl_url = f"https://catalogue.dataspace.copernicus.eu/odata/v1/Products({prod_id})/$value"
res = requests.get(dl_url, allow_redirects=False)
print("Download status (redirect?):", res.status_code)
if res.status_code in (301, 302, 303, 307):
    print("Redirects to:", res.headers.get('Location'))
    # try following redirect
    res2 = requests.get(res.headers.get('Location'))
    print("Final status:", res2.status_code)
