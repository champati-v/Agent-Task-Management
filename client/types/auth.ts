export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user?: User
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
