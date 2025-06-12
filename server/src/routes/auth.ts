import { Router } from 'express';
import Patient from '../models/Patient';

const router = Router();

// Patient signup
router.post('/patient/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Patient.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });
    const user = await Patient.create({ name, email, password });
    res.json({ id: user._id, name: user.name, email: user.email, type: 'patient' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Patient login
router.post('/patient/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Patient.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ id: user._id, name: user.name, email: user.email, type: 'patient' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
