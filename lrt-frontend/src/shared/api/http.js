import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Token für JEDEN Request aus dem localStorage holen (auch nach Login/Logout)
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
});

http.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const url    = err.config?.url || '';

    // Wenn 401 **und** NICHT /admin/settings, zeige den Toast
    if (status === 401 && !url.endsWith('/admin/settings')) {
      toast.show('Session abgelaufen – bitte erneut anmelden', 'warning');
      auth.logout();
    }

    return Promise.reject(err);
  },
);

export default http;
