with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', encoding='utf-8') as f:
    code = f.read()
lines = code.split('\n')
for i, line in enumerate(lines):
    if 'updateFilters' in line and 'change' in line:
        print(line.strip())
