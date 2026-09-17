import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NidaLookup from './screens/NidaLookup';
import PatientView from './screens/PatientView';
import i18n from './i18n';

interface Patient {
  nida_number: string;
  full_name: string;
  date_of_birth: string;
  address: string;
}

export default function App() {
  const { t } = useTranslation();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [lang, setLang] = useState('en');

  const toggleLang = () => {
    const next = lang === 'en' ? 'sw' : 'en';
    setLang(next);
    i18n.changeLanguage(next);
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <span style={styles.logo}>AfyaID</span>
        <button style={styles.langBtn} onClick={toggleLang}>
          {lang === 'en' ? '🇹🇿 Swahili' : '🇬🇧 English'}
        </button>
      </div>
      <div style={styles.content}>
        <h1 style={styles.title}>{t('app.title')}</h1>
        {!patient ? (
          <NidaLookup onPatientFound={setPatient} />
        ) : (
          <PatientView
            patient={patient}
            onBack={() => setPatient(null)}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
    app:     { minHeight:'100vh', background:'#F8F7F4',
              fontFamily:'system-ui, sans-serif' },
    header:  { background:'#0F6E56', padding:'0.75rem 1rem',
              display:'flex', justifyContent:'space-between',
              alignItems:'center' },
    logo:    { color:'#fff', fontWeight:700, fontSize:'1.2rem' },
    langBtn: { background:'transparent', color:'#fff',
              border:'1px solid rgba(255,255,255,0.4)',
              borderRadius:'6px', padding:'0.25rem 0.75rem',
              cursor:'pointer', fontSize:'0.85rem' },
    content: { maxWidth:'600px', margin:'0 auto', padding:'1.5rem 1rem' },
    title:   { color:'#3C3489', marginBottom:'1.5rem', fontSize:'1.3rem' }
};