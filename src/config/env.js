// Single place that reads Vite env variables (see .env / .env.example).
const env = import.meta.env;

export const config = {
  // true  -> answers come from the JSON files in public/data (mock backend)
  // false -> answers come from the real backend at apiBaseUrl
  useMock: env.VITE_USE_MOCK !== 'false',
  apiBaseUrl: env.VITE_API_BASE_URL || '',
  apiTimeout: Number(env.VITE_API_TIMEOUT) || 15000,
  // Simulated network latency for mock calls, in ms
  mockDelay: Number(env.VITE_MOCK_DELAY ?? 650),
  // Where the mock JSON files are served from (public/data)
  mockBaseUrl: `${env.BASE_URL}data`,
};
