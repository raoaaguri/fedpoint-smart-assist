// Real backend routes (relative to VITE_API_BASE_URL).
// Agree these with the backend team; only this file needs to change if they differ.
export const ENDPOINTS = {
  topics: '/topics', //            GET  -> { topics: Topic[], quickQuestions: string[] }
  documents: '/documents', //      GET  -> { [docKey]: string }
  ask: '/ask', //                  POST { question } -> Answer
  answer: (id) => `/answers/${id}`, // GET -> Answer
};

// Mock equivalents: files in public/data
export const MOCK_FILES = {
  topics: '/topics.json',
  documents: '/documents.json',
  answer: (id) => `/answers/${id}.json`,
  qa: (id) => `/qa/${id}.json`,
};

// Q&A files the mock checks before falling back to keyword matching
export const MOCK_QA = ['life-events', 'dental', 'vision'];
