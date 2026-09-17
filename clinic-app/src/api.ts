import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000
});

export const getPatient = (nida: string) =>
    API.get(`/patients/${nida}`);

export const getVisits = (nida: string) =>
    API.get(`/visits/${nida}`);

export const createVisit = (data: object) =>
    API.post('/visits', data);

export default API;