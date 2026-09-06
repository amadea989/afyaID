import { Router, Request, Response } from 'express';
import pool from '../db/connection';

const router = Router();

// GET /visits/:nida — get all visits for a patient
router.get('/:nida', async (req: Request, res: Response) => {
    try {
    const { nida } = req.params;
    const result = await pool.query(
        `SELECT v.*, f.name as facility_name, f.district, f.region
        FROM visits v
        JOIN facilities f ON v.facility_id = f.id
        WHERE v.nida_number = $1
        ORDER BY v.visit_date DESC`,
        [nida]
    );
    return res.json(result.rows);
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
}
});

// POST /visits — record a new visit
router.post('/', async (req: Request, res: Response) => {
    try {
    const {
        nida_number,
        facility_id,
        clinician_id,
        chief_complaint,
        diagnosis_code,
        diagnosis_label,
        treatment,
        notes,
        sensitivity_class
    } = req.body;

    const result = await pool.query(
        `INSERT INTO visits 
        (nida_number, facility_id, clinician_id, chief_complaint, 
        diagnosis_code, diagnosis_label, treatment, notes, sensitivity_class)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [nida_number, facility_id, clinician_id, chief_complaint,
        diagnosis_code, diagnosis_label, treatment, notes,
        sensitivity_class || 'standard']
    );
    return res.status(201).json(result.rows[0]);
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
}
});

export default router;