import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// GET /patients/:nida — retrieve a patient by NIDA number
router.get('/:nida', async (req: Request, res: Response) => {
    try {
    const { nida } = req.params;
    const result = await pool.query(
        'SELECT * FROM patients WHERE nida_number = $1',
        [nida]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    return res.json(result.rows[0]);
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
}
});

// POST /patients — register a new patient
router.post('/', async (req: Request, res: Response) => {
    try {
    const { nida_number, full_name, date_of_birth, address } = req.body;
    const result = await pool.query(
        `INSERT INTO patients (nida_number, full_name, date_of_birth, address)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [nida_number, full_name, date_of_birth, address]
    );
    return res.status(201).json(result.rows[0]);
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
}
});

export default router;