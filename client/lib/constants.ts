export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Agents
  AGENTS: '/agents',
  CREATE_AGENT: '/agents',

  // Tasks
  TASKS: '/tasks',

  // Upload
  UPLOAD: '/upload',
}

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  AGENTS: '/agents',
  UPLOAD: '/upload',
  TASKS: '/tasks',
}
