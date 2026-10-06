const apiHost = typeof window === 'undefined' ? 'localhost' : window.location.hostname;

export const API_BASE_URL = `http://${apiHost}:8080/api`;
