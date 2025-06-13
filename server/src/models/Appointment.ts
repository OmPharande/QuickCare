import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  slot: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, required: true },
  status: { type: String, enum: ['upcoming', 'done', 'no_show', 'cancelled'], default: 'upcoming' },
  createdAt: { type: Date, default: Date.now }
});

export default model('Appointment', appointmentSchema);
