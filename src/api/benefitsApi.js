import { config } from '../config/env';
import { mockApi } from './mock/mockApi';
import { realApi } from './realApi';

// The only API object the UI imports. Flip VITE_USE_MOCK=false to use the backend.
export const benefitsApi = config.useMock ? mockApi : realApi;

export { ApiError, isCancelled } from './client';
