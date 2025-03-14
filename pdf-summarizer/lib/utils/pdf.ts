import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const isPasswordProtected = async (file: File): Promise<boolean> => {
  try {
    await extractTextFromPDF(file);
    return false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message.toLowerCase().includes('password');
    }
    return false;
  }
};
