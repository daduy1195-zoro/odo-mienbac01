import urllib.request
import re

url = "https://docs.google.com/spreadsheets/d/1vI_rzcjX6F12SOm06QvEo9W2s5kiDjYcRtvm2kWuCXo/htmlview"
req = urllib.request.Request(url)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'name:\s*"([^"]+)",\s*gid:\s*"(\d+)"', html)
        if matches:
            for m in matches:
                print(m[0], m[1])
        else:
            print("No matches")
except Exception as e:
    print("Error:", e)
