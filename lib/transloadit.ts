// Transloadit file upload utilities
import axios from 'axios';

export async function initializeTransloadit(file: File): Promise<{ assembly_id: string; assembly_url: string }> {
  try {
    // Get the upload URL from your backend
    const response = await axios.post('/api/uploads/init', {
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
    });

    return response.data;
  } catch (error) {
    console.error('Error initializing Transloadit:', error);
    throw error;
  }
}

export async function uploadFileToTransloadit(
  file: File,
  assemblyId: string
): Promise<{ fileUrl: string; fileName: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assembly_id', assemblyId);

    const response = await axios.post('/api/uploads/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading to Transloadit:', error);
    throw error;
  }
}

export async function getTransloaditResult(assemblyId: string): Promise<any> {
  try {
    const response = await axios.get(`/api/uploads/${assemblyId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Transloadit result:', error);
    throw error;
  }
}

// Supported file types
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'mov', 'webm', 'm4v'];

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidImageFile(filename: string): boolean {
  return SUPPORTED_IMAGE_FORMATS.includes(getFileExtension(filename));
}

export function isValidVideoFile(filename: string): boolean {
  return SUPPORTED_VIDEO_FORMATS.includes(getFileExtension(filename));
}
