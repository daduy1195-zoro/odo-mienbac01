import urllib.request
import re

url = 'https://docs.google.com/spreadsheets/d/1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo/htmlview'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'\[(\d+),\"([^\"]+)\"', html)
    for gid, name in matches:
        print(f'{name} -> {gid}')
except Exception as e:
    print(f"Error: {e}")
