import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  candidateRegister: (data) => api.post("/api/candidate/register", data),
  candidateLogin: (data) => api.post("/api/candidate/login", data),
  candidateLogout: () => api.get("/api/candidate/logout"),

  adminRegister: (data) => api.post("/api/admin/register", data),
  adminLogin: (data) => api.post("/api/admin/login", data),
  adminLogout: () => api.get("/api/admin/logout"),
};

export const jobApi = {
  getAllJobs: () => api.get("/api/job/all"),
  getJobById: (id) => api.get(`/api/job/details/${id}`),
  getMyJobs: () => api.get("/api/job/my-jobs"),
  createJob: (data) => api.post("/api/job/create", data),
  updateJob: (id, data) => api.put(`/api/job/update/${id}`, data),
  closeJob: (id) => api.put(`/api/job/close/${id}`),
};

export const applicationApi = {
  apply: (jobId, formData) =>
    api.post(`/api/application/apply/${jobId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getAdminReview: () => api.get("/api/application/admin-review"),
  getDetails: (applicationId) =>
    api.get(`/api/application/details/${applicationId}`),
  selectCandidate: (applicationId) =>
    api.put(`/api/application/select/${applicationId}`),
  rejectCandidate: (applicationId) =>
    api.put(`/api/application/reject/${applicationId}`),
};

export const assessmentApi = {
  getByApplicationId: (applicationId) =>
    api.get(`/api/assessment/application/${applicationId}`),
  submit: (assessmentId, answers) =>
    api.post(`/api/assessment/submit/${assessmentId}`, { answers }),
};

export default api;
