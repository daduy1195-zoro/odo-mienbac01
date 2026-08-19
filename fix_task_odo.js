const fs = require("fs");
let content = fs.readFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/task.md", "utf8");
content = content.replace("- [ ] S?a d?i hàm `syncEmployeeOdo()`", "- [x] S?a d?i hàm `syncEmployeeOdo()`");
content = content.replace("- [ ] Load d? li?u t? `ARCHIVE_TAB_ODO`", "- [x] Load d? li?u t? `ARCHIVE_TAB_ODO`");
content = content.replace("- [ ] T?o bi?n Map `ArchiveMap`", "- [x] T?o bi?n Map `ArchiveMap`");
content = content.replace("- [ ] Load d? li?u t? Form Responses (Live)", "- [x] Load d? li?u t? Form Responses (Live)");
content = content.replace("- [ ] Ghi dè các dòng Live vào `ArchiveMap`", "- [x] Ghi dè các dòng Live vào `ArchiveMap`");
content = content.replace("- [ ] Build m?ng k?t qu? và ghi l?i vào Archive", "- [x] Build m?ng k?t qu? và ghi l?i vào Archive");
content = content.replace("- [ ] Báo cáo hoàn thành", "- [x] Báo cáo hoàn thành");
fs.writeFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/task.md", content);

