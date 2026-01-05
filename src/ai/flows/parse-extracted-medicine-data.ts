'use server';

/**
 * @fileOverview Parses extracted text from a medicine label into structured data using AI.
 *
 * - parseExtractedMedicineData - A function that handles the parsing of extracted medicine data.
 * - ParseExtractedMedicineDataInput - The input type for the parseExtractedMedicineData function.
 * - ParseExtractedMedicineDataOutput - The return type for the parseExtractedMedicineData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseExtractedMedicineDataInputSchema = z.object({
  extractedText: z
    .string()
    .describe('The extracted text from the medicine label.'),
});
export type ParseExtractedMedicineDataInput = z.infer<typeof ParseExtractedMedicineDataInputSchema>;

const ParseExtractedMedicineDataOutputSchema = z.object({
  name: z.string().describe('The name of the medicine.'),
  dosage: z.string().describe('The dosage of the medicine.'),
  instructions: z.string().describe('The instructions for taking the medicine.'),
});
export type ParseExtractedMedicineDataOutput = z.infer<typeof ParseExtractedMedicineDataOutputSchema>;

export async function parseExtractedMedicineData(
  input: ParseExtractedMedicineDataInput
): Promise<ParseExtractedMedicineDataOutput> {
  return parseExtractedMedicineDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseExtractedMedicineDataPrompt',
  input: {schema: ParseExtractedMedicineDataInputSchema},
  output: {schema: ParseExtractedMedicineDataOutputSchema},
  prompt: `You are an AI assistant specialized in parsing medicine label text into structured data.

  Given the extracted text from a medicine label, identify and extract the following information:

  - Medicine Name: The brand name or generic name of the medicine.
  - Dosage: The strength or amount of the medicine to be taken.
  - Instructions: Specific instructions on how to take the medicine (e.g., \"Take one tablet daily with food\").

  Extracted Text: {{{extractedText}}}

  Please provide the structured data in the following format:
  {
    "name": "Medicine Name",
    "dosage": "Dosage",
    "instructions": "Instructions"
  }`,
});

const parseExtractedMedicineDataFlow = ai.defineFlow(
  {
    name: 'parseExtractedMedicineDataFlow',
    inputSchema: ParseExtractedMedicineDataInputSchema,
    outputSchema: ParseExtractedMedicineDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
