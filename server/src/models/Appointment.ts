import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  slot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model('Appointment', appointmentSchema);
