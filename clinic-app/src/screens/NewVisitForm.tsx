import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createVisit } from '../api';

interface Props {
    nidaNumber: string;
    onSaved: () => void;
}

const FACILITY_ID = 'YOUR_FACILITY_UUID_HERE';
const CLINICIAN_ID = 'DR-001';

export default function NewVisitForm({ nidaNumber, onSaved }: Props) {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        chief_complaint: '',
        diagnosis_code: '',
        diagnosis_label: '',
        treatment: '',
        notes: ''
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
        await createVisit({
            nida_number: nidaNumber,
            facility_id: FACILITY_ID,
            clinician_id: CLINICIAN_ID,
            ...form
        });
        setSaved(true);
        setTimeout(() => { setSaved(false); onSaved(); }, 1500);
        } catch (err) {
        console.error(err);
        } finally {
        setSaving(false);
        }
    };

    return (
        <div style={styles.container}>
        {(['chief_complaint','diagnosis_code','diagnosis_label','treatment','notes'] as const).map(field => (
            <div key={field} style={styles.field}>
            <label style={styles.label}>
                {t(`app.${field}`) || field.replace('_', ' ')}
            </label>
            <textarea
                style={styles.textarea}
                value={form[field]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(field, e.target.value)}
                rows={field === 'notes' ? 3 : 2}
            />
            </div>
        ))}
        <button style={styles.button} onClick={handleSave} disabled={saving}>
            {saved ? '✓ ' + t('app.saved') : saving ? '...' : t('app.save')}
        </button>
        </div>
    );
}

const styles = {
    container: { background:'#f9f9f9', borderRadius:'8px',
                padding:'1rem', marginBottom:'1rem', border:'1px solid #ddd' },
    field:     { marginBottom:'0.75rem' },
    label:     { display:'block', fontSize:'0.85rem', color:'#555',
                marginBottom:'0.25rem', textTransform:'capitalize' as const },
    textarea:  { width:'100%', padding:'0.5rem', fontSize:'0.95rem',
                borderRadius:'6px', border:'1px solid #ccc',
                resize:'vertical' as const, boxSizing:'border-box' as const },
    button:    { width:'100%', padding:'0.75rem', background:'#3C3489',
                color:'#fff', border:'none', borderRadius:'8px',
                cursor:'pointer', fontSize:'1rem' }
};