import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// Calls the real backend. Not used while VITE_USE_MOCK=true.
export const realApi = {
  getTopics({ signal } = {}) {
    return apiClient.get(ENDPOINTS.topics, { signal });
  },

  getDocuments({ signal } = {}) {
    return apiClient.get(ENDPOINTS.documents, { signal });
  },

  ask({ question }, { signal } = {}) {
    return apiClient.post(ENDPOINTS.ask, { question }, { signal });
  },

  getAnswer(id, { signal } = {}) {
    return apiClient.get(ENDPOINTS.answer(id), { signal });
  },
};
