export type RegistrationStatus =
  | "validated"
  | "unvalidated";

export interface ParentRequest {
  name: string;
  birthYear: string;
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
  noKk: string;
  birthPlace: string;
  birthDate: string;
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
  childOrder: string;
  numberOfSiblings: string;
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