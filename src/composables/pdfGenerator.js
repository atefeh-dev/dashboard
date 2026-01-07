/**
 * @file pdfGenerator.js
 * @location src/composables/pdfGenerator.js
 *
 * Professional PDF generation with improved formatting
 */

/**
 * Load external library dynamically
 */
async function loadScript(src, globalName) {
  if (window[globalName]) {
    return window[globalName];
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log(`[PDF Generator] ${globalName} loaded`);
      resolve(window[globalName]);
    };
    script.onerror = () => reject(new Error(`Failed to load ${globalName}`));
    document.head.appendChild(script);
  });
}

/**
 * Apply professional formatting to content for PDF
 */
function applyProfessionalFormatting(container) {
  // Apply base styling to container
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 794px;
    padding: 60px;
    background: white;
    font-family: Georgia, serif;
    font-size: 14px;
    line-height: 1.8;
    color: #000;
  `;

  // Style all headings
  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => {
    const tag = heading.tagName.toLowerCase();

    if (tag === "h1") {
      heading.style.fontSize = "20px";
      heading.style.fontWeight = "bold";
      heading.style.marginTop = "0";
      heading.style.marginBottom = "30px";
      heading.style.paddingBottom = "15px";
      heading.style.lineHeight = "1.3";
    } else if (tag === "h2") {
      heading.style.fontSize = "18px";
      heading.style.fontWeight = "bold";
      heading.style.marginTop = "35px";
      heading.style.marginBottom = "18px";
      heading.style.paddingBottom = "8px";
      heading.style.lineHeight = "1.4";
    } else if (tag === "h3") {
      heading.style.fontSize = "16px";
      heading.style.fontWeight = "bold";
      heading.style.marginTop = "25px";
      heading.style.marginBottom = "12px";
      heading.style.lineHeight = "1.4";
    }
  });

  // Style all paragraphs
  const paragraphs = container.querySelectorAll("p");
  paragraphs.forEach((p) => {
    p.style.marginBottom = "16px";
    p.style.lineHeight = "1.8";
    p.style.textAlign = "justify";
  });

  // Style lists
  const lists = container.querySelectorAll("ul, ol");
  lists.forEach((list) => {
    list.style.marginTop = "12px";
    list.style.marginBottom = "20px";
    list.style.paddingLeft = "30px";
    list.style.lineHeight = "1.5";
  });

  const listItems = container.querySelectorAll("li");
  listItems.forEach((li) => {
    li.style.marginBottom = "10px";
    li.style.lineHeight = "1.5";
  });

  // Style divs with padding/margin
  const divs = container.querySelectorAll("div");
  divs.forEach((div) => {
    // If div has background color, ensure proper spacing
    const bgColor = window.getComputedStyle(div).backgroundColor;
    if (
      bgColor &&
      bgColor !== "rgba(0, 0, 0, 0)" &&
      bgColor !== "transparent"
    ) {
      div.style.marginTop = "25px";
      div.style.marginBottom = "25px";
      div.style.padding = "20px";
    }
  });

  // Style strong/bold text
  const strongElements = container.querySelectorAll("strong, b");
  strongElements.forEach((el) => {
    el.style.fontWeight = "bold";
    el.style.color = "#000";
  });

  // Ensure all text is visible
  const allElements = container.querySelectorAll("*");
  allElements.forEach((el) => {
    // Ensure text color is visible
    const color = window.getComputedStyle(el).color;
    if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
      el.style.color = "#000";
    }

    // Remove problematic styles
    el.style.userSelect = "auto";
    el.style.webkitUserSelect = "auto";
  });
}

/**
 * Method 1: Using jsPDF with html2canvas (Most Reliable)
 */
async function generatePDFWithJsPDF(htmlContent, filename) {
  try {
    console.log("[PDF Generator] Method 1: Using jsPDF + html2canvas");

    // Load libraries
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "html2canvas"
    );
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      "jspdf"
    );

    const { jsPDF } = window.jspdf;

    // Create container
    const container = document.createElement("div");
    container.innerHTML = htmlContent;

    // Apply professional formatting
    applyProfessionalFormatting(container);

    // Append to body temporarily
    document.body.appendChild(container);

    // Wait for images to load
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    console.log("[PDF Generator] Capturing content as canvas...");

    // Capture as canvas with high quality
    const canvas = await window.html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional formatting on cloned document
        const clonedContainer = clonedDoc.querySelector("div");
        if (clonedContainer) {
          applyProfessionalFormatting(clonedContainer);
        }
      },
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save
    pdf.save(`${filename}.pdf`);

    // Cleanup
    document.body.removeChild(container);

    console.log("[PDF Generator] PDF generated successfully with jsPDF");
    return true;
  } catch (error) {
    console.error("[PDF Generator] jsPDF method failed:", error);
    throw error;
  }
}

/**
 * Method 2: Simple print with styled iframe
 */
function generatePDFWithPrint(htmlContent, filename) {
  console.log("[PDF Generator] Method 2: Using browser print");

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position: absolute; width: 0; height: 0; border: none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }
          
          body {
            font-family: Georgia, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #000;
            background: white;
            padding: 20mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 30px 0;
            padding-bottom: 15px;
            line-height: 1.3;
            page-break-after: avoid;
          }
          
          h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 35px 0 18px 0;
            padding-bottom: 8px;
            line-height: 1.4;
            page-break-after: avoid;
          }
          
          h3 {
            font-size: 16px;
            font-weight: bold;
            margin: 25px 0 12px 0;
            line-height: 1.4;
            page-break-after: avoid;
          }
          
          p {
            margin: 0 0 16px 0;
            line-height: 1.8;
            text-align: justify;
            orphans: 3;
            widows: 3;
          }
          
          ul, ol {
            margin: 12px 0 20px 0;
            padding-left: 30px;
            line-height: 1.8;
          }
          
          li {
            margin-bottom: 10px;
            line-height: 1.8;
          }
          
          div {
            margin: 15px 0;
          }
          
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          strong, b {
            font-weight: bold;
            color: #000;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  doc.close();

  // Wait and print
  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    // Cleanup after a delay
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);

  console.log("[PDF Generator] Print dialog opened");
}

/**
 * Method 3: Direct download as HTML (fallback)
 */
function downloadAsHTML(htmlContent, filename) {
  console.log("[PDF Generator] Method 3: Downloading as HTML");

  const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        <style>
          body {
            font-family: Georgia, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #000;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background: white;
          }
          h1 { margin: 0 0 30px 0; font-size: 24px; }
          h2 { margin: 35px 0 18px 0; font-size: 18px; }
          h3 { margin: 25px 0 12px 0; font-size: 16px; }
          p { margin: 0 0 16px 0; line-height: 1.8; }
          ul, ol { margin: 12px 0 20px 0; padding-left: 30px; }
          li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);

  console.log("[PDF Generator] HTML file downloaded");
}

/**
 * Main PDF download function with automatic fallbacks
 */
export async function downloadPDF(
  htmlContent,
  filename = "document",
  options = {}
) {
  console.log("[PDF Generator] Starting PDF generation");
  console.log("[PDF Generator] Content length:", htmlContent?.length || 0);

  // Validate content
  if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p></p>") {
    throw new Error(
      "No content available. Please ensure the document has content."
    );
  }

  try {
    // Try Method 1: jsPDF + html2canvas (most reliable)
    await generatePDFWithJsPDF(htmlContent, filename);
  } catch (error) {
    console.warn(
      "[PDF Generator] Primary method failed, trying print fallback"
    );

    // Ask user which fallback to use
    const usePrint = confirm(
      "PDF generation failed. Would you like to:\n\n" +
        "• Click OK to use browser print (Save as PDF)\n" +
        "• Click Cancel to download as HTML file"
    );

    if (usePrint) {
      generatePDFWithPrint(htmlContent, filename);
    } else {
      downloadAsHTML(htmlContent, filename);
    }
  }
}

/**
 * Alternative: Use print dialog directly
 */
export function generatePDFPrintFallback(htmlContent, filename = "document") {
  console.log("[PDF Generator] Using print dialog fallback");

  if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p></p>") {
    alert("No content available to print.");
    return;
  }

  generatePDFWithPrint(htmlContent, filename);
}

/**
 * Preview content in new window
 */
export function previewContent(htmlContent) {
  console.log("[PDF Generator] Opening preview window");

  const previewWindow = window.open("", "_blank", "width=900,height=800");

  if (!previewWindow) {
    alert("Pop-up blocked. Please allow pop-ups to preview.");
    return;
  }

  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Document Preview</title>
        <style>
          body {
            font-family: Georgia, serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #000;
            max-width: 800px;
            margin: 20px auto;
            padding: 40px;
            background: #f5f5f5;
          }
          
          .content {
            background: white;
            padding: 60px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .header {
            background: #3b82f6;
            color: white;
            padding: 15px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
          }
          
          .actions {
            margin-top: 20px;
            padding: 15px;
            background: #f0f9ff;
            border-top: 2px solid #3b82f6;
          }
          
          button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
          }
          
          button:hover {
            background: #2563eb;
          }
          
          /* Professional formatting */
          h1 { margin: 0 0 30px 0; font-size: 24px; line-height: 1.3; }
          h2 { margin: 35px 0 18px 0; font-size: 18px; line-height: 1.4; }
          h3 { margin: 25px 0 12px 0; font-size: 16px; }
          p { margin: 0 0 16px 0; line-height: 1.8; }
          ul, ol { margin: 12px 0 20px 0; padding-left: 30px; }
          li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <h2 style="margin: 0;">📄 Document Preview</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">
              This is how your content will appear in the PDF
            </p>
          </div>
          
          <div class="document-content">
            ${htmlContent}
          </div>
          
          <div class="actions">
            <button onclick="window.print()">🖨️ Print / Save as PDF</button>
            <button onclick="window.close()">❌ Close Preview</button>
          </div>
        </div>
      </body>
    </html>
  `);

  previewWindow.document.close();
}
