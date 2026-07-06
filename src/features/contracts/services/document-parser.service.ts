import mammoth from "mammoth";

// Next.js Node environment polyfills for pdf-parse (pdf.js requires DOM objects even for text extraction)
if (typeof global !== "undefined") {
  if (!global.DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {};
  }
  if (!global.Path2D) {
    (global as any).Path2D = class Path2D {};
  }
  if (!global.ImageData) {
    (global as any).ImageData = class ImageData {};
  }
}

const pdfParse = require("pdf-parse");

export interface ParsedDocument {
  text: string;
  pageCount: number;
  wordCount: number;
}

export class DocumentParserService {
  /**
   * Downloads a file from a remote URL (Cloudinary) and extracts its text.
   */
  static async parseFromUrl(fileUrl: string, originalFilename: string = ""): Promise<ParsedDocument> {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download file from Cloudinary: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";
    let pageCount = 0;

    const lowerUrl = fileUrl.toLowerCase();
    const lowerFilename = originalFilename.toLowerCase();

    try {
      if (lowerFilename.endsWith(".docx") || lowerUrl.endsWith(".docx")) {
        const docxData = await mammoth.extractRawText({ buffer });
        text = docxData.value;
        pageCount = Math.max(1, Math.ceil(text.length / 3000));
      } else if (lowerFilename.endsWith(".txt") || lowerUrl.endsWith(".txt")) {
        text = buffer.toString("utf-8");
        pageCount = Math.max(1, Math.ceil(text.length / 3000));
      } else if (lowerFilename.endsWith(".pdf") || lowerUrl.endsWith(".pdf") || (lowerUrl.includes("cloudinary.com") && !lowerFilename)) {
        // Assume PDF if it has .pdf or comes from Cloudinary without a known filename extension
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
        pageCount = pdfData.numpages || Math.max(1, Math.ceil(text.length / 3000));
      } else {
        // Fallback: try parsing as PDF first, then DOCX, then TXT
        try {
          const pdfData = await pdfParse(buffer);
          text = pdfData.text;
          pageCount = pdfData.numpages || Math.max(1, Math.ceil(text.length / 3000));
        } catch (e) {
          try {
            const docxData = await mammoth.extractRawText({ buffer });
            text = docxData.value;
            pageCount = Math.max(1, Math.ceil(text.length / 3000));
          } catch (e2) {
            text = buffer.toString("utf-8");
            pageCount = Math.max(1, Math.ceil(text.length / 3000));
          }
        }
      }
    } catch (error: any) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }

    // Clean up excessive whitespace
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    return { text, pageCount, wordCount };
  }
}
