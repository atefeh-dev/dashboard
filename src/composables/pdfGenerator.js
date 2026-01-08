/**
 * @file pdfGenerator.js
 * @location src/composables/pdfGenerator.js
 *
 * Professional PDF generation with smart page break handling
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
 * Smart function to prevent orphaned headings and ensure proper page-aware layout
 * Prevents headings from appearing at bottom of pages without sufficient content
 */
function preventOrphanedHeadings(container) {
  const A4_HEIGHT_PX = 1123; // A4 height at 96 DPI (297mm)
  const MARGIN_TOP_PX = 94; // Top margin in pixels
  const MARGIN_BOTTOM_PX = 106; // Bottom margin in pixels
  const PAGE_PADDING = MARGIN_TOP_PX + MARGIN_BOTTOM_PX;
  const DANGER_ZONE = 180; // Increased: Pixels from bottom where headings/sections are dangerous
  const MIN_CONTENT_AFTER_HEADING = 100; // Increased: Minimum space needed for content after heading

  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = rect.top - containerRect.top;

    // Calculate position in current page
    const effectivePageHeight = A4_HEIGHT_PX - PAGE_PADDING;
    const pageNumber = Math.floor(relativeTop / effectivePageHeight);
    const pageStartY = pageNumber * effectivePageHeight;
    const positionInPage = relativeTop - pageStartY;
    const distanceFromBottom = effectivePageHeight - positionInPage;

    // Collect all next siblings until we hit another heading
    let totalContentHeight = 0;
    let currentElement = heading.nextElementSibling;
    const contentElements = [];

    while (currentElement && !/^H[1-6]$/.test(currentElement.tagName)) {
      contentElements.push(currentElement);
      totalContentHeight += currentElement.getBoundingClientRect().height + 10; // Add spacing
      currentElement = currentElement.nextElementSibling;

      // Cap at reasonable amount for this check
      if (contentElements.length > 5 || totalContentHeight > 300) break;
    }

    const requiredSpace =
      rect.height +
      Math.min(totalContentHeight, MIN_CONTENT_AFTER_HEADING) +
      20;

    // If heading + content won't fit in danger zone, push to next page
    if (
      distanceFromBottom < requiredSpace &&
      distanceFromBottom < DANGER_ZONE
    ) {
      const pushDistance = distanceFromBottom + 40;
      console.log(
        `[PDF Generator] Pushing heading "${heading.textContent.substring(
          0,
          40
        )}..." by ${pushDistance}px (distance: ${distanceFromBottom}px, required: ${requiredSpace}px)`
      );

      const currentMargin = parseInt(heading.style.marginTop) || 0;
      heading.style.marginTop = `${currentMargin + pushDistance}px`;
      heading.style.marginBottom = "8px";
    }

    // Keep next element(s) tight with heading
    if (contentElements.length > 0 && contentElements[0]) {
      const firstElement = contentElements[0];
      if (firstElement && !/^H[1-6]$/.test(firstElement.tagName)) {
        firstElement.style.marginTop = "0";
        firstElement.style.paddingTop = "0";
      }
    }
  });
}

/**
 * Apply professional legal document formatting for PDF
 * Conforms to formal contract standards suitable for NDAs, service agreements, etc.
 * Issues addressed:
 * - Professional serif typography
 * - Consistent vertical rhythm and spacing normalization
 * - Party information structure and styling
 * - Proper text wrapping and hyphenation
 * - Page-safe margins and footer preparation
 */
function applyProfessionalFormatting(container) {
  // A4 width: 210mm = 794px at 96 DPI
  // Professional margins: 25mm (top), 20mm (left/right), 30mm (bottom for footer safety)
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 794px;
    padding: 94px 40px 120px 40px;
    background: white;
    font-family: Calibri, "Segoe UI", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  `;

  // Style all headings with strong professional hierarchy
  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => {
    const tag = heading.tagName.toLowerCase();

    if (tag === "h1") {
      // Main title - strong visual prominence
      heading.style.fontSize = "16pt";
      heading.style.fontWeight = "700";
      heading.style.marginTop = "0";
      heading.style.marginBottom = "12px";
      heading.style.paddingBottom = "0";
      heading.style.lineHeight = "1.4";
      heading.style.letterSpacing = "0px";
      heading.style.color = "#000";
      heading.style.textTransform = "uppercase";
      heading.style.textAlign = "center";
      heading.style.pageBreakAfter = "avoid";
      heading.style.pageBreakInside = "avoid";
    } else if (tag === "h2") {
      // Major section headers - numbered sections like "1. Purpose"
      heading.style.fontSize = "11pt";
      heading.style.fontWeight = "700";
      heading.style.marginTop = "10px";
      heading.style.marginBottom = "8px";
      heading.style.paddingBottom = "6px";
      heading.style.lineHeight = "1.4";
      heading.style.color = "#000";
      heading.style.pageBreakAfter = "avoid";
      heading.style.pageBreakInside = "avoid";
      // Subtle divider line under section heading
      heading.style.borderBottom = "1px solid #d5dce0";
    } else if (tag === "h3") {
      // Subsection headers - like "DISCLOSING PARTY"
      heading.style.fontSize = "11pt";
      heading.style.fontWeight = "700";
      heading.style.marginTop = "8px";
      heading.style.marginBottom = "6px";
      heading.style.lineHeight = "1.4";
      heading.style.color = "#000";
      heading.style.pageBreakAfter = "avoid";
      heading.style.pageBreakInside = "avoid";
      heading.style.textTransform = "uppercase";
      heading.style.letterSpacing = "0.5px";
      heading.style.fontVariant = "small-caps";
    } else if (tag === "h4" || tag === "h5" || tag === "h6") {
      // Minor headers
      heading.style.fontSize = "11pt";
      heading.style.fontWeight = "700";
      heading.style.marginTop = "8px";
      heading.style.marginBottom = "4px";
      heading.style.lineHeight = "1.4";
      heading.style.color = "#1a1a1a";
      heading.style.pageBreakAfter = "avoid";
    }
  });

  // Style all paragraphs with proper legal document spacing
  const paragraphs = container.querySelectorAll("p");
  paragraphs.forEach((p) => {
    p.style.margin = "0 0 8px 0";
    p.style.lineHeight = "1.55";
    p.style.textAlign = "justify";
    p.style.orphans = "3";
    p.style.widows = "3";
    p.style.color = "#1a1a1a";
    p.style.hyphens = "auto";
    p.style.WebkitHyphens = "auto";
    p.style.msHyphens = "auto";
    p.style.wordBreak = "break-word";
    p.style.overflowWrap = "break-word";
    p.style.wordWrap = "break-word";
  });

  // Special styling for party information sections (NAME, ADDRESS, EMAIL)
  const labels = container.querySelectorAll("strong");
  labels.forEach((label) => {
    const text = label.textContent.trim().toUpperCase();
    if (["NAME", "ADDRESS", "EMAIL"].includes(text)) {
      label.style.display = "block";
      label.style.marginTop = "6px";
      label.style.marginBottom = "2px";
      label.style.fontWeight = "700";
      label.style.fontSize = "10pt";
      label.style.color = "#000";
      label.style.textTransform = "uppercase";
      label.style.letterSpacing = "0.3px";
    }
  });

  // Style party information blocks for better visual grouping
  const allText = container.innerHTML;
  const partyPatterns = [
    "DISCLOSING PARTY",
    "RECEIVING PARTY",
    "PARTNER",
    "EMPLOYER",
    "EMPLOYEE",
    "CLIENT",
    "SERVICE PROVIDER",
    "CONSULTANT",
  ];

  // Find sections with party information and add special spacing
  let currentHeading = null;
  const partyElements = Array.from(container.children);
  partyElements.forEach((el) => {
    if (
      /^H[2-3]$/.test(el.tagName) &&
      partyPatterns.some((p) => el.textContent.includes(p))
    ) {
      currentHeading = el;
      el.style.marginTop = "8px";
    } else if (currentHeading && /^(P|H[4-6])$/.test(el.tagName)) {
      if (el.textContent.match(/^(Name|Address|Email):/i)) {
        el.style.marginLeft = "20px";
        el.style.marginBottom = "4px";
      }
    }
  });

  // Ensure all text is visible and properly rendered
  const allElements = container.querySelectorAll("*");

  // Style numbered and bulleted lists with proper rendering and page control
  const lists = container.querySelectorAll("ul, ol");
  lists.forEach((list) => {
    list.style.margin = "6px 0 8px 0";
    list.style.paddingLeft = "28px";
    list.style.lineHeight = "1.55";
    list.style.pageBreakInside = "avoid";
    // Ensure list markers are visible
    list.style.listStyle = list.tagName === "OL" ? "decimal" : "disc";
    list.style.listStylePosition = "outside";
  });

  const listItems = container.querySelectorAll("li");
  listItems.forEach((li) => {
    li.style.margin = "2px 0 2px 0";
    li.style.lineHeight = "1.55";
    li.style.paddingLeft = "0";
    li.style.color = "#1a1a1a";
    li.style.wordBreak = "break-word";
    li.style.overflowWrap = "break-word";
    li.style.pageBreakInside = "avoid";
    // Critical: Proper bullet-text vertical centering
    li.style.display = "list-item";
    li.style.textAlign = "left";
    li.style.verticalAlign = "middle";
  });

  // Normalize section spacing - critical for formal documents
  const sections = container.querySelectorAll("section, article, .section");
  sections.forEach((section, idx) => {
    if (idx > 0) {
      section.style.marginTop = "0"; // Consistent spacing maintained by headings
    }
    section.style.marginBottom = "0";
    section.style.pageBreakInside = "avoid";
  });

  // Style divs with padding/margin (for callout boxes, etc)
  const divs = container.querySelectorAll("div");
  divs.forEach((div) => {
    const bgColor = window.getComputedStyle(div).backgroundColor;
    if (
      bgColor &&
      bgColor !== "rgba(0, 0, 0, 0)" &&
      bgColor !== "transparent"
    ) {
      div.style.margin = "12px 0";
      div.style.padding = "12px";
      div.style.border = "1px solid #ccc";
      div.style.pageBreakInside = "avoid";
    }
  });

  // Style strong/bold text
  const strongElements = container.querySelectorAll("strong, b");
  strongElements.forEach((el) => {
    const text = el.textContent.trim().toUpperCase();
    // Don't override party information labels (handled above)
    if (!["NAME", "ADDRESS", "EMAIL"].includes(text)) {
      el.style.fontWeight = "700";
      el.style.color = "#000";
    }
  });

  // Style emphasized text
  const emElements = container.querySelectorAll("em, i");
  emElements.forEach((el) => {
    el.style.fontStyle = "italic";
    el.style.color = "#1a1a1a";
  });

  // Ensure all text is visible and properly rendered
  const visibleElements = container.querySelectorAll("*");
  visibleElements.forEach((el) => {
    const color = window.getComputedStyle(el).color;
    if (color === "rgba(0, 0, 0, 0)" || color === "transparent") {
      el.style.color = "#1a1a1a";
    }
    el.style.userSelect = "auto";
    el.style.webkitUserSelect = "auto";
    // Text wrapping for long content
    if (el.tagName === "P" || el.tagName === "LI" || el.tagName === "TD") {
      el.style.wordBreak = "break-word";
      el.style.overflowWrap = "break-word";
      el.style.hyphens = "auto";
    }
  });
}

/**
 * Method 1: Using jsPDF with html2canvas and smart heading detection
 */
async function generatePDFWithJsPDF(htmlContent, filename) {
  try {
    console.log(
      "[PDF Generator] Method 1: Using jsPDF + html2canvas with smart breaks"
    );

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

    // CRITICAL: Wait for layout to fully settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Smart heading adjustment to prevent orphans
    preventOrphanedHeadings(container);

    // Wait again after adjustments for reflow
    await new Promise((resolve) => setTimeout(resolve, 150));

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
 * Method 2: Browser print (BEST for page breaks)
 */
function generatePDFWithPrint(htmlContent, filename) {
  console.log("[PDF Generator] Method 2: Using browser print (recommended)");

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
            margin-top: 25mm;
            margin-right: 20mm;
            margin-bottom: 30mm;
            margin-left: 20mm;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
              counter-reset: page;
            }
            
            /* Force headings to stay with content and avoid orphans */
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
              break-after: avoid-page !important;
              break-inside: avoid !important;
            }
            
            /* Keep lists with their headings */
            h1 + ul, h1 + ol,
            h2 + ul, h2 + ol,
            h3 + ul, h3 + ol,
            h4 + ul, h4 + ol,
            h5 + ul, h5 + ol,
            h6 + ul, h6 + ol {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            
            /* Keep first paragraph with heading */
            h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p {
              page-break-before: avoid !important;
              break-before: avoid !important;
            }
            
            /* Prevent list splitting */
            ul, ol {
              page-break-inside: avoid !important;
            }
            
            li {
              page-break-inside: avoid !important;
            }
            
            /* Prevent isolated paragraphs */
            p {
              orphans: 3;
              widows: 3;
            }
            
            section, article, .section {
              page-break-inside: avoid !important;
            }
          }
          
          body {
            font-family: Calibri, "Segoe UI", Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
            padding: 25mm 20mm 30mm 20mm;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          h1 {
            font-size: 16pt;
            font-weight: 700;
            margin: 0 0 12px 0;
            padding-bottom: 0;
            line-height: 1.4;
            color: #000;
            text-transform: uppercase;
            text-align: center;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          
          h2 {
            font-size: 11pt;
            font-weight: 700;
            margin: 10px 0 8px 0;
            padding-bottom: 6px;
            line-height: 1.4;
            color: #000;
            page-break-after: avoid;
            page-break-inside: avoid;
            border-bottom: 1px solid #d5dce0;
          }
          
          h3 {
            font-size: 11pt;
            font-weight: 700;
            margin: 8px 0 6px 0;
            line-height: 1.4;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-variant: small-caps;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          
          h4, h5, h6 {
            font-weight: 700;
            font-size: 11pt;
            margin: 8px 0 4px 0;
            line-height: 1.4;
            color: #1a1a1a;
            page-break-after: avoid;
          }
          
          p {
            margin: 0 0 8px 0;
            line-height: 1.55;
            text-align: justify;
            orphans: 3;
            widows: 3;
            color: #1a1a1a;
            hyphens: auto;
            word-break: break-word;
            overflow-wrap: break-word;
          }
          
          ul, ol {
            margin: 6px 0 8px 0;
            padding-left: 28px;
            line-height: 1.55;
            page-break-inside: avoid;
            list-style: decimal outside;
          }
          
          ul {
            list-style: disc outside;
          }
          
          li {
            margin: 2px 0 2px 0;
            line-height: 1.55;
            color: #1a1a1a;
            word-break: break-word;
            overflow-wrap: break-word;
            page-break-inside: avoid;
            padding-left: 0;
            display: list-item;
            text-align: left;
            vertical-align: middle;
          }
          
          div {
            margin: 10px 0;
          }
          
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
          
          table {
            page-break-inside: avoid;
            width: 100%;
            border-collapse: collapse;
          }
          
          strong, b {
            font-weight: 700;
            color: #000;
          }
          
          em, i {
            font-style: italic;
            color: #1a1a1a;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);

  console.log("[PDF Generator] Print dialog opened");
}

/**
 * Method 3: Direct download as HTML
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
          @page {
            margin-top: 30mm;
            margin-right: 20mm;
            margin-bottom: 30mm;
            margin-left: 20mm;
          }
          
          @media print {
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            h1 + ul, h1 + ol, h2 + ul, h2 + ol, h3 + ul, h3 + ol, h4 + ul, h4 + ol, h5 + ul, h5 + ol, h6 + ul, h6 + ol {
              page-break-before: avoid !important;
            }
            h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p {
              page-break-before: avoid !important;
            }
            ul, ol {
              page-break-inside: avoid !important;
            }
            li {
              page-break-inside: avoid !important;
            }
          }
          
          body {
            font-family: Calibri, "Segoe UI", Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a1a1a;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background: white;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
          
          h1 { margin: 0 0 12px 0; font-size: 16pt; font-weight:700; color:#000; text-transform: uppercase; text-align: center; }
          h2 { margin: 10px 0 8px 0; padding-bottom: 6px; font-size: 11pt; font-weight:700; color:#000; border-bottom: 1px solid #d5dce0; }
          h3 { margin: 8px 0 6px 0; font-size: 11pt; font-weight:700; color:#000; text-transform: uppercase; letter-spacing: 0.5px; }
          p { margin: 0 0 8px 0; line-height: 1.55; orphans:3; widows:3; color:#1a1a1a; hyphens: auto; word-break: break-word; }
          ul, ol { margin: 6px 0 8px 0; padding-left: 28px; line-height: 1.55; page-break-inside: avoid; }
          ul { list-style: disc outside; }
          ol { list-style: decimal outside; }
          li { margin: 2px 0 2px 0; color:#1a1a1a; word-break: break-word; page-break-inside: avoid; padding-left: 0; display: list-item; line-height: 1.55; vertical-align: middle; }
          strong, b { font-weight:700; color:#000; }
          em, i { font-style:italic; color:#1a1a1a; }
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
 * Main PDF download function - Fast direct download with smart heading protection
 */
export async function downloadPDF(
  htmlContent,
  filename = "document",
  options = {}
) {
  console.log("[PDF Generator] Starting PDF generation");
  console.log("[PDF Generator] Content length:", htmlContent?.length || 0);

  if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p></p>") {
    throw new Error(
      "No content available. Please ensure the document has content."
    );
  }

  try {
    // Use fast jsPDF method with smart heading detection
    await generatePDFWithJsPDF(htmlContent, filename);
  } catch (error) {
    console.warn(
      "[PDF Generator] Fast PDF failed, using browser print fallback"
    );

    // Fallback to browser print if jsPDF fails
    generatePDFWithPrint(htmlContent, filename);
  }
}

/**
 * Alternative: Use print dialog directly
 */
export function generatePDFPrintFallback(htmlContent, filename = "document") {
  console.log("[PDF Generator] Using print dialog");

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
          @media print {
            .header, .actions {
              display: none;
            }
            body {
              background: white;
            }
            .content {
              box-shadow: none;
              padding: 0;
            }
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            h1 + ul, h1 + ol, h2 + ul, h2 + ol, h3 + ul, h3 + ol, h4 + ul, h4 + ol, h5 + ul, h5 + ol, h6 + ul, h6 + ol {
              page-break-before: avoid !important;
            }
            h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p {
              page-break-before: avoid !important;
            }
            ul, ol {
              page-break-inside: avoid !important;
            }
            li {
              page-break-inside: avoid !important;
            }
          }
          
          body {
            font-family: Calibri, "Segoe UI", Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a1a1a;
            max-width: 850px;
            margin: 20px auto;
            padding: 40px;
            background: #f8f8f8;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
          
          .content {
            background: white;
            padding: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-radius: 3px;
          }
          
          .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 16px 20px;
            margin: -40px -40px 28px -40px;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }
          
          .header h2 {
            margin: 0 0 4px 0;
            font-size: 15pt;
            color: white;
            border: none;
            text-transform: none;
          }
          
          .header p {
            margin: 0;
            font-size: 12pt;
            opacity: 0.95;
            color: white;
          }
          
          .actions {
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px solid #e0e0e0;
            display:flex;
            gap:12px;
          }
          
          button {
            background: #2c3e50;
            color: white;
            border: none;
            padding: 11px 20px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11pt;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          button:hover {
            background: #1a252f;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          h1 { 
            margin: 0 0 12px 0; 
            font-size: 16pt; 
            line-height: 1.4;
            font-weight:700;
            color:#000;
            text-transform: uppercase;
            text-align: center;
          }
          h2 { 
            margin: 10px 0 8px 0; 
            padding-bottom: 6px;
            font-size: 11pt; 
            line-height: 1.4;
            font-weight:700;
            color:#000;
            border-bottom: 1px solid #d5dce0;
          }
          h3 { 
            margin: 8px 0 6px 0; 
            font-size: 11pt;
            font-weight:700;
            color:#000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          p { margin: 0 0 8px 0; line-height: 1.55; color:#1a1a1a; hyphens: auto; word-break: break-word; }
          ul, ol { margin: 6px 0 8px 0; padding-left: 28px; line-height: 1.55; page-break-inside: avoid; }
          ul { list-style: disc outside; }
          ol { list-style: decimal outside; }
          li { margin: 2px 0 2px 0; color:#1a1a1a; word-break: break-word; page-break-inside: avoid; padding-left: 0; display: list-item; line-height: 1.55; vertical-align: middle; }
          strong, b { font-weight:700; color:#000; }
          em, i { font-style:italic; color:#1a1a1a; }
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
