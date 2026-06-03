'use client'

import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/upload/file-upload'

export default function UploadPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Tasks</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Import tasks from a CSV or Excel file
        </p>
      </div>

      <div className="max-w-2xl">
        <FileUpload onSuccess={() => router.push('/tasks')} />
      </div>
    </div>
  )
}
