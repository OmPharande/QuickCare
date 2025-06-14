import { Schema, model } from 'mongoose';

const patientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export default model('Patient', patientSchema);
