'use client'

import { useState, useRef } from 'react'
import { uploadService } from '@/lib/services/upload-service'
import { toast } from 'sonner'
import { Upload, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UploadSuccessData {
  totalRecords: number
  distributedAgents: number
}

interface FileUploadProps {
  onSuccess?: (data: UploadSuccessData) => void
}

export function FileUpload({ onSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [successData, setSuccessData] = useState<UploadSuccessData | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a CSV or Excel file')
      return false
    }

    return true
  }

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return

    setIsUploading(true)
    try {
      const response = await uploadService.uploadFile(file)

      if (response.success && response.data) {
        setSuccessData(response.data)
        toast.success(response.message || 'File uploaded successfully')
        onSuccess?.(response.data)
      } else {
        toast.error(response.message || 'Upload failed')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  if (successData) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle>Upload Successful</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Total Records:</span> {successData.totalRecords}
          </p>
          <p className="text-sm">
            <span className="font-medium">Distributed Agents:</span> {successData.distributedAgents}
          </p>
          <Button
            onClick={() => {
              setSuccessData(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            variant="outline"
            className="mt-2"
          >
            Upload Another File
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Tasks</CardTitle>
        <CardDescription>Upload a CSV or Excel file to distribute tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
              : 'border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-3">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-400" />
                <div className="text-center">
                  <p className="font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-slate-500">or click to browse</p>
                </div>
                <p className="text-xs text-slate-400">CSV, XLS, or XLSX</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
