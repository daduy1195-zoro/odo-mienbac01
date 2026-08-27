const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    /<\/tbody>[\s\r\n]*<\/table>[\s\r\n]*<\/div>`/,
    '</tbody>\n                </table></div>\n            </div>`'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
