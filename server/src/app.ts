import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import appointmentsRoutes from './routes/appointments';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);

export default app;
