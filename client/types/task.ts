export interface Task {
  _id: string
  firstName: string
  phone: string
  notes: string
  assignedAgent?: string
  agentName?: string
  createdAt: string
  updatedAt: string
}

export interface TasksListResponse {
  success: boolean
  message: string
  data?: Task[]
  totalTasks?: number
}
