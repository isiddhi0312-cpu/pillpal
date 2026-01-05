export interface Schedule {
  frequency: 'daily' | 'twice-daily' | 'weekly';
  times: string[]; // e.g., ["09:00", "21:00"]
  days?: number[]; // For weekly, 0 = Sunday, 1 = Monday, etc.
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  schedule: Schedule;
  imageUrl?: string;
}

export interface AdherenceLog {
  id: string;
  medicineId: string;
  medicineName: string;
  takenAt: Date;
  scheduledTime: string;
}
