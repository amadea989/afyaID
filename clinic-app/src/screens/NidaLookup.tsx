import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPatient } from '../api';

interface Patient {
    nida_number: string;
    full_name: string;
    date_of_birth: string;
    address: string;
}

interface Props {
    onPatientFound: (patient: Patient) => void;
}

export default function NidaLookup({ onPatientFound }: Props) {
    const { t } = useTranslation();
    const [nida, setNida] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLookup = async () => {
        if (!nida.trim()) return;
        setLoading(true);
        setError('');
        try {
        const res = await getPatient(nida.trim());
        onPatientFound(res.data);
        } catch {
        setError(t('app.not_found'));
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
        <h2 style={styles.label}>{t('app.search')}</h2>
        <input
            style={styles.input}
            value={nida}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNida(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleLookup()}
            placeholder="e.g. 19900615-12345-00001-07"
        />
        <button style={styles.button} onClick={handleLookup} disabled={loading}>
            {loading ? '...' : t('app.search_btn')}
        </button>
        {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}

const styles = {
    container: { marginBottom: '1.5rem' },
    label:     { fontSize: '1rem', marginBottom: '0.5rem' },
    input:     { width: '100%', padding: '0.75rem', fontSize: '1rem',
                borderRadius: '8px', border: '1px solid #ccc',
                marginBottom: '0.5rem', boxSizing: 'border-box' as const },
    button:    { width: '100%', padding: '0.75rem', fontSize: '1rem',
                background: '#0F6E56', color: '#fff', border: 'none',
                borderRadius: '8px', cursor: 'pointer' },
    error:     { color: '#A32D2D', marginTop: '0.5rem' }
};