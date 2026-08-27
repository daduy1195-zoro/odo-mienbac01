const fs = require('fs');
let code = fs.readFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', 'utf8');

code = code.replace(
    '                    </tbody>\n                </table>\n            </div>`;',
    '                    </tbody>\n                </table></div>\n            </div>`;'
);

code = code.replace(
    '                    </tbody>\r\n                </table>\r\n            </div>`;',
    '                    </tbody>\r\n                </table></div>\r\n            </div>`;'
);

fs.writeFileSync('C:/Users/MSI/Desktop/AI/Odo/index.html', code);
