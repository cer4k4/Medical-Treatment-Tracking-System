export interface Patient {
  _id: string;
  tip?: string;
  title: string;
  status: string;
  creator: string;
  description: string;
  doctorName?: string;
  patientDefault: boolean;
  prescriptionsCount?: number;
}


export interface CreatePatientRequest {
  name: string;
  email: string;
  password: string;
  doctorId: string;
  phone?: string;
}

