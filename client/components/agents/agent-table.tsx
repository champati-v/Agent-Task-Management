'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Agent } from '@/types/agent'
import { agentService } from '@/lib/services/agent-service'
import { Input } from '@/components/ui/input'

interface AgentTableProps {
  refreshTrigger?: number
}

export function AgentTable({ refreshTrigger }: AgentTableProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true)
      try {
        const data = await agentService.getAgents()
        setAgents(data)
        setFilteredAgents(data)
      } catch (error) {
        console.error('Failed to fetch agents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [refreshTrigger])

  useEffect(() => {
    const filtered = agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAgents(filtered)
  }, [searchTerm, agents])

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {filteredAgents.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed py-10">
          <p className="text-slate-500">No agents found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map((agent) => (
              <TableRow key={agent._id}>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.mobileNumber}</TableCell>
                <TableCell className="text-sm text-slate-500">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
