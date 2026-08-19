const fs = require("fs");
let content = fs.readFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/task.md", "utf8");
content = content.replace("- [ ] C?p nh?t `index.html`", "- [x] C?p nh?t `index.html`");
content = content.replace("- [ ] C?p nh?t `SyncOdoToArchive.gs`", "- [x] C?p nh?t `SyncOdoToArchive.gs`");
fs.writeFileSync("C:/Users/MSI/.gemini/antigravity/brain/c7e65cba-7a2c-4fec-9c6c-dd170166bef5/task.md", content);

