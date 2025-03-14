declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    info: Record<string, any>;
  }
  
  function parse(buffer: Buffer): Promise<PDFData>;
  export = parse;
}
