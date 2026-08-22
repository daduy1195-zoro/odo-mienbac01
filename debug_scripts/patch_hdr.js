const fs = require('fs');
let code = fs.readFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', 'utf8');

const search = "if (h === 'lộ trình' || h === 'tuyến đường' || h.includes('điểm giao') || h === 'tuyến') colRoute = ci;";
const replace = search + "\n                if (h.includes('ngày') && h.includes('thực hiện')) colDate = ci;\n                if (h.includes('biển số')) colPlate = ci;\n                if (h === 'xe' || h.includes('loại xe')) colVehicle = ci;\n                if (h === 'chi' || h.includes('nhà cung cấp') || h === 'ncc') colNcc = ci;";

if (code.includes(search)) {
    code = code.replace(search, replace);
    // There are TWO occurrences of colRoute = ci! One for the header scanning in the inner loop, one for the outer fallback.
    // I should replace globally.
    code = code.split(search).join(replace);
    fs.writeFileSync('C:\\\\Users\\\\MSI\\\\Desktop\\\\AI\\\\Odo\\\\index.html', code);
    console.log('Success');
} else {
    console.log('Search string not found');
}
