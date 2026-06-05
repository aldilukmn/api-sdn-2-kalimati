import { Document } from "mongoose";

export type RegistrationStatus =
  | "Validated"
  | "Unvalidated";

export type Gender =
  | "Laki-laki"
  | "Perempuan";

export type Religion =
  | "Islam"
  | "Kristen"
  | "Katolik"
  | "Hindu"
  | "Buddha"
  | "Konghucu";

export interface Student {
  fullName: string;
  nisn?: string;
  nik: string;
  nokk: string;
  birthPlace: string;
  birthDate: Date;
  gender: Gender;
  religion: Religion;
  address: {
    street: string;
    rt: string;
    rw: string;
    village: string;
    district: string;
    postalCode: string;
  };
  childOrder: number;
  kindergartenOrigin?: string;
}

export interface Parent {
  name: string;
  birthYear: string;
  occupation: string;
  education: string;
  monthlyIncome: string;
  nik: string;
}

export interface Guardian {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export default interface Registration extends Document {
  registrationNumber: string;

  student: Student;
  
  father: Parent;
  
  mother: Parent;
  
  contactPhoneNumber: string;
  
  hasGuardian: boolean;
  guardian?: Guardian;
  
  createdAt?: Date;
  updatedAt?: Date;

  status: RegistrationStatus;
}