export interface Review {
  id: string;
  rating: number;
  comment: string;
  // Add more fields as needed
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  imageUrl?: string; // Made optional
  availableSlots: string[]; // e.g., "Mon, Oct 28, 09:00 AM"
  rating: number; // e.g. 4.5
  experience: number; // years of experience
  location: string; // e.g. "Sanjeevani OPD, Satara" (This is the OPD name)
  city: string; // e.g. "Satara"
  reviews: Review[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string; // Name entered during booking
  patientId?: string; // ID of the logged-in patient who booked
  appointmentTime: string;
  notes?: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  status?: 'upcoming' | 'done' | 'no_show' | 'cancelled';
}

export enum ModalType {
  NONE,
  BOOKING,
  MY_APPOINTMENTS,
  AUTH_PATIENT,
  AUTH_DOCTOR,
}

// User types for authentication
export interface PatientUser {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored for demo; in real app, use a hash
  type: 'patient';
}

export interface DoctorUser {
  id: string; // This will be the doctor's ID from DOCTORS_DATA
  username: string;
  name: string; // Doctor's display name
  type: 'doctor';
}

export type CurrentUser = PatientUser | DoctorUser | null;