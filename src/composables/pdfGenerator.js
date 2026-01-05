/**
 * PDF Generation Utility
 * Uses html2pdf.js to convert HTML content to PDF
 *
 * Installation: npm install html2pdf.js
 */

import html2pdf from "html2pdf.js";

/**
 * Generate and download a PDF from HTML content
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} filename - The filename for the PDF (without extension)
 * @param {Object} options - Optional configuration
 * @returns {Promise<void>}
 */
export async function generatePDF(htmlContent, filename, options = {}) {
  const defaultOptions = {
    margin: [15, 15, 15, 15], // top, right, bottom, left in mm
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      before: ".page-break-before",
      after: ".page-break-after",
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    console.log("[PDF Generator] Starting PDF generation...");
    console.log("[PDF Generator] Filename:", mergedOptions.filename);

    // Create a temporary container
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "210mm"; // A4 width
    document.body.appendChild(container);

    // Generate PDF
    await html2pdf().set(mergedOptions).from(container).save();

    // Cleanup
    document.body.removeChild(container);

    console.log("[PDF Generator] PDF generated successfully");
  } catch (error) {
    console.error("[PDF Generator] Failed to generate PDF:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

/**
 * Generate PDF as Blob (for previewing or uploading)
 * @param {string} htmlContent - The HTML content to convert
 * @param {Object} options - Optional configuration
 * @returns {Promise<Blob>}
 */
export async function generatePDFBlob(htmlContent, options = {}) {
  const defaultOptions = {
    margin: [15, 15, 15, 15],
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "210mm";
    document.body.appendChild(container);

    const pdfBlob = await html2pdf()
      .set(mergedOptions)
      .from(container)
      .output("blob");

    document.body.removeChild(container);

    return pdfBlob;
  } catch (error) {
    console.error("[PDF Generator] Failed to generate PDF blob:", error);
    throw new Error(`PDF blob generation failed: ${error.message}`);
  }
}

/**
 * Fallback PDF generation using browser print dialog
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} filename - The filename for the PDF
 */
export function generatePDFPrintFallback(htmlContent, filename) {
  console.log("[PDF Generator] Using print fallback method");

  // Open new window with content
  const printWindow = window.open("", "_blank", "width=800,height=600");

  if (!printWindow) {
    alert("Please allow popups to download the PDF");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: Georgia, serif;
            line-height: 1.6;
            color: #1a1a1a;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Close after print dialog is dismissed
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
  };
}

/**
 * Main export function with automatic fallback
 * @param {string} htmlContent - The HTML content to convert
 * @param {string} filename - The filename for the PDF (without extension)
 * @param {Object} options - Optional configuration
 * @returns {Promise<void>}
 */
export async function downloadPDF(htmlContent, filename, options = {}) {
  try {
    // Try html2pdf first
    await generatePDF(htmlContent, filename, options);
  } catch (error) {
    console.error("[PDF Generator] html2pdf failed, using fallback:", error);
    // Fallback to print dialog
    generatePDFPrintFallback(htmlContent, filename);
  }
}
