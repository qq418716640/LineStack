import { useCallback, useRef } from 'react'
import { useStore } from '../store/StoreContext'
import { MAX_IMAGES } from '../types'
import './ImageUpload.css'

export function ImageUpload() {
  const { images, addImages } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      )
      if (imageFiles.length > 0) {
        addImages(imageFiles)
      }
    },
    [addImages]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      // Reset input value to allow re-uploading same files
      e.target.value = ''
    },
    [handleFiles]
  )

  const remaining = MAX_IMAGES - images.length
  const isFull = remaining <= 0

  return (
    <div
      className={`upload-zone ${isFull ? 'upload-zone--disabled' : ''}`}
      onClick={isFull ? undefined : handleClick}
      onDrop={isFull ? undefined : handleDrop}
      onDragOver={isFull ? undefined : handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="upload-input"
        disabled={isFull}
      />
      <div className="upload-content">
        <svg
          className="upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="upload-text">
          {isFull
            ? `Maximum ${MAX_IMAGES} images reached`
            : 'Drop screenshots here or click to upload'}
        </p>
        <p className="upload-hint">
          {images.length} / {MAX_IMAGES} images
        </p>
      </div>
    </div>
  )
}
