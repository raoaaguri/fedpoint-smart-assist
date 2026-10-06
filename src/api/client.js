import axios from 'axios';
import { config } from '../config/env';

/**
 * Error shape every API call rejects with, so components never deal
 * with raw axios errors.
 */
export class ApiError extends Error {
  constructor(message, { status = null, code = null, cause = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.cause = cause;
  }
}

export const isCancelled = (err) => axios.isCancel(err) || err?.code === 'ERR_CANCELED';

function toApiError(err) {
  if (isCancelled(err)) return err; // let callers ignore aborted requests
  if (err.response) {
    const { status, data } = err.response;
    return new ApiError(data?.message || `Request failed with status ${status}`, { status, code: data?.code, cause: err });
  }
  if (err.code === 'ECONNABORTED') return new ApiError('The request timed out.', { code: 'TIMEOUT', cause: err });
  return new ApiError('Network error. Please check your connection.', { code: 'NETWORK', cause: err });
}

function createClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: config.apiTimeout,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  client.interceptors.request.use((req) => {
    // Placeholder: attach auth once the backend defines it, e.g.
    // const token = getAuthToken(); if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  });

  client.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(toApiError(err)),
  );

  return client;
}

// Real backend
export const apiClient = createClient(config.apiBaseUrl);

// Static JSON files in public/data, used by the mock backend
export const mockClient = createClient(config.mockBaseUrl);
