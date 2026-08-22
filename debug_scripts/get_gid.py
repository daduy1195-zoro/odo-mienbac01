import urllib.request
import re

url = 'https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/htmlview'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'\[(\d+),\"([^\"]+)\"', html)
    found = False
    for gid, name in matches:
        print(f'{name} -> {gid}')
        if name == 'odo_data_2':
            found = True
    if not found:
        print("odo_data_2 not found. Maybe the sync script hasn't run yet.")
except Exception as e:
    print(f"Error: {e}")
