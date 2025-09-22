/**
 * File and upload utilities
 */

export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const getFileExtension = (filename: string): string => {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith("video/");
};

export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith("audio/");
};

export const isPDFFile = (file: File): boolean => {
  return file.type === "application/pdf";
};

export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ];
  return documentTypes.includes(file.type);
};

export interface FileUploadConfig {
  maxSizeInMB: number;
  allowedTypes: string[];
  maxFiles?: number;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateFiles = (
  files: FileList | File[],
  config: FileUploadConfig
): FileValidationResult => {
  const errors: string[] = [];
  const fileArray = Array.from(files);

  if (config.maxFiles && fileArray.length > config.maxFiles) {
    errors.push(`Maximum ${config.maxFiles} files allowed`);
  }

  fileArray.forEach((file, index) => {
    if (!validateFileSize(file, config.maxSizeInMB)) {
      errors.push(
        `File ${index + 1} exceeds maximum size of ${config.maxSizeInMB}MB`
      );
    }

    if (!validateFileType(file, config.allowedTypes)) {
      errors.push(
        `File ${
          index + 1
        } type not allowed. Allowed types: ${config.allowedTypes.join(", ")}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const createFileUpload = async (
  file: File,
  uploadUrl: string,
  config?: {
    headers?: Record<string, string>;
    onProgress?: (progress: number) => void;
    additionalData?: Record<string, string>;
  }
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (config?.additionalData) {
      Object.entries(config.additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: config?.headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const compressImage = (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
};
