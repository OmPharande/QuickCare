import { Router } from 'express';
import Appointment from '../models/Appointment';

const router = Router();

// Create a new appointment
router.post('/', async (req, res) => {
  const patientName = req.headers['x-patient-name'] as string;
  const { doctorId, slot, gender, age } = req.body;
  if (!patientName || !doctorId || !slot || !gender || typeof age !== 'number') {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const appointment = await Appointment.create({ patientName, doctorId, slot, gender, age });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get appointments filtered by user (simple header-based auth)
router.get('/', async (req, res) => {
  const userType = req.headers['x-user-type'] as string;
  const userId = req.headers['x-user-id'] as string;
  const userName = req.headers['x-user-name'] as string;

  if (!userType || !userId) {
    return res.status(401).json({ message: 'Missing authentication headers' });
  }

  let filter: any = {};
  if (userType === 'patient') {
    // For patients, filter by patientName (since that's what we store)
    if (!userName) {
      return res.status(401).json({ message: 'Missing patient name for filtering' });
    }
    filter.patientName = userName;
  } else if (userType === 'doctor') {
    filter.doctorId = userId;
  } else {
    return res.status(401).json({ message: 'Invalid user type' });
  }

  try {
    const appointments = await Appointment.find(filter);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['upcoming', 'done', 'no_show', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const appt = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
