import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """                  const [empResult, supResult, masterResult] = await Promise.all([
                      fetchViaProxy('employee'),
                      fetchViaProxy('supplier'),
                      fetchViaProxy('master')
                  ]);
                  
                  empRowsArrays = [empResult.rows || []];
                  supRows = supResult.rows || [];
                  masterRowsGH = masterResult.rows || [];"""

replace = """                  const [empResult, supResult] = await Promise.all([
                      fetchViaProxy('employee'),
                      fetchViaProxy('supplier')
                  ]);
                  
                  // Thử fetch master trực tiếp bằng JSONP để lấy full các cột (proxy có thể bị limit 10 cột)
                  let masterResultRows = await fetchSheetJSONP(CONFIG.SHEET_MASTER_ID, CONFIG.SHEET_MASTER_GID).catch(e => []);
                  if (!masterResultRows || masterResultRows.length === 0) {
                      const masterProxy = await fetchViaProxy('master').catch(e => ({rows: []}));
                      masterResultRows = masterProxy.rows || [];
                  }
                  
                  empRowsArrays = [empResult.rows || []];
                  supRows = supResult.rows || [];
                  masterRowsGH = masterResultRows;"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched!")
else:
    print("Search string not found!")
