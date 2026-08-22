with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', encoding='utf-8') as f:
    code = f.read()
lines = code.split('\n')
for i, line in enumerate(lines):
    if 'updateFilters' in line:
        print("\n---")
        for j in range(i-2, i+3):
            print(lines[j].strip())
