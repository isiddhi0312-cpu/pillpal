"use client";

import { useApp } from "@/lib/app-context";
import { AddMedicineDialog } from "@/components/dashboard/add-medicine-dialog";
import { MedicineCard } from "@/components/dashboard/medicine-card";

export default function MedicinesPage() {
  const { medicines } = useApp();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">My Medicines</h1>
          <p className="text-muted-foreground">
            Manage all your medication profiles here.
          </p>
        </div>
        <AddMedicineDialog />
      </div>

      {medicines.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {medicines.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg py-24">
          <h2 className="text-xl font-semibold">No Medicines Yet</h2>
          <p className="text-muted-foreground mb-4">Add your first medicine to get started.</p>
          <AddMedicineDialog />
        </div>
      )}
    </div>
  );
}

    