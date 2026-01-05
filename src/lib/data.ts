import type { Medicine, AdherenceLog } from '@/lib/types';
import { subDays, setHours, setMinutes } from 'date-fns';

export const initialMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    instructions: 'Take one tablet in the morning.',
    schedule: {
      frequency: 'daily',
      times: ['08:00'],
    },
    imageUrl: 'https://picsum.photos/seed/101/400/400',
    imageHint: 'pill bottle'
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    instructions: 'Take one tablet twice a day with meals.',
    schedule: {
      frequency: 'twice-daily',
      times: ['09:00', '20:00'],
    },
    imageUrl: 'https://picsum.photos/seed/102/400/400',
    imageHint: 'pills pack'
  },
  {
    id: '3',
    name: 'Atorvastatin',
    dosage: '20mg',
    instructions: 'Take one tablet at bedtime.',
    schedule: {
      frequency: 'daily',
      times: ['22:00'],
    },
    imageUrl: 'https://picsum.photos/seed/103/400/400',
    imageHint: 'pills'
  },
  {
    id: '4',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    instructions: 'Take one tablet every Sunday with breakfast.',
    schedule: {
      frequency: 'weekly',
      times: ['09:30'],
      days: [0], // Sunday
    },
    imageUrl: 'https://picsum.photos/seed/104/400/400',
    imageHint: 'vitamin bottle'
  },
];

export const initialAdherenceLogs: AdherenceLog[] = [
  // Simulate some adherence logs for the past week
  // Lisinopril (daily at 08:00)
  { id: 'l1', medicineId: '1', medicineName: 'Lisinopril', takenAt: setMinutes(setHours(subDays(new Date(), 1), 8), 5), scheduledTime: '08:00' },
  { id: 'l2', medicineId: '1', medicineName: 'Lisinopril', takenAt: setMinutes(setHours(subDays(new Date(), 2), 8), 2), scheduledTime: '08:00' },
  { id: 'l3', medicineId: '1', medicineName: 'Lisinopril', takenAt: setMinutes(setHours(subDays(new Date(), 4), 7), 58), scheduledTime: '08:00' },
  { id: 'l4', medicineId: '1', medicineName: 'Lisinopril', takenAt: setMinutes(setHours(subDays(new Date(), 5), 8), 10), scheduledTime: '08:00' },
  
  // Metformin (twice-daily at 09:00, 20:00)
  { id: 'm1a', medicineId: '2', medicineName: 'Metformin', takenAt: setMinutes(setHours(subDays(new Date(), 1), 9), 1), scheduledTime: '09:00' },
  { id: 'm1b', medicineId: '2', medicineName: 'Metformin', takenAt: setMinutes(setHours(subDays(new Date(), 1), 20), 15), scheduledTime: '20:00' },
  { id: 'm2a', medicineId: '2', medicineName: 'Metformin', takenAt: setMinutes(setHours(subDays(new Date(), 2), 9), 3), scheduledTime: '09:00' },
  // Missed evening dose on day 2
  { id: 'm3a', medicineId: '2', medicineName: 'Metformin', takenAt: setMinutes(setHours(subDays(new Date(), 3), 8), 55), scheduledTime: '09:00' },
  { id: 'm3b', medicineId: '2', medicineName: 'Metformin', takenAt: setMinutes(setHours(subDays(new Date(), 3), 20), 5), scheduledTime: '20:00' },
];

    