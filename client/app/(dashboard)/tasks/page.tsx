'use client'

import { TaskTable } from '@/components/tasks/task-table'

export default function TasksPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-slate-600 dark:text-slate-400">
          View and manage all tasks
        </p>
      </div>

      <TaskTable />
    </div>
  )
}
