import axios from 'axios'

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
}

// Courses API
export const coursesApi = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getEnrolledCourses: () => api.get('/courses/enrolled'),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  updateProgress: (courseId, lectureId) => 
    api.post(`/courses/${courseId}/progress`, { lectureId }),
}

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Instructor API
export const instructorApi = {
  getDashboard: () => api.get('/instructor/dashboard'),
  getCourses: () => api.get('/instructor/courses'),
  getStudents: (courseId) => api.get(`/instructor/courses/${courseId}/students`),
  getEarnings: () => api.get('/instructor/earnings'),
}

// Payment API
export const paymentApi = {
  createPaymentIntent: (data) => api.post('/payment/create-payment-intent', data),
  confirmPayment: (data) => api.post('/payment/confirm', data),
  getPaymentHistory: () => api.get('/payment/history'),
}

export default api
