import { Doctor } from './types';

export const DOCTORS_DATA: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Priya Sharma',
    specialization: 'Cardiologist',
    bio: 'Dr. Sharma is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. She is passionate about preventive care.',
    // imageUrl: 'https://picsum.photos/seed/doc1/300/300', // Removed
    availableSlots: [
      'Today, 09:00 AM', 'Today, 09:30 AM', 'Today, 10:00 AM', 'Today, 02:00 PM', 'Today, 02:30 PM',
      'Tomorrow, 09:00 AM', 'Tomorrow, 10:30 AM', 'Tomorrow, 03:00 PM'
    ],
    rating: 4.8,
    experience: 15,
    location: "Sanjeevani OPD",
    city: "Satara",
  },
  {
    id: 'doc2',
    name: 'Dr. Rohan Patel',
    specialization: 'Pediatrician',
    bio: 'Dr. Patel is a dedicated pediatrician known for his friendly approach with children. He has expertise in child development and common pediatric illnesses.',
    // imageUrl: 'https://picsum.photos/seed/doc2/300/300', // Removed
    availableSlots: [
      'Today, 08:00 AM', 'Today, 08:30 AM', 'Today, 11:00 AM', 'Today, 03:00 PM',
      'Tomorrow, 08:30 AM', 'Tomorrow, 11:30 AM', 'Tomorrow, 04:00 PM'
    ],
    rating: 4.9,
    experience: 12,
    location: "Arogya Clinic",
    city: "Satara",
  },
  {
    id: 'doc3',
    name: 'Dr. Ananya Reddy',
    specialization: 'Dermatologist',
    bio: 'Dr. Reddy specializes in medical and cosmetic dermatology. She provides comprehensive skin care solutions, from acne treatment to anti-aging therapies.',
    // imageUrl: 'https://picsum.photos/seed/doc3/300/300', // Removed
    availableSlots: [
      'Today, 10:00 AM', 'Today, 10:30 AM', 'Today, 11:30 AM', 'Today, 01:00 PM',
      'Tomorrow, 10:00 AM', 'Tomorrow, 01:30 PM', 'Tomorrow, 02:00 PM'
    ],
    rating: 4.7,
    experience: 10,
    location: "Sahyadri Polyclinic",
    city: "Satara",
  },
  {
    id: 'doc4',
    name: 'Dr. Vikram Singh',
    specialization: 'Neurologist',
    bio: 'Dr. Singh is an expert in diagnosing and treating neurological disorders. He is committed to advancing patient care through research and innovation.',
    // imageUrl: 'https://picsum.photos/seed/doc4/300/300', // Removed
    availableSlots: [
      'Today, 09:30 AM', 'Today, 11:00 AM', 'Today, 02:30 PM',
      'Tomorrow, 09:00 AM', 'Tomorrow, 11:00 AM', 'Tomorrow, 03:30 PM'
    ],
    rating: 4.6,
    experience: 18,
    location: "Krishna Wellness Hub",
    city: "Satara",
  }
];

export const HARDCODED_DOCTOR_CREDENTIALS = [
  { doctorId: 'doc1', username: 'priyasharma', password: 'priya123', name: 'Dr. Priya Sharma' },
  { doctorId: 'doc1', username: 'drcarter', password: 'password123', name: 'Dr. Priya Sharma' },
  { doctorId: 'doc2', username: 'rohanpatel', password: 'rohan123', name: 'Dr. Rohan Patel' },
  { doctorId: 'doc2', username: 'drben', password: 'password123', name: 'Dr. Rohan Patel' },
  { doctorId: 'doc3', username: 'ananyareddy', password: 'ananya123', name: 'Dr. Ananya Reddy' },
  { doctorId: 'doc3', username: 'drolivia', password: 'password123', name: 'Dr. Ananya Reddy' },
  { doctorId: 'doc4', username: 'vikramsingh', password: 'vikram123', name: 'Dr. Vikram Singh' },
  { doctorId: 'doc4', username: 'drsam', password: 'password123', name: 'Dr. Vikram Singh' },
];