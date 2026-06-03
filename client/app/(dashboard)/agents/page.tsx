'use client'

import { useState } from 'react'
import { CreateAgentDialog } from '@/components/agents/create-agent-dialog'
import { AgentTable } from '@/components/agents/agent-table'

export default function AgentsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAgentCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your team members</p>
        </div>
        <CreateAgentDialog onSuccess={handleAgentCreated} />
      </div>

      <AgentTable refreshTrigger={refreshTrigger} />
    </div>
  )
}
