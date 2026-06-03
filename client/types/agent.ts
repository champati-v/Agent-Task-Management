export interface Agent {
  _id: string
  name: string
  email: string
  mobileNumber: string
  createdAt: string
  updatedAt: string
}

export interface CreateAgentRequest {
  name: string
  email: string
  mobileNumber: string
  password: string
}

export interface AgentResponse {
  success: boolean
  message: string
  agent?: Agent
}

export interface AgentsListResponse {
  success: boolean
  message: string
  data?: Agent[]
  totalAgents?: number
}
