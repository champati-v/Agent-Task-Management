import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'
import { LoginRequest, LoginResponse, User } from '@/types/auth'

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      { email, password }
    )
    return response.data
  },

  async logout(): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.LOGOUT)
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: User }>(
        API_ENDPOINTS.ME
      )
      if (response.data.success) {
        return response.data.data
      }
      return null
    } catch (error) {
      return null
    }
  },
}
