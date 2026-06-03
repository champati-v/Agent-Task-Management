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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Task } from '@/types/task'
import { Agent } from '@/types/agent'
import { taskService } from '@/lib/services/task-service'
import { agentService } from '@/lib/services/agent-service'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const ITEMS_PER_PAGE = 10

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [tasksData, agentsData] = await Promise.all([
          taskService.getTasks(),
          agentService.getAgents(),
        ])
        setTasks(tasksData.tasks)
        setAgents(agentsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAgent =
      selectedAgent === 'all' || task.assignedAgent === selectedAgent
    return matchesSearch && matchesAgent
  })

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTasks = filteredTasks.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Assigned Agent</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1 max-w-sm"
        />

        <Select value={selectedAgent} onValueChange={(value) => {
          setSelectedAgent(value)
          setCurrentPage(1)
        }}>
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder="Filter by agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent._id} value={agent._id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed py-10">
          <p className="text-slate-500">No tasks found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Agent</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">{task.firstName}</TableCell>
                  <TableCell>{task.phone}</TableCell>
                  <TableCell>{task.agentName || 'Unassigned'}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-slate-600">
                    {task.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1
                  if (totalPages <= 7) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }

                  if (pageNum === 1 || pageNum === totalPages) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }

                  if (Math.abs(pageNum - currentPage) <= 1) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }

                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <PaginationEllipsis key={pageNum} />
                  }

                  return null
                })}

                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
