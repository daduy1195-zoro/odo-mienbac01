const fs = require("fs");
let content = fs.readFileSync("index.html", "utf8");

const target = `            // N?u là nhân viên h? tr? (ghi trong Ghi chú) ho?c nhân viên dã ngh? vi?c, không li?t kê Ngày Ngh? d? tránh r?i b?ng
            const isSupport = e.note && e.note.toLowerCase().includes('h? tr?');
            const isNghi = e.note && removeAccents(e.note.toLowerCase()).includes('nghi');
            if (isSupport || isNghi) {
                offDays = [];
                if (e.days.size === 0) return null;
            }`;

const replacement = `            // N?u là nhân viên h? tr? (ghi trong Ghi chú) ho?c fix c?ng ID
            const isSupport = (e.note && removeAccents(e.note.toLowerCase()).includes('ho tro')) || e.code === '3125207';
            const isNghi = e.note && removeAccents(e.note.toLowerCase()).includes('nghi');
            
            if (isSupport) {
                // H? tr?: Expected days ch? là nh?ng ngày CÓ phát sinh chuy?n trên Lastmile
                myExpectedDays = e.workedDays ? e.workedDays.size : 0;
                offDays = []; // Không tính ngày ngh?
                if (myExpectedDays === 0 && e.days.size === 0) return null; 
            } else if (isNghi) {
                offDays = [];
                if (e.days.size === 0) return null;
            }`;

content = content.replace(target, replacement);

const fallbackTarget = `            const isSupport = e.note && e.note.toLowerCase().includes('h- tr');
            const isNghi = e.note && removeAccents(e.note.toLowerCase()).includes('nghi');
            if (isSupport || isNghi) {
                offDays = [];
                if (e.days.size === 0) return null;
            }`;

content = content.replace(fallbackTarget, replacement);

fs.writeFileSync("index.html", content);
console.log("Updated support logic.");
