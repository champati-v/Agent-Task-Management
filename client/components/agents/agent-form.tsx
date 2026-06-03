'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { agentService } from '@/lib/services/agent-service'
import { toast } from 'sonner'

const agentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AgentFormValues = z.infer<typeof agentSchema>

interface AgentFormProps {
  onSuccess?: () => void
}

export function AgentForm({ onSuccess }: AgentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: '',
      email: '',
      mobileNumber: '',
      password: '',
    },
  })

  async function onSubmit(data: AgentFormValues) {
    setIsLoading(true)
    try {
      const response = await agentService.createAgent({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
      })

      if (response.success) {
        toast.success('Agent created successfully')
        form.reset()
        onSuccess?.()
      } else {
        toast.error(response.message || 'Failed to create agent')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create agent')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john@example.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="1234567890"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {isLoading ? 'Creating...' : 'Create Agent'}
        </Button>
      </form>
    </Form>
  )
}
