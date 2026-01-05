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
import { parseExtractedMedicineData } from './parse-extracted-medicine-data';

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


const extractMedicineDetailsFromImageFlow = ai.defineFlow(
  {
    name: 'extractMedicineDetailsFromImageFlow',
    inputSchema: ExtractMedicineDetailsFromImageInputSchema,
    outputSchema: ExtractMedicineDetailsFromImageOutputSchema,
  },
  async input => {
    // Call googleAI vision model to extract text
    const visionResponse = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: [
        {
          media: {url: input.photoDataUri},
        },
        {
          text: 'Extract all text from this image of a medicine label.',
        },
      ],
    });

    const extractedText = visionResponse.text;

    // Call the parsing flow
    const parsedData = await parseExtractedMedicineData({ extractedText });

    return {
        medicineName: parsedData.name,
        dosage: parsedData.dosage,
        instructions: parsedData.instructions
    };
  }
);