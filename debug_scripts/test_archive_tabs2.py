import urllib.request
import re

url = "https://docs.google.com/spreadsheets/d/174ZaGkN2_oTrDmNfY9Tr99zHxdvjX4lOVCMwlEcyvLU/htmlview"
req = urllib.request.Request(url)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'docs-sheet-tab-name[^>]*>(.*?)<', html)
        if matches:
            for m in matches:
                print(m)
        else:
            print("No matches")
except Exception as e:
    print("Error:", e)
