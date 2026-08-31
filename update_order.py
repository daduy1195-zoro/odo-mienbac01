import re

with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract all ALL sheets
all_sheets_block_match = re.search(r'(\s*// THCP.*?ncc: \'ALL\' \}\s*)\]', html, re.DOTALL)
if all_sheets_block_match:
    all_sheets = all_sheets_block_match.group(1)
    # Remove them from the end
    html = html.replace(all_sheets, '')
    
    # Prepend to the beginning of the array
    html = html.replace('NCC_TRIP_SHEETS: [', 'NCC_TRIP_SHEETS: [' + all_sheets + ',')

with open('C:/Users/MSI/Desktop/AI/Odo/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
