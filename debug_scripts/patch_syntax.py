with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

content = content.replace('            ghnHtml += `</div>`;\n\n\n\n', '            ghnHtml += `</div>`;\n        }\n\n\n\n')

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'w', encoding='utf8') as f:
    f.write(content)
print("Patched syntax!")
