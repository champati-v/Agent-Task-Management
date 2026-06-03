'use client'

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Users, CheckSquare } from 'lucide-react'
import { agentService } from '@/lib/services/agent-service'
import { taskService } from '@/lib/services/task-service'

export default function DashboardPage() {
  const [agentsCount, setAgentsCount] = useState<number | undefined>()
  const [tasksCount, setTasksCount] = useState<number | undefined>()
  const [isLoadingAgents, setIsLoadingAgents] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const agents = await agentService.getAgents()
        setAgentsCount(agents.length)
      } catch (error) {
        console.error('Failed to fetch agents:', error)
      } finally {
        setIsLoadingAgents(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { total } = await taskService.getTasks()
        setTasksCount(total)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setIsLoadingTasks(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Agents"
          value={agentsCount}
          icon={<Users className="h-5 w-5" />}
          isLoading={isLoadingAgents}
        />
        <StatsCard
          title="Total Tasks"
          value={tasksCount}
          icon={<CheckSquare className="h-5 w-5" />}
          isLoading={isLoadingTasks}
        />
      </div>
    </div>
  )
}
