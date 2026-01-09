import { useCallback, useRef, useState } from 'react';
import { useImageStore } from '../../hooks/useImageStore';
import { MAX_IMAGES, SUPPORTED_EXTENSIONS, SUPPORTED_IMAGE_TYPES } from '../../constants';

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { images, addImages } = useImageStore();

  const remainingSlots = MAX_IMAGES - images.length;

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // 过滤有效图片文件
      const validFiles = Array.from(files).filter((file) =>
        SUPPORTED_IMAGE_TYPES.includes(file.type)
      );

      if (validFiles.length === 0) {
        alert('Please select valid image files (JPG, PNG, WebP, GIF)');
        return;
      }

      const result = await addImages(validFiles);

      if (result.skipped > 0) {
        alert(
          `Added ${result.added} images. ${result.skipped} images were skipped (max ${MAX_IMAGES} images).`
        );
      }
    },
    [addImages]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // 重置 input 以便可以重复选择相同文件
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (remainingSlots <= 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <p className="text-yellow-700 text-sm">
          Maximum {MAX_IMAGES} images reached
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed p-8
        transition-all duration-200 ease-in-out
        ${
          isDragging
            ? 'border-primary bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_EXTENSIONS}
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
            transition-colors
          `}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-gray-700 font-medium">
            {isDragging ? 'Drop images here' : 'Upload Images'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Tap to select or drag & drop
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining (max{' '}
            {MAX_IMAGES})
          </p>
        </div>
      </div>
    </div>
  );
}
