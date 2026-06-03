import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'
import { Agent, CreateAgentRequest, AgentResponse, AgentsListResponse } from '@/types/agent'

export const agentService = {
  async createAgent(agentData: CreateAgentRequest): Promise<AgentResponse> {
    const response = await axiosInstance.post<AgentResponse>(
      API_ENDPOINTS.CREATE_AGENT,
      agentData
    )
    return response.data
  },

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await axiosInstance.get<AgentsListResponse>(
        API_ENDPOINTS.AGENTS
      )
      if (response.data.success) {
        return response.data.data || []
      }
      return []
    } catch (error) {
      console.error('Error fetching agents:', error)
      return []
    }
  },
}
