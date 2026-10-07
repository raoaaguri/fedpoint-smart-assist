import { mockClient } from '../client';
import { MOCK_FILES, MOCK_QA } from '../endpoints';
import { config } from '../../config/env';
import { matchAnswer } from './matchAnswer';
import { qaAnswer } from './qaAnswer';

// Q&A files are loaded once and reused
let qaFiles = null;
function loadQa(signal) {
  qaFiles ??= Promise.all(MOCK_QA.map((id) => mockClient.get(MOCK_FILES.qa(id), { signal }))).catch((err) => {
    qaFiles = null;
    throw err;
  });
  return qaFiles;
}

// Waits like a network round trip, and stops early if the request is aborted.
function delay(signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, config.mockDelay);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(Object.assign(new Error('canceled'), { code: 'ERR_CANCELED' }));
    }, { once: true });
  });
}

// Same signatures and return shapes as realApi, so they are interchangeable.
export const mockApi = {
  async getTopics({ signal } = {}) {
    await delay(signal);
    return mockClient.get(MOCK_FILES.topics, { signal });
  },

  async getDocuments({ signal } = {}) {
    await delay(signal);
    return mockClient.get(MOCK_FILES.documents, { signal });
  },

  async ask({ question }, { signal } = {}) {
    await delay(signal);
    for (const file of await loadQa(signal)) {
      const answer = qaAnswer(file, question);
      if (answer) return answer;
    }
    return mockClient.get(MOCK_FILES.answer(matchAnswer(question)), { signal });
  },

  async getAnswer(id, { signal } = {}) {
    await delay(signal);
    return mockClient.get(MOCK_FILES.answer(id), { signal });
  },
};
