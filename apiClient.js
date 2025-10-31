import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://taskboard-backend.onrender.com/api',
});

// This is the interceptor - a function that runs before every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;