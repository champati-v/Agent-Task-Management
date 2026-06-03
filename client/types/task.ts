import { Agent } from './agent'

export interface Task {
  _id: string
  firstName: string
  phone: string
  notes: string
  assignedAgent?: string | Agent
  agentName?: string
  createdAt: string
  updatedAt: string
}

export interface TasksListResponse {
  success: boolean
  message: string
  tasks?: Task[]
  data?: Task[]
  totalTasks?: number
}
