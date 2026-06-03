import axiosInstance from '../axios-instance'
import { API_ENDPOINTS } from '../constants'

export interface UploadResponse {
  success: boolean
  message: string
  data?: {
    totalRecords: number
    distributedAgents: number
  }
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post<UploadResponse>(
      API_ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },
}
