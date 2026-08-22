import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

search = """                        <option value="">Trạng thái</option>
                        <option value="MANUAL">✏️ Nhập mã...</option>
                        <option value="GHN OFF">GHN OFF</option>
                        <option value="NCC OFF">NCC OFF</option>
                        <option value="Phạt">Phạt</option>
                    </select>"""

replace = """                        <option value="">Trạng thái</option>
                        <option value="MANUAL">✏️ Nhập mã...</option>
                        <option value="GHN OFF" ${isGhnOff ? 'selected' : ''}>GHN OFF</option>
                        <option value="NCC OFF" ${isNccOff ? 'selected' : ''}>NCC OFF</option>
                        <option value="Phạt" ${isPhat ? 'selected' : ''}>Phạt</option>
                    </select>"""

if search in content:
    content = content.replace(search, replace)
    with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
        f.write(content)
    print("Patched selected successfully!")
else:
    print("Not found!")
