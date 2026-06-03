import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'

export interface UploadRecord {
  firstName: string
  phone: string
  notes: string
}

export interface UploadPreviewResponse {
  success: boolean
  message?: string
  totalRecords?: number
  records?: UploadRecord[]
}

export interface UploadDistributeResponse {
  success: boolean
  message?: string
  totalRecords?: number
  distributedAgents?: number
}

export const uploadService = {
  async previewUpload(file: File): Promise<UploadPreviewResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post<UploadPreviewResponse>(
      API_ENDPOINTS.UPLOAD_PREVIEW,
      formData
    )
    return response.data
  },

  async distributeTasks(records: UploadRecord[]): Promise<UploadDistributeResponse> {
    const response = await axiosInstance.post<UploadDistributeResponse>(
      API_ENDPOINTS.UPLOAD_DISTRIBUTE,
      { records }
    )
    return response.data
  },
}
