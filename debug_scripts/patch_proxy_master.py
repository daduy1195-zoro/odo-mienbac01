with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    lines = f.read().split('\n')

for i in range(len(lines)):
    if "const [empResult, supResult, masterResult] = await Promise.all([" in lines[i]:
        # replace the Promise.all
        lines[i] = "                const [empResult, supResult] = await Promise.all(["
        lines[i+3] = "                ]);"
        
        lines.insert(i+4, "                let masterResultRows = await fetchSheetJSONP(CONFIG.SHEET_MASTER_ID, CONFIG.SHEET_MASTER_GID).catch(e => []);")
        lines.insert(i+5, "                if (!masterResultRows || masterResultRows.length === 0) {")
        lines.insert(i+6, "                    const masterProxy = await fetchViaProxy('master').catch(e => ({rows: []}));")
        lines.insert(i+7, "                    masterResultRows = masterProxy.rows || [];")
        lines.insert(i+8, "                }")
        break

for i in range(len(lines)):
    if "masterRowsGH = masterResult.rows || [];" in lines[i]:
        lines[i] = "                masterRowsGH = masterResultRows;"
        break

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write('\n'.join(lines))
print("Patched Proxy!")
