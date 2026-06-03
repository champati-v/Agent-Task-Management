import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'
import { Task, TasksListResponse } from '@/types/task'
import { Agent } from '@/types/agent'

function getAssignedAgentId(assignedAgent?: string | Agent): string | undefined {
  if (!assignedAgent) {
    return undefined
  }

  return typeof assignedAgent === 'string' ? assignedAgent : assignedAgent._id
}

function getAssignedAgentName(assignedAgent?: string | Agent): string | undefined {
  if (!assignedAgent || typeof assignedAgent === 'string') {
    return undefined
  }

  return assignedAgent.name
}

function normalizeTask(task: Task): Task {
  return {
    ...task,
    assignedAgent: getAssignedAgentId(task.assignedAgent),
    agentName: task.agentName || getAssignedAgentName(task.assignedAgent),
  }
}

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
        const tasks = response.data.tasks || response.data.data || []
        return {
          tasks: tasks.map(normalizeTask),
          total: response.data.totalTasks || tasks.length,
        }
      }
      return { tasks: [], total: 0 }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return { tasks: [], total: 0 }
    }
  },
}
