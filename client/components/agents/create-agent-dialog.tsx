'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AgentForm } from './agent-form'
import { Plus } from 'lucide-react'

interface CreateAgentDialogProps {
  onSuccess?: () => void
}

export function CreateAgentDialog({ onSuccess }: CreateAgentDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Add a new agent to your team
          </DialogDescription>
        </DialogHeader>
        <AgentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
