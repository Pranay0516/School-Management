import { environment } from '../../environments/environment';

const apiHost = typeof window === 'undefined' ? 'localhost' : window.location.hostname;
export const API_BASE_URL = environment.apiBaseUrl || `http://${apiHost}:8080/api`;
