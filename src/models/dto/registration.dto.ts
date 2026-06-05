export type RegistrationStatus =
  | "Validated"
  | "Unvalidated";

export interface ParentRequest {
  name: string;
  birthYear: number;
  occupation: string;
  education: string;
  monthlyIncome: string;
  nik: string;
}

export interface GuardianRequest {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface StudentRequest {
  fullName: string;
  nisn: string;
  nik: string;
  nokk: string;
  birthPlace: string;
  birthDate: Date;
  gender: string;
  religion: string;
  address: {
    street: string;
    rt: string;
    rw: string;
    village: string;
    district: string;
    postalCode: string;
  };
  childOrder: number;
  kindergartenOrigin: string;
}

export default interface RegistrationRequest {
  registrationNumber?: string;

  status: RegistrationStatus;

  student: StudentRequest;

  father: ParentRequest;

  mother: ParentRequest;

  contactPhoneNumber: string;

  hasGuardian?: boolean;

  guardian?: GuardianRequest;
}