import axios from 'axios';
import { firebaseRequest } from './firebaseData';

async function request(method, url, payload, config = {}) {
  if (url.startsWith('/api/')) {
      try {
        return { data: await firebaseRequest(method, url, payload) };
      } catch (error) {
        if (!error.response) error.response = { data: { error: error.message }, status: 400 };
        throw error;
      }
  }
  if (url.startsWith('https://finnhub.io/')) {
    const marketUrl = new URL(url);
    marketUrl.searchParams.set('token', process.env.REACT_APP_FINNHUB_API_KEY || 'ce80b8aad3i4pjr4v2ggce80b8aad3i4pjr4v2h0');
    url = marketUrl.toString();
  }
  return axios({ ...config, method, url, data: payload, timeout: 15000 });
}

const api = {
  get: (url, config) => request('GET', url, undefined, config),
  post: (url, payload, config) => request('POST', url, payload, config),
  delete: (url, config) => request('DELETE', url, config?.data, config),
};
export default api;
