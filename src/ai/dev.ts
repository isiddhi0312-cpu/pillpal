import { config } from 'dotenv';
config();

import '@/ai/flows/extract-medicine-details-from-image.ts';
import '@/ai/flows/parse-extracted-medicine-data.ts';