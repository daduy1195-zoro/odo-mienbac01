import urllib.request
import re

url = "https://docs.google.com/spreadsheets/d/1jFaJutdZD8uhBYa9Hy9fH6tHVaSnEf-iyg4VUMniXl8/htmlview"
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
