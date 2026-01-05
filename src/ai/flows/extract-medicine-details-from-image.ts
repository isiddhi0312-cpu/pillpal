'use server';
/**
 * @fileOverview Extracts medicine details from an image using OCR and AI parsing.
 *
 * - extractMedicineDetailsFromImage - A function that handles the medicine detail extraction process.
 * - ExtractMedicineDetailsFromImageInput - The input type for the extractMedicineDetailsFromImage function.
 * - ExtractMedicineDetailsFromImageOutput - The return type for the extractMedicineDetailsFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMedicineDetailsFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractMedicineDetailsFromImageInput = z.infer<typeof ExtractMedicineDetailsFromImageInputSchema>;

const ExtractMedicineDetailsFromImageOutputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine.'),
  dosage: z.string().describe('The dosage of the medicine.'),
  instructions: z.string().describe('The instructions for taking the medicine.'),
});
export type ExtractMedicineDetailsFromImageOutput = z.infer<typeof ExtractMedicineDetailsFromImageOutputSchema>;

export async function extractMedicineDetailsFromImage(
  input: ExtractMedicineDetailsFromImageInput
): Promise<ExtractMedicineDetailsFromImageOutput> {
  return extractMedicineDetailsFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMedicineDetailsFromImagePrompt',
  input: {schema: ExtractMedicineDetailsFromImageInputSchema},
  output: {schema: ExtractMedicineDetailsFromImageOutputSchema},
  prompt: `You are an AI assistant that extracts medicine details from an image of a medicine label.

  Analyze the following text extracted from the image and identify the medicine name, dosage, and instructions.
  Return the information in a structured JSON format.
  Make your best guess, and if a field cannot be determined, mark it as unknown.

  Extracted Text: {{ extractText }}
  `,
});

const extractMedicineDetailsFromImageFlow = ai.defineFlow(
  {
    name: 'extractMedicineDetailsFromImageFlow',
    inputSchema: ExtractMedicineDetailsFromImageInputSchema,
    outputSchema: ExtractMedicineDetailsFromImageOutputSchema,
  },
  async input => {
    // Call googleAI vision model
    const visionResponse = await ai.generate({
      model: 'gemini-vision-1.5-flash',
      prompt: [
        {
          media: {url: input.photoDataUri},
        },
        {
          text: 'Extract the text from this medicine label',
        },
      ],
      config: {
        // Explicitly ask for text extraction
        responseModalities: ['TEXT'],
      },
    });

    const extractedText = visionResponse.text;

    const {output} = await prompt({
      extractText: extractedText,
    });

    return output!;
  }
);
