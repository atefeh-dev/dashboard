/**
 * @file pdfGenerator.js (v3 - PRODUCTION READY)
 * @location src/composables/pdfGenerator.js
 *
 * PROFESSIONAL PDF GENERATION FOR LEGAL DOCUMENTS
 * Uses pdfMake with proper margins that work in all scenarios
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
 * Convert HTML to pdfMake document definition
 */
function htmlToPdfMakeContent(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const content = [];

  function processNode(node, parentStyle = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (!text) return null;
      return { text, style: parentStyle.style || "normal" };
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      switch (tagName) {
        case "h1":
          return {
            text: node.textContent.trim(),
            style: "h1",
            margin: [0, 0, 0, 20],
          };

        case "h2":
          return {
            text: node.textContent.trim(),
            style: "h2",
            margin: [0, 18, 0, 10],
          };

        case "h3":
          return {
            text: node.textContent.trim(),
            style: "h3",
            margin: [0, 14, 0, 8],
          };

        case "p":
          const pChildren = [];
          node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              const text = child.textContent.trim();
              if (text) pChildren.push(text);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const processed = processNode(child, { style: "paragraph" });
              if (processed) pChildren.push(processed);
            }
          });

          if (pChildren.length === 0) return null;

          return {
            text: pChildren,
            style: "paragraph",
            margin: [0, 0, 0, 10],
            alignment: "justify",
          };

        case "ul":
          const ulItems = [];
          node.querySelectorAll(":scope > li").forEach((li) => {
            const itemContent = [];
            li.childNodes.forEach((child) => {
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) itemContent.push(text);
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                const processed = processNode(child, { style: "list" });
                if (processed) {
                  if (typeof processed === "string") {
                    itemContent.push(processed);
                  } else if (processed.text) {
                    itemContent.push(processed);
                  }
                }
              }
            });

            if (itemContent.length > 0) {
              ulItems.push(
                itemContent.length === 1 ? itemContent[0] : itemContent,
              );
            }
          });

          if (ulItems.length === 0) return null;

          return {
            ul: ulItems,
            style: "list",
            margin: [0, 8, 0, 12],
          };

        case "ol":
          const olItems = [];
          node.querySelectorAll(":scope > li").forEach((li) => {
            const itemContent = [];
            li.childNodes.forEach((child) => {
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text) itemContent.push(text);
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                const processed = processNode(child, { style: "list" });
                if (processed) {
                  if (typeof processed === "string") {
                    itemContent.push(processed);
                  } else if (processed.text) {
                    itemContent.push(processed);
                  }
                }
              }
            });

            if (itemContent.length > 0) {
              olItems.push(
                itemContent.length === 1 ? itemContent[0] : itemContent,
              );
            }
          });

          if (olItems.length === 0) return null;

          return {
            ol: olItems,
            style: "list",
            margin: [0, 8, 0, 12],
          };

        case "strong":
        case "b":
          return { text: node.textContent.trim(), bold: true };

        case "em":
        case "i":
          return { text: node.textContent.trim(), italics: true };

        case "div":
          const divChildren = [];
          node.childNodes.forEach((child) => {
            const processed = processNode(child, parentStyle);
            if (processed) divChildren.push(processed);
          });

          if (divChildren.length === 0) return null;

          const hasBackground =
            node.style.backgroundColor &&
            node.style.backgroundColor !== "transparent" &&
            node.style.backgroundColor !== "rgba(0, 0, 0, 0)";

          if (hasBackground) {
            return {
              stack: divChildren,
              margin: [0, 12, 0, 12],
              fillColor: "#f9f9f9",
            };
          }

          return divChildren.length === 1
            ? divChildren[0]
            : { stack: divChildren };

        case "br":
          return { text: "\n", margin: [0, 5, 0, 5] };

        case "span":
          const spanChildren = [];
          node.childNodes.forEach((child) => {
            const processed = processNode(child, parentStyle);
            if (processed) spanChildren.push(processed);
          });
          return spanChildren.length === 1
            ? spanChildren[0]
            : { text: spanChildren };

        default:
          const children = [];
          node.childNodes.forEach((child) => {
            const processed = processNode(child, parentStyle);
            if (processed) children.push(processed);
          });
          return children.length === 0
            ? null
            : children.length === 1
              ? children[0]
              : { stack: children };
      }
    }

    return null;
  }

  Array.from(doc.body.children).forEach((node) => {
    const processed = processNode(node);
    if (processed) {
      if (Array.isArray(processed)) {
        content.push(...processed);
      } else {
        content.push(processed);
      }
    }
  });

  console.log("[pdfMake] Converted content blocks:", content.length);
  return content;
}

/**
 * Generate PDF with pdfMake - PRODUCTION VERSION
 */
async function generatePDFWithPdfMake(htmlContent, filename) {
  try {
    console.log("[PDF Generator] Loading pdfMake...");

    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js",
      "pdfMake",
    );
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.min.js",
      "pdfFonts",
    );

    if (window.pdfMake && window.pdfMake.vfs === undefined && window.pdfFonts) {
      window.pdfMake.vfs = window.pdfFonts.pdfMake.vfs;
    }

    console.log("[PDF Generator] Converting HTML to PDF structure...");

    const content = htmlToPdfMakeContent(htmlContent);
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // PRODUCTION PDF CONFIGURATION - Legal Document Standard
    const docDefinition = {
      content: content,

      // ISO 216 Standard Margins for Legal Documents
      // 21mm left/right, 25mm top (40mm on pages 2+ for header), 32mm bottom (for footer)
      pageSize: "A4",
      pageMargins: [60, 70, 60, 90], // points (1mm = 2.83465pt) - [left, top, right, bottom]

      // Typography
      defaultStyle: {
        font: "Roboto",
        fontSize: 11,
        lineHeight: 1.5,
        color: "#1a1a1a",
      },

      styles: {
        h1: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          color: "#000000",
          margin: [0, 0, 0, 20],
          pageBreakBefore: function (currentNode, followingNodesOnPage) {
            return currentNode.startPosition.pageNumber > 1;
          },
        },
        h2: {
          fontSize: 12,
          bold: true,
          color: "#000000",
          margin: [0, 18, 0, 10],
          decoration: "underline",
          decorationStyle: "solid",
          decorationColor: "#d0d0d0",
        },
        h3: {
          fontSize: 11,
          bold: true,
          color: "#000000",
          margin: [0, 14, 0, 8],
        },
        paragraph: {
          fontSize: 11,
          lineHeight: 1.55,
          alignment: "justify",
          color: "#1a1a1a",
          margin: [0, 0, 0, 10],
        },
        list: {
          fontSize: 11,
          lineHeight: 1.55,
          color: "#1a1a1a",
          margin: [0, 8, 0, 12],
        },
        normal: {
          fontSize: 11,
          color: "#1a1a1a",
        },
      },

      // Professional Header - Filename left, Date right (legal standard)
      header: function (currentPage, pageCount, pageSize) {
        // Only show header on pages after the first (title page has no header)
        if (currentPage === 1) {
          return null;
        }

        return {
          stack: [
            {
              columns: [
                {
                  text:
                    filename.length > 40
                      ? filename.substring(0, 40) + "..."
                      : filename,
                  fontSize: 8,
                  color: "#787878",
                  alignment: "left",
                  width: "*",
                },
                {
                  text: today,
                  fontSize: 8,
                  color: "#787878",
                  alignment: "right",
                  width: "auto",
                },
              ],
              margin: [40, 20, 40, 8],
            },
            // Separator line below header
            {
              canvas: [
                {
                  type: "line",
                  x1: 40,
                  y1: 0,
                  x2: pageSize.width - 40,
                  y2: 0,
                  lineWidth: 0.5,
                  lineColor: "#d0d0d0",
                },
              ],
              margin: [0, 0, 0, 10],
            },
          ],
        };
      },

      // Professional Footer with Page Numbers
      footer: function (currentPage, pageCount, pageSize) {
        return {
          stack: [
            // Separator line
            {
              canvas: [
                {
                  type: "line",
                  x1: 40,
                  y1: 0,
                  x2: pageSize.width - 40,
                  y2: 0,
                  lineWidth: 0.5,
                  lineColor: "#d0d0d0",
                },
              ],
              margin: [0, 10, 0, 8],
            },
            // Footer text
            {
              columns: [
                {
                  text:
                    filename.length > 35
                      ? filename.substring(0, 35) + "..."
                      : filename,
                  fontSize: 8,
                  color: "#787878",
                  width: "*",
                  alignment: "left",
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  fontSize: 9,
                  color: "#646464",
                  width: "auto",
                  alignment: "center",
                },
                {
                  text: today,
                  fontSize: 8,
                  color: "#787878",
                  width: "*",
                  alignment: "right",
                },
              ],
              margin: [40, 0, 40, 20],
            },
          ],
        };
      },

      // PDF Metadata
      info: {
        title: filename,
        author: "Doclast",
        subject: "Legal Document",
        keywords: "legal, agreement, document",
        creator: "Doclast PDF Generator",
        producer: "pdfMake",
      },
    };

    console.log("[PDF Generator] Generating PDF...");
    window.pdfMake.createPdf(docDefinition).download(`${filename}.pdf`);
    console.log("[PDF Generator] ✅ PDF generated successfully");
    return true;
  } catch (error) {
    console.error("[PDF Generator] ❌ pdfMake failed:", error);
    throw error;
  }
}

/**
 * Browser print fallback
 */
function generatePDFWithPrint(htmlContent, filename) {
  console.log("[PDF Generator] Using browser print");

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position: absolute; width: 0; height: 0; border: none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <meta charset="UTF-8">
        <style>
          @page {
            size: A4;
            margin: 25mm 21mm 32mm 21mm;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
          }
          
          @media print {
            @page {
              @bottom-left {
                content: "${filename.substring(0, 30)}";
                font-size: 8pt;
                color: #787878;
              }
              @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 9pt;
                color: #646464;
              }
              @bottom-right {
                content: "${today}";
                font-size: 8pt;
                color: #787878;
              }
            }
            
            h1, h2, h3 {
              page-break-after: avoid;
            }
            
            ul, ol, div {
              page-break-inside: avoid;
            }
          }
          
          h1 {
            font-size: 16pt;
            font-weight: 700;
            margin: 0 0 20px 0;
            text-align: center;
          }
          
          h2 {
            font-size: 12pt;
            font-weight: 700;
            margin: 18px 0 10px 0;
            padding-bottom: 6px;
            border-bottom: 1px solid #d0d0d0;
          }
          
          h3 {
            font-size: 11pt;
            font-weight: 700;
            margin: 14px 0 8px 0;
          }
          
          p {
            margin: 0 0 10px 0;
            line-height: 1.55;
            text-align: justify;
          }
          
          ul, ol {
            margin: 8px 0 12px 0;
            padding-left: 20px;
          }
          
          li {
            margin: 0 0 6px 0;
            padding-left: 4px;
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
 * Main export
 */
export async function downloadPDF(
  htmlContent,
  filename = "document",
  options = {},
) {
  console.log("[PDF Generator] Starting PDF generation");

  if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p></p>") {
    throw new Error("No content available");
  }

  try {
    await generatePDFWithPdfMake(htmlContent, filename);
  } catch (error) {
    console.warn("[PDF Generator] Fallback to print dialog");
    generatePDFWithPrint(htmlContent, filename);
  }
}

export function printDocument(htmlContent, filename = "document") {
  if (!htmlContent || htmlContent.trim() === "") {
    alert("No content available to print.");
    return;
  }
  generatePDFWithPrint(htmlContent, filename);
}

export function previewContent(htmlContent) {
  const previewWindow = window.open("", "_blank", "width=900,height=900");
  if (!previewWindow) {
    alert("Pop-up blocked. Please allow pop-ups.");
    return;
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Document Preview</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #e8e8e8;
          }
          .content {
            background: white;
            max-width: 210mm;
            margin: 0 auto;
            padding: 25mm 21mm;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background: #2c3e50;
            color: white;
            padding: 16px;
            margin: -25mm -21mm 20px -21mm;
          }
          button {
            background: #2c3e50;
            color: white;
            border: none;
            padding: 12px 24px;
            margin: 20px 5px;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <h2 style="margin:0;">📄 Document Preview</h2>
          </div>
          ${htmlContent}
          <div style="margin-top:30px;text-align:center;">
            <button onclick="window.print()">🖨️ Print</button>
            <button onclick="window.close()">❌ Close</button>
          </div>
        </div>
      </body>
    </html>
  `);
  previewWindow.document.close();
}
