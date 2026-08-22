# -*- coding: utf-8 -*-
with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# In loadNccTripData and rematchNccTrips
# Find:
# if (!ghnTripMap.has(key)) { ghnTripMap.set(key, trip.tripCode); }
# Replace with array push

search1 = r"if \(!ghnTripMap\.has\(key\)\) \{\s*ghnTripMap\.set\(key, trip\.tripCode\);\s*\}"
replace1 = "if (!ghnTripMap.has(key)) ghnTripMap.set(key, [trip.tripCode]);\n                else { let arr = ghnTripMap.get(key); if (!arr.includes(trip.tripCode)) arr.push(trip.tripCode); }"
code = re.sub(search1, replace1, code)

search2 = r"if \(!ghnTripMap\.has\(mappedKey\)\) \{\s*ghnTripMap\.set\(mappedKey, trip\.tripCode\);\s*\}"
replace2 = "if (!ghnTripMap.has(mappedKey)) ghnTripMap.set(mappedKey, [trip.tripCode]);\n                        else { let arr = ghnTripMap.get(mappedKey); if (!arr.includes(trip.tripCode)) arr.push(trip.tripCode); }"
code = re.sub(search2, replace2, code)

search3 = r"if \(!ghnTripMap\.has\(key\)\) \{\s*ghnTripMap\.set\(key, tripCode\);\s*\}"
replace3 = "if (!ghnTripMap.has(key)) ghnTripMap.set(key, [tripCode]);\n                        else { let arr = ghnTripMap.get(key); if (!arr.includes(tripCode)) arr.push(tripCode); }"
code = re.sub(search3, replace3, code)

search4 = r"if \(!ghnTripMap\.has\(key\)\) ghnTripMap\.set\(key, trip\.tripCode\);"
replace4 = "if (!ghnTripMap.has(key)) ghnTripMap.set(key, [trip.tripCode]); else { let arr = ghnTripMap.get(key); if (!arr.includes(trip.tripCode)) arr.push(trip.tripCode); }"
code = re.sub(search4, replace4, code)

# ghnDriverMap
search5 = r"if \(!ghnDriverMap\.has\(driverKey\)\) ghnDriverMap\.set\(driverKey, trip\.tripCode\);"
replace5 = "if (!ghnDriverMap.has(driverKey)) ghnDriverMap.set(driverKey, [trip.tripCode]); else { let arr = ghnDriverMap.get(driverKey); if (!arr.includes(trip.tripCode)) arr.push(trip.tripCode); }"
code = re.sub(search5, replace5, code)

# Now reading:
# r.ghnTripCode = ghnTripMap.get(matchKey) || null;
search6 = r"r\.ghnTripCode = ghnTripMap\.get\(matchKey\) \|\| null;"
replace6 = "let codes = ghnTripMap.get(matchKey); r.ghnTripCode = codes ? codes.join(' | ') : null;"
code = re.sub(search6, replace6, code)

# let code = ghnTripMap.get(matchKey);
search7 = r"let code = ghnTripMap\.get\(matchKey\);"
replace7 = "let codeArr = ghnTripMap.get(matchKey); let code = codeArr ? codeArr.join(' | ') : null;"
code = re.sub(search7, replace7, code)

# code = ghnDriverMap.get(driverKey);
search8 = r"code = ghnDriverMap\.get\(driverKey\);"
replace8 = "let dCodeArr = ghnDriverMap.get(driverKey); code = dCodeArr ? dCodeArr.join(' | ') : null;"
code = re.sub(search8, replace8, code)

# parseNccTabData: let matchedTripCode = ghnTripMap.get(matchKey) || null;
search9 = r"let matchedTripCode = ghnTripMap\.get\(matchKey\) \|\| null;"
replace9 = "let mCodes = ghnTripMap.get(matchKey); let matchedTripCode = mCodes ? mCodes.join(' | ') : null;"
code = re.sub(search9, replace9, code)

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done part 1")
