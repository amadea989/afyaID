import express from 'express';
import dotenv from 'dotenv';
import patientsRouter from './routes/patients';
import visitsRouter from './routes/visits';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
    res.json({
    status: 'ok',
    message: 'AfyaID API is running',
    timestamp: new Date().toISOString()
});
});

// Routes
app.use('/patients', patientsRouter);
app.use('/visits', visitsRouter);

app.listen(PORT, () => {
    console.log(`AfyaID API running on port ${PORT}`);
});