import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVisits } from '../api';
import NewVisitForm from './NewVisitForm';

interface Patient {
    nida_number: string;
    full_name: string;
    date_of_birth: string;
    address: string;
}

interface Visit {
    id: string;
    visit_date: string;
    facility_name: string;
    diagnosis_label: string;
    chief_complaint: string;
    treatment: string;
}

interface Props {
    patient: Patient;
    onBack: () => void;
}

export default function PatientView({ patient, onBack }: Props) {
  const { t } = useTranslation();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getVisits(patient.nida_number)
      .then(res => { if (!cancelled) setVisits(res.data); })
      .catch(() => { if (!cancelled) setVisits([]); });
    return () => { cancelled = true; };
  }, [patient.nida_number, refresh]);

  const dob = new Date(patient.date_of_birth).toLocaleDateString();

  return (
    <div>
      <div style={styles.card}>
        <h2 style={styles.name}>{patient.full_name}</h2>
        <p style={styles.meta}>NIDA: {patient.nida_number}</p>
        <p style={styles.meta}>DOB: {dob}</p>
        <p style={styles.meta}>Address: {patient.address}</p>
      </div>

      <div style={styles.row}>
        <button style={styles.btnSecondary} onClick={onBack}>← Back</button>
        <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : t('app.new_visit')}
        </button>
      </div>

      {showForm && (
        <NewVisitForm
          nidaNumber={patient.nida_number}
          onSaved={() => {
            setShowForm(false);
            setRefresh(r => r + 1);
          }}
        />
      )}

      <h3 style={styles.sectionTitle}>{t('app.visits')}</h3>
      {visits.length === 0 ? (
        <p style={styles.empty}>{t('app.no_visits')}</p>
      ) : (
        visits.map(v => (
          <div key={v.id} style={styles.visitCard}>
            <div style={styles.visitHeader}>
              <span style={styles.visitDate}>
                {new Date(v.visit_date).toLocaleDateString()}
              </span>
              <span style={styles.visitFacility}>{v.facility_name}</span>
            </div>
            <p style={styles.visitField}><strong>Complaint:</strong> {v.chief_complaint}</p>
            <p style={styles.visitField}><strong>Diagnosis:</strong> {v.diagnosis_label}</p>
            <p style={styles.visitField}><strong>Treatment:</strong> {v.treatment}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card:          { background:'#E1F5EE', borderRadius:'10px', padding:'1rem', marginBottom:'1rem' },
  name:          { margin:'0 0 0.5rem', color:'#0F6E56', fontSize:'1.2rem' },
  meta:          { margin:'0.2rem 0', fontSize:'0.9rem', color:'#444' },
  row:           { display:'flex', gap:'0.5rem', marginBottom:'1rem' },
  btnPrimary:    { flex:1, padding:'0.75rem', background:'#0F6E56', color:'#fff',
                   border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'1rem' },
  btnSecondary:  { padding:'0.75rem 1rem', background:'#F1EFE8', color:'#444',
                   border:'1px solid #ccc', borderRadius:'8px', cursor:'pointer', fontSize:'1rem' },
  sectionTitle:  { color:'#3C3489', marginBottom:'0.5rem' },
  empty:         { color:'#888', fontStyle:'italic' },
  visitCard:     { border:'1px solid #ddd', borderRadius:'8px', padding:'0.75rem',
                   marginBottom:'0.75rem', background:'#fff' },
  visitHeader:   { display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' },
  visitDate:     { fontWeight:500, color:'#0F6E56', fontSize:'0.9rem' },
  visitFacility: { color:'#888', fontSize:'0.85rem' },
  visitField:    { margin:'0.2rem 0', fontSize:'0.9rem', color:'#333' }
};