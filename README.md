# afyaID
# AfyaID

> **National Digital Health Infrastructure Platform**  
> Tanzania · East Africa · Global South

---

## What is AfyaID?

AfyaID is a national digital health interoperability platform being built for Tanzania and East Africa. It connects every citizen's health records across all facilities — government hospitals, private clinics, dispensaries, pharmacies, and insurance providers — using Tanzania's existing **NIDA national identity system** as its backbone.

The core promise: a health worker at **any** facility in the country can enter a patient's NIDA number and instantly see their full medical history — regardless of where they were previously treated, and regardless of whether the device is currently online.

---

## The Problem

Tanzania has no unified patient health record system.

- A patient treated at a dispensary in Mbeya arrives unconscious at a hospital in Dar es Salaam — the doctors know nothing about them
- Prescription fraud is rampant — the same paper script filled at multiple pharmacies
- Doctors prescribe without knowing what other clinicians have already prescribed — dangerous drug interactions go undetected
- Insurance companies have no real-time eligibility verification — fraud is widespread
- There is no family medical history — hereditary conditions like diabetes, hypertension, and sickle cell go undetected for decades

Most of Tanzania's 8,000+ health facilities run entirely on paper. The few that have digital systems — JEEVA at MNH, MEDITECH Expanse at Aga Khan, MEDIPRO at JKCI and Benjamin Mkapa — are completely incompatible with each other. No patient record crosses a facility boundary.

---

## The Solution

AfyaID is not another standalone hospital system. It is the **interoperability layer** that connects all existing systems, and provides a full EMR for the thousands of facilities that currently have nothing.

Built in three layers:

```
Layer 3 — Intelligence
AI clinical advisory · drug interaction checker · genetic risk engine · insurance validation

Layer 2 — Central Health Index (AfyaID core)
NIDA identity spine · cross-facility record index · sync engine · prescription registry · audit logs

Layer 1 — EMR at point of care
Android/PWA clinic app · local SQLite storage · USSD/SMS fallback · pharmacy dispensing · offline-first sync
```

---

## Key Features

### NIDA Identity Integration
Every patient interaction begins with a NIDA number lookup. NIDA carries only name, date of birth, and address — but critically, it links every citizen to their parents and children. AfyaID uses this family graph to automatically surface **three-generation family medical history** at the point of care — something no other health platform in the world does natively.

### Offline-First Architecture
Most Tanzanian health facilities have no reliable internet. AfyaID is designed so that the health worker **never waits for a network request**. Records are stored locally on the device first. The moment any connectivity exists — even 2G for 30 seconds — the system syncs silently in the background.

### USSD / SMS Fallback
No internet and no data plan? A nurse can dial a shortcode on any basic phone and retrieve a patient's critical record summary, or record a visit — all over 2G via USSD or structured SMS. This is how M-Pesa works. AfyaID borrows the same model.

### Prescription Management
Every prescription is a digital record tied to a NIDA number. The system:
- Calculates the exact refill window per dosage automatically
- Blocks dispensing before the window opens
- Blocks the same prescription being filled at two pharmacies on the same day
- Alerts the prescribing doctor of any fraud attempt instantly

### Family History & Genetic Risk Engine
Because NIDA links a patient to their parents, AfyaID can surface:
- Father's diagnoses, mother's diagnoses, grandparent conditions
- Automatically flagged genetic risk (diabetes, hypertension, cardiovascular disease, sickle cell, inherited cancers)
- Without the patient having to remember or volunteer anything

### Sensitive Data Protection (Class S)
Conditions carrying social stigma — HIV/AIDS status, mental health diagnoses, reproductive health, substance use disorders — are classified as **Class S**. They require a separate, explicit patient consent to view, do not appear in default clinical summaries, and fire an immediate notification to the patient every time they are accessed.

### Role-Based Access Control
Eight user roles with strictly scoped permissions:

| Role | Access |
|---|---|
| System admin | Platform infrastructure — no clinical records without consent |
| Hospital admin | Facility management, aggregate stats, billing summary |
| Nurse | Vitals, basic visit notes, active conditions summary |
| General doctor | Full record at own facility, read-only cross-facility history |
| Specialist doctor | Extended specialty history, full family history tree, genetic risk panel |
| Pharmacist | Active prescriptions, refill status, allergy flags — no clinical notes |
| Insurance company | Eligibility verification, claims codes — no clinical records |
| Patient | Own full record, audit log of all access, consent management |

---

## Hospital Interoperability

AfyaID builds FHIR R4-compliant adapters for Tanzania's existing hospital systems:

| Hospital | System | Adapter |
|---|---|---|
| Muhimbili National Hospital | JEEVA (Napier v4.3.2) | HL7 FHIR R4 REST |
| Aga Khan Hospital DSM + Mwanza | MEDITECH Expanse | FHIR R4 + SMART on FHIR |
| JKCI + Benjamin Mkapa Hospital | MEDIPRO | HL7 v2.x → FHIR bridge |
| Public facilities (MoH) | GoTHOMIS | GoTHOMIS REST + DHIS2 |
| KCMC + undigitised facilities | Paper / HarmoniMD remnants | AfyaID EMR deployed directly |

---

## Technology Stack

### Languages
- **TypeScript** — frontend (React) and backend (Node.js)
- **Python 3.11+** — AI/ML clinical advisory engine, analytics, DHIS2 exports
- **Kotlin** — native Android app (Phase 2)
- **SQL** — PostgreSQL queries and migrations
- **Bash** — DevOps automation and deployment scripts

### Backend
- **Node.js + Express** — REST API
- **PostgreSQL 16** — primary database (encrypted at rest with pgcrypto)
- **CouchDB 3** — offline sync coordination (PouchDB replication protocol)
- **Apache Kafka** — message queue for burst sync traffic from 8,000+ devices
- **Elasticsearch** — patient search across millions of records
- **Redis** — caching layer
- **FastAPI (Python)** — AI advisory engine API

### Frontend
- **React 18 + TypeScript** — clinic app (PWA)
- **PouchDB** — offline-first local database in the browser
- **react-i18next** — English and Swahili language support

### Infrastructure
- **Nginx** — reverse proxy, TLS termination, rate limiting
- **Docker + Kubernetes** — containerised deployment
- **GitHub Actions** — CI/CD pipeline
- **HashiCorp Vault** — secrets management
- **Prometheus + Grafana** — monitoring and alerting
- **TTCL National Data Centre** — Tanzania-compliant data residency (Phase 2+)

### Integrations
- **Africa's Talking** — USSD shortcodes and SMS (Tanzania-licensed)
- **DHIS2** — daily anonymised aggregate exports to MoH national reporting system
- **NHIF API** — real-time insurance eligibility verification
- **OpenFDA / DrugBank** — drug interaction database

---

## Security Architecture

AfyaID targets **ISO/IEC 27001:2022** certification and is built to comply with:
- Tanzania Personal Data Protection Act No. 11 of 2022
- Tanzania Cybercrimes Act No. 14 of 2015
- HL7 FHIR R4 international health data standard
- OWASP Top 10
- NIST Cybersecurity Framework 2.0

Security controls implemented:
- **AES-256 encryption** at rest for all PII (pgcrypto)
- **TLS 1.3** for all data in transit — no HTTP permitted anywhere
- **Multi-factor authentication** (TOTP) for all clinician and admin accounts
- **JWT with 8-hour expiry** + 15-minute inactivity timeout
- **Immutable audit logs** — every record access logged with user, facility, patient (hashed), timestamp, IP
- **Class S sensitive data** — extra consent layer for HIV, mental health, reproductive health
- **Rate limiting** — 100 req/min authenticated, 10 req/min unauthenticated
- **Automated dependency scanning** — GitHub Dependabot + Snyk on every commit
- **Penetration testing** — independent external test every 6 months

---

## Project Structure

```
afyaid/
├── central-api/          # Node.js + TypeScript REST API
│   ├── src/
│   │   ├── index.ts      # Express server entry point
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Auth, validation, audit logging
│   │   ├── db/           # PostgreSQL connection and queries
│   │   └── services/     # Business logic
│   ├── package.json
│   └── tsconfig.json
│
├── clinic-app/           # React PWA — offline-first EMR
│   ├── src/
│   │   ├── screens/      # NIDA lookup, visit form, patient history
│   │   ├── hooks/        # useDatabase, useSync, useAuth
│   │   ├── locales/      # en.json, sw.json (Swahili)
│   │   └── components/
│   └── package.json
│
├── ussd-sim/             # Africa's Talking USSD/SMS handler
│   └── src/
│
├── mock-data/            # Simulated NIDA records + test patients
│   └── tanzania_dummy_patients_30.json
│
└── README.md
```

---

## Current Status

### ✅ Sprint 0 — Dev environment
- Node.js 20, Git, VS Code installed and configured
- PostgreSQL 16 running locally
- GitHub monorepo created with full project structure

### ✅ Sprint 1 — API skeleton (in progress)
- Express + TypeScript server running on port 3000
- `/health` endpoint live and responding
- tsx executor configured for Node.js 26 compatibility

### 🔲 Sprint 2 — Database + core endpoints
### 🔲 Sprint 3 — Clinic app (React PWA)
### 🔲 Sprint 4 — Offline sync (PouchDB ↔ CouchDB)
### 🔲 Sprint 5 — USSD/SMS fallback
### 🔲 Sprint 6 — Prescription module
### 🔲 Sprint 7 — Family history + AI advisory
### 🔲 Sprint 8 — Patient portal + DHIS2 integration
### 🔲 Sprint 9 — Security hardening + production deploy

---

## Rollout Plan

| Phase | Description | Timeline |
|---|---|---|
| Phase 0 | Discovery & validation — 30 stakeholder interviews | Months 1–4 |
| Phase 1 | MVP build — single district, 3 pilot clinics | Months 5–12 |
| Phase 2 | Pilot district — Kilimanjaro, 30 facilities, 10,000 records | Months 13–24 |
| Phase 3 | Regional rollout — 5 regional nodes, 500 facilities | Year 3–4 |
| Phase 4 | National scale — all 8,000+ Tanzania facilities | Year 4–5 |
| Phase 5 | East Africa — Kenya (Huduma Namba), Uganda (NIRA), Rwanda (Nida) | Year 5–7 |

---

## The Vision

> A child born today into a fully enrolled family will have complete three-generation health history from their very first clinic visit — better family history information than most patients in Europe or America ever have access to.

Tanzania already solved the hardest part. Every citizen has a NIDA number. AfyaID uses it.

---

## Founder

Built by **Sky** — cybersecurity background, dual Tanzania/Mauritius exposure, prior experience in real estate documentation and cellular connectivity infrastructure.

---

*AfyaID — Connecting every Tanzanian to their health history.*