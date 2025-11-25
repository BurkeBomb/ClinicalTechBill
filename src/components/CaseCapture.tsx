
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const caseSchema = z.object({
  patientName: z.string().min(3, "Patient name is required"),
  surgeonName: z.string().min(3, "Surgeon name is required"),
  hospitalName: z.string().min(3, "Hospital name is required"),
  procedureName: z.string().min(5, "Procedure name is required"),
  referringDoctorName: z.string().min(3, "Referring doctor name is required"),
  icd10Code: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface Props {
  userId: string;
}

const CaseCapture: React.FC<Props> = ({ userId }) => {
  const [images, setImages] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
  });

  const onSubmit = async (data: CaseFormData) => {
    const caseData = {
      ...data,
      userId,
      status: "DRAFT",
      createdAt: Date.now(),
      caseImages: images,
    };
    const newCaseRef = doc(collection(db, `users/${userId}/cases`));
    await setDoc(newCaseRef, caseData);
    reset();
    setImages([]);
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-4">New Case Intake</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {["patientName", "surgeonName", "hospitalName", "procedureName", "referringDoctorName", "icd10Code"].map((field) => (
          <div key={field}>
            <input {...register(field as keyof CaseFormData)} placeholder={field} className="w-full border p-2 rounded" />
            {errors[field as keyof CaseFormData] && <p className="text-red-500">{errors[field as keyof CaseFormData]?.message}</p>}
          </div>
        ))}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          {isSubmitting ? "Creating..." : "Create Case"}
        </button>
      </form>
    </div>
  );
};

export default CaseCapture;
