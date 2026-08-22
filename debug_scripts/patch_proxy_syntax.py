import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """                  const [empResult, supResult] = await Promise.all([
                      fetchViaProxy('employee'),
                      fetchViaProxy('supplier'),
                  ]);
                  let masterResultRows = await fetchSheetJSONP(CONFIG.SHEET_MASTER_ID, CONFIG.SHEET_MASTER_GID).catch(e => []);
                  if (!masterResultRows || masterResultRows.length === 0) {
                      const masterProxy = await fetchViaProxy('master').catch(e => ({rows: []}));
                      masterResultRows = masterProxy.rows || [];
                  }
                  ]);"""

replace = """                  const [empResult, supResult] = await Promise.all([
                      fetchViaProxy('employee'),
                      fetchViaProxy('supplier')
                  ]);
                  let masterResultRows = await fetchSheetJSONP(CONFIG.SHEET_MASTER_ID, CONFIG.SHEET_MASTER_GID).catch(e => []);
                  if (!masterResultRows || masterResultRows.length === 0) {
                      const masterProxy = await fetchViaProxy('master').catch(e => ({rows: []}));
                      masterResultRows = masterProxy.rows || [];
                  }"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched Proxy syntax!")
else:
    print("Not found!")
