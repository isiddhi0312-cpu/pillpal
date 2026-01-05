"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Medicine, AdherenceLog, UserProfile } from '@/lib/types';
import { initialMedicines, initialAdherenceLogs, initialUserProfile } from '@/lib/data';

interface AppContextType {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id' | 'imageHint'>) => void;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  adherenceLogs: AdherenceLog[];
  logAdherence: (log: Omit<AdherenceLog, 'id'>) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [adherenceLogs, setAdherenceLogs] = useState<AdherenceLog[]>(initialAdherenceLogs);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);

  const addMedicine = (medicine: Omit<Medicine, 'id' | 'imageHint'>) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: new Date().toISOString(),
      imageHint: 'medicine',
    };
    setMedicines(prev => [newMedicine, ...prev]);
  };

  const updateMedicine = (updatedMedicine: Medicine) => {
    setMedicines(prev => prev.map(med => med.id === updatedMedicine.id ? updatedMedicine : med));
  };
  
  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id));
    setAdherenceLogs(prev => prev.filter(log => log.medicineId !== id));
  };

  const logAdherence = (log: Omit<AdherenceLog, 'id'>) => {
    const newLog: AdherenceLog = {
      ...log,
      id: new Date().toISOString(),
    };
    setAdherenceLogs(prev => [newLog, ...prev]);
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const value = {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    adherenceLogs,
    logAdherence,
    userProfile,
    updateUserProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
