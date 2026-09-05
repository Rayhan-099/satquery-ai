import requests

url = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=Collection/Name eq 'SENTINEL-2' and contains(Name, 'MSIL2A') and Online eq true&$top=1"
res = requests.get(url)
prod = res.json()['value'][0]
print("Product:", prod['Name'], "Online:", prod['Online'])

prod_id = prod['Id']
nodes_url = f"https://catalogue.dataspace.copernicus.eu/odata/v1/Products({prod_id})/Nodes"
n_res = requests.get(nodes_url)
print("Root Nodes:", [n['Name'] for n in n_res.json().get('value', [])])
