const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('prepify_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (name, email, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  getMe: () => request('/auth/me'),

  // Internships
  getInternships: (search = '', sort = 'popular') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/internships${queryString}`);
  },
  postInternship: (jobData) => request('/internships', {
    method: 'POST',
    body: JSON.stringify(jobData)
  }),
  toggleSaveInternship: (id) => request(`/internships/${id}/save`, {
    method: 'POST'
  }),

  // Applications
  submitApplication: (appData) => request('/applications', {
    method: 'POST',
    body: JSON.stringify(appData)
  }),
  getUserApplications: (email) => request(`/applications${email ? `?email=${encodeURIComponent(email)}` : ''}`),

  // Dashboard
  getDashboardData: () => request('/dashboard'),

  // Learning Hub
  getLearningResources: (category = '') => request(`/learning/resources${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getInterviewQuestions: (track) => request(`/learning/questions/${track}`),
  awardBadge: (badgeName) => request('/learning/badge', {
    method: 'POST',
    body: JSON.stringify({ badgeName })
  }),

  // AI Services
  getDayInLife: (title, company) => request('/ai/day-in-life', {
    method: 'POST',
    body: JSON.stringify({ title, company })
  }),
  improveResume: (resume) => request('/ai/improve-resume', {
    method: 'POST',
    body: JSON.stringify({ resume })
  }),
  generateCoverLetter: (resume, title, company) => request('/ai/cover-letter', {
    method: 'POST',
    body: JSON.stringify({ resume, title, company })
  }),
  generateLearningPath: (careerGoal) => request('/ai/learning-path', {
    method: 'POST',
    body: JSON.stringify({ careerGoal })
  }),
  getRecommendations: (roles) => request('/ai/recommendations', {
    method: 'POST',
    body: JSON.stringify({ roles })
  }),
  evaluateInterview: (track, answers) => request('/ai/evaluate-interview', {
    method: 'POST',
    body: JSON.stringify({ track, answers })
  }),
  generateQuiz: (category) => request('/ai/generate-quiz', {
    method: 'POST',
    body: JSON.stringify({ category })
  })
};
