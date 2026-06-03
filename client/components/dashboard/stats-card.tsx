import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value?: number | string
  icon: ReactNode
  isLoading?: boolean
}

export function StatsCard({ title, value, icon, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className="text-slate-600 dark:text-slate-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">
            {value !== undefined ? value : '0'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
