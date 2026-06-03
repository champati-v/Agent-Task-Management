import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'
import { Agent, CreateAgentRequest, AgentResponse, AgentsListResponse } from '@/types/agent'

function normalizeAgent(agent: Agent | (Partial<Agent> & { id?: string })): Agent {
  return {
    _id: agent._id || agent.id || '',
    name: agent.name || '',
    email: agent.email || '',
    mobileNumber: agent.mobileNumber || '',
    createdAt: agent.createdAt || '',
    updatedAt: agent.updatedAt || '',
  }
}

export const agentService = {
  async createAgent(agentData: CreateAgentRequest): Promise<AgentResponse> {
    const response = await axiosInstance.post<AgentResponse>(
      API_ENDPOINTS.CREATE_AGENT,
      agentData
    )
    if (response.data.agent) {
      return {
        ...response.data,
        agent: normalizeAgent(response.data.agent),
      }
    }
    return response.data
  },

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await axiosInstance.get<AgentsListResponse>(
        API_ENDPOINTS.AGENTS
      )
      if (response.data.success) {
        const agents = response.data.agents || response.data.data || []
        return agents.map(normalizeAgent)
      }
      return []
    } catch (error) {
      console.error('Error fetching agents:', error)
      return []
    }
  },
}
