const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    '                </table>\n            </div>`;',
    '                </table></div>\n            </div>`;'
);

code = code.replace(
    '                </table>\r\n            </div>`;',
    '                </table></div>\r\n            </div>`;'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
