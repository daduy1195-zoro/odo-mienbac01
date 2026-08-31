import re
with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add sheet to config
new_sheet = "{ id: '1bpahLTCIP7gUnEmn0zaQpKGxu7MS2NBVhCTxTVg_XAM', gid: '0', ncc: 'ALL' }"
html = html.replace("{ id: '1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo', gid: '0', ncc: 'ALL' }", 
                    "{ id: '1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo', gid: '0', ncc: 'ALL' },\n        " + new_sheet)

# Add sheet ID to parseNccTabData condition
html = html.replace("sheetId.includes('1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo')",
                    "sheetId.includes('1uzpRdyDq-ayFgpos6rWXDcJDC7OL3r5fzct_E4mMYgo') || sheetId.includes('1bpahLTCIP7gUnEmn0zaQpKGxu7MS2NBVhCTxTVg_XAM')")

with open('C:/Users/MSI/Desktop/AI\Odo\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
