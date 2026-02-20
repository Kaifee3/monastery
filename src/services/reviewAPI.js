import axios from 'axios';

const API_BASE_URL = 'https://form-backend-gold.vercel.app/api'; // Updated to match Admin component URL

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const reviewAPI = {
    // Public API - Get all approved reviews
    getAllApprovedReviews: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return await api.get(`/reviews/public${queryParams ? `?${queryParams}` : ''}`);
    },

    // User APIs (require authentication)
    createReview: async (reviewData) => {
        return await api.post('/reviews', reviewData);
    },

    getUserReviews: async () => {
        return await api.get('/reviews/my-reviews');
    },

    updateUserReview: async (reviewData) => {
        return await api.put('/reviews/my-review', reviewData);
    },

    deleteUserReview: async () => {
        return await api.delete('/reviews/my-review');
    },

    // Admin APIs (require admin role)
    getAllReviewsForAdmin: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return await api.get(`/reviews/admin${queryParams ? `?${queryParams}` : ''}`);
    },

    updateReviewStatus: async (reviewId, statusData) => {
        return await api.patch(`/reviews/admin/${reviewId}/status`, statusData);
    },

    getReviewDetailsForAdmin: async (reviewId) => {
        return await api.get(`/reviews/admin/${reviewId}`);
    },

    deleteReviewByAdmin: async (reviewId) => {
        return await api.delete(`/reviews/admin/${reviewId}`);
    },

    getReviewDashboardStats: async () => {
        return await api.get('/reviews/admin/dashboard/stats');
    }
};

export default reviewAPI;