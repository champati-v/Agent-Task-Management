import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'
import { Task, TasksListResponse } from '@/types/task'

export const taskService = {
  async getTasks(params?: {
    search?: string
    agent?: string
    page?: number
    limit?: number
  }): Promise<{ tasks: Task[]; total: number }> {
    try {
      const response = await axiosInstance.get<TasksListResponse>(
        API_ENDPOINTS.TASKS,
        { params }
      )
      if (response.data.success) {
        return {
          tasks: response.data.data || [],
          total: response.data.totalTasks || 0,
        }
      }
      return { tasks: [], total: 0 }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return { tasks: [], total: 0 }
    }
  },
}
