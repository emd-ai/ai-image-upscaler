import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader, X, Image as ImageIcon } from 'lucide-react';
import { upscaleImage } from '../api/upscale';
import { useAuth } from '../contexts/LocalAuthContext';

interface UploadSectionProps {
  onImageUpscaled?: (url: string) => void;
}

type UploadStatus = 'idle' | 'preparing' | 'uploading' | 'processing' | 'complete' | 'error';

const UploadSection: React.FC<UploadSectionProps> = ({ onImageUpscaled }) => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const { user, checkUpscaleLimit, incrementUpscaleCount } = useAuth();

  const getStatusMessage = (status: UploadStatus): string => {
    switch (status) {
      case 'preparing':
        return 'Preparing image...';
      case 'uploading':
        return 'Converting image...';
      case 'processing':
        return 'Upscaling image...';
      case 'complete':
        return 'Upscale complete!';
      case 'error':
        return 'Error processing image';
      default:
        return '';
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
  };

  const validateImage = (file: File): string | null => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width * img.height > 4096 * 4096) {
          resolve('Image dimensions too large. Maximum size is 4096x4096 pixels');
        }
        resolve(null);
      };
      img.onerror = () => resolve('Invalid image file');
      img.src = URL.createObjectURL(file);
    });
  };

  const processImage = async (file: File) => {
    try {
      setStatus('preparing');
      setProgress(10);
      setError(null);

      // Validate user limits
      if (!checkUpscaleLimit()) {
        throw new Error('You have reached your upscale limit. Please upgrade to continue.');
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Convert to base64
      setStatus('uploading');
      setProgress(30);
      const reader = new FileReader();
      const imageUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upscale image
      setStatus('processing');
      setProgress(50);
      const upscaledUrl = await upscaleImage(imageUrl);
      
      // Increment user's upscale count
      incrementUpscaleCount();

      setStatus('complete');
      setProgress(100);
      onImageUpscaled?.(upscaledUrl);
      
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validationError = await validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    await processImage(file);
  }, [onImageUpscaled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: status !== 'idle' && status !== 'error'
  });

  return (
    <section className="max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 hover:border-gray-400'}
          ${status !== 'idle' && status !== 'error' ? 'pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
            {status === 'idle' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
                className="absolute top-2 right-2 p-1 bg-gray-800/50 rounded-full hover:bg-gray-800"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {status === 'idle' || status === 'error' ? (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">
                  {isDragActive
                    ? "Drop the image here..."
                    : "Drag 'n' drop an image, or click to select"}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Supports JPG, PNG, GIF, WEBP (max 10MB)
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className="mt-4 text-sm text-gray-500">{getStatusMessage(status)}</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
          {error}
        </div>
      )}
    </section>
  );
};

export default UploadSection;