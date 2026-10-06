import { mockClient } from '../client';
import { MOCK_FILES } from '../endpoints';
import { config } from '../../config/env';
import { matchAnswer } from './matchAnswer';

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
    return mockClient.get(MOCK_FILES.answer(matchAnswer(question)), { signal });
  },

  async getAnswer(id, { signal } = {}) {
    await delay(signal);
    return mockClient.get(MOCK_FILES.answer(id), { signal });
  },
};
