'use client'

import { useState, useRef } from 'react'
import { UploadRecord, uploadService } from '@/lib/services/upload-service'
import { toast } from 'sonner'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
  const [isDistributing, setIsDistributing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewRecords, setPreviewRecords] = useState<UploadRecord[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
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
    const validExtensions = ['csv', 'xls', 'xlsx']
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (!extension || !validExtensions.includes(extension)) {
      toast.error('Please upload a CSV or Excel file')
      return false
    }

    return true
  }

  const handleUpload = async (file: File) => {
    if (!file) {
      toast.error('No file selected')
      return
    }

    if (!validateFile(file)) return

    setIsUploading(true)
    try {
      const response = await uploadService.previewUpload(file)

      if (response.success && response.records?.length) {
        setPreviewRecords(response.records)
        setTotalRecords(response.totalRecords || response.records.length)
        setIsPreviewOpen(true)
      } else {
        toast.error(response.message || 'No valid records found in file')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const resetUploadState = () => {
    setPreviewRecords([])
    setTotalRecords(0)
    setIsPreviewOpen(false)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDistribute = async () => {
    setIsDistributing(true)

    try {
      const response = await uploadService.distributeTasks(previewRecords)
      const uploadSummary = {
        totalRecords: response.totalRecords || previewRecords.length,
        distributedAgents: response.distributedAgents || 0,
      }

      if (!response.success) {
        toast.error(response.message || 'Failed to distribute tasks')
        return
      }

      resetUploadState()
      toast.success(`${uploadSummary.totalRecords} tasks distributed successfully`)
      onSuccess?.(uploadSummary)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to distribute tasks')
    } finally {
      setIsDistributing(false)
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload Tasks</CardTitle>
          <CardDescription>Upload a CSV or Excel file to preview and distribute tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
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
              disabled={isUploading || isDistributing}
            />

            <div className="flex flex-col items-center gap-3">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium">Preparing preview...</p>
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

      <Dialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          if (!isDistributing) {
            setIsPreviewOpen(open)
            if (!open) {
              resetUploadState()
            }
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Task Preview</DialogTitle>
            <DialogDescription>
              {totalRecords} tasks ready for distribution
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Records: <span className="font-medium text-foreground">{totalRecords}</span>
            </p>

            <div className="overflow-hidden rounded-lg border">
              <ScrollArea className="h-[360px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>First Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRecords.map((record, index) => (
                      <TableRow key={`${record.phone}-${index}`}>
                        <TableCell className="font-medium">{record.firstName}</TableCell>
                        <TableCell>{record.phone}</TableCell>
                        <TableCell className="max-w-md whitespace-normal text-sm text-slate-600">
                          {record.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetUploadState}
              disabled={isDistributing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDistribute}
              disabled={isDistributing || !previewRecords.length}
            >
              {isDistributing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDistributing ? 'Distributing...' : 'Distribute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
