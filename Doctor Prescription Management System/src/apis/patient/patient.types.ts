export interface Patient {
  _id: string;
  tip?: string;
  title?: string;
  status?: string;
  creator?: string;
  patient?: string;
  description?: string;
  doctorName?: string;
  patientDefault?: boolean;
  prescriptionsCount?: number;
}


export interface CreatePatientRequest {
  _id: string;
  tip?: string;
  title?: string;
  creator?: string;
  patient?: string;
  description?: string;
}

