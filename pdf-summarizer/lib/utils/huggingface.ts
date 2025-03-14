import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export const summarizeText = async (text: string, length: 'short' | 'medium' | 'long') => {
  try {
    const maxLength = {
      short: 150,
      medium: 250,
      long: 400,
    }[length];

    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length: maxLength,
        min_length: Math.floor(maxLength * 0.6),
      },
    });

    return result.summary_text;
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};
