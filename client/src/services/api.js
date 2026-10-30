import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = () => api.get('/health');
export const getAllCases = () => api.get('/cases');
export const createCase = (data) => api.post('/cases', data);
export const getCaseById = (id) => api.get(`/cases/${id}`);
export const discoverClue = (caseId, clueId) => api.post(`/cases/${caseId}/clues/${clueId}/discover`);
export const requestHint = (caseId) => api.post(`/cases/${caseId}/hints`);
export const submitAccusation = (caseId, data) => api.post(`/cases/${caseId}/accuse`, data);
export const getCaseResult = (caseId) => api.get(`/cases/${caseId}/result`);

export default api;

