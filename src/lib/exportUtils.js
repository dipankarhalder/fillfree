import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export raw JSON data to a formatted Excel (.xlsx) file
 * @param {Array<Object>} data - Array of row objects to export
 * @param {string} fileName - Base filename (without extension)
 * @param {string} sheetName - Excel sheet name
 */
export function exportToExcel(data, fileName = 'export_data', sheetName = 'Sheet1') {
  if (!data || !data.length) {
    console.warn('exportToExcel: No data to export')
    return
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Auto-size columns based on maximum content length
  const colKeys = Object.keys(data[0] || {})
  const colWidths = colKeys.map(key => {
    let maxLen = key.length
    data.forEach(row => {
      const val = row[key]
      if (val !== undefined && val !== null) {
        const strVal = String(val)
        if (strVal.length > maxLen) {
          maxLen = Math.min(strVal.length, 50) // Cap at 50 chars
        }
      }
    })
    return { wch: Math.max(maxLen + 3, 12) }
  })
  worksheet['!cols'] = colWidths

  // Create workbook and write file
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31))

  const safeFileName = `${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(workbook, safeFileName)
}

/**
 * Convert an HTML element into a downloadable PDF document
 * @param {string} elementId - DOM element ID to capture
 * @param {string} fileName - PDF filename without extension
 */
export async function exportElementToPDF(elementId, fileName = 'document') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`exportElementToPDF: Element #${elementId} not found`)
    return false
  }

  try {
    // Generate high-resolution canvas screenshot
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Margin in mm
    const margin = 10
    const imgWidth = pageWidth - (margin * 2)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = margin

    // First page
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
    heightLeft -= (pageHeight - margin * 2)

    // Handle multi-page if content exceeds single A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= (pageHeight - margin * 2)
    }

    const safeFileName = `${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    pdf.save(safeFileName)
    return true
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    return false
  }
}

/**
 * Convert a numeric amount to Indian Rupee Currency Words
 * @param {number} amount
 * @returns {string} Words e.g. "One Lakh Ninety Nine Thousand Eight Hundred Rupees Only"
 */
export function numberToIndianWords(amount) {
  if (amount === 0) return 'Zero Rupees Only'
  if (!amount || isNaN(amount)) return ''

  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ]
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function inWords(num) {
    let str = ''
    if (num > 19) {
      str += b[Math.floor(num / 10)] + ' ' + a[num % 10]
    } else {
      str += a[num]
    }
    return str
  }

  let n = Math.floor(Math.abs(amount))
  let output = ''

  const crore = Math.floor(n / 10000000)
  n %= 10000000
  const lakh = Math.floor(n / 100000)
  n %= 100000
  const thousand = Math.floor(n / 1000)
  n %= 1000
  const hundred = Math.floor(n / 100)
  const rest = n % 100

  if (crore > 0) output += inWords(crore) + 'Crore '
  if (lakh > 0) output += inWords(lakh) + 'Lakh '
  if (thousand > 0) output += inWords(thousand) + 'Thousand '
  if (hundred > 0) output += inWords(hundred) + 'Hundred '
  if (rest > 0) {
    if (output !== '') output += 'and '
    output += inWords(rest)
  }

  return `Rupees ${output.trim()} Only`
}
