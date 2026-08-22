import re

with open('C:\\Users\\MSI\\Desktop\\AI\\Odo\\index.html', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Update header scan logic
search_hdr = """                  if (h.includes('s` km phAt sinh tng') || h.includes('km phAt sinh tng')) colKmOver = ci;
                  }
                  // Financial columns (scan tt c dAng header)
                  if ((h.includes('t ng chi phA') || h.includes('t ng ti?n') || h.includes('tong chi phi') || (h.includes('t ng') && h.includes('phA')) || h === 't ng') && !h.includes('km')) colTotalCost = ci;
                  if ((h.includes('`n giA') && (h.includes('thAng') || h.includes('thang'))) || h.includes('giA thAng') || h.includes('thuA/thAng') || h.includes('thue/thang')) colMonthlyRate = ci;
                  if ((h.includes('`n giA') && (h.includes('ngAy') || h.includes('ngay'))) || h.includes('giA ngAy') || h.includes('thuA/ngAy') || h.includes('thue/ngay')) colDailyRate = ci;
                  if (h.includes('c u `?ng') || h.includes('giA c u') || h.includes('phA c u') || h.includes('cau duong')) colTollFee = ci;
                  if (h.includes('ngAy l.') || h.includes('ngay le') || h.includes('l. tt')) colHolidayFee = ci;
                  if (h.includes('vt km') || h.includes('km vt') || h.includes('phA vt') || h.includes('vuot km')) colKmOverFee = ci;"""

# Need to search for it using clean text because encoding in terminal output above might be messed up
