import { useEffect, useCallback } from 'react'
import { ImageItem } from '../types'
import './ImagePreviewModal.css'

interface Props {
  image: ImageItem | null
  onClose: () => void
}

export function ImagePreviewModal({ image, onClose }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (image) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [image, handleKeyDown])

  if (!image) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="image-preview-modal" onClick={handleBackdropClick}>
      <div className="image-preview-modal__content">
        <button className="image-preview-modal__close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <img
          src={image.previewUrl}
          alt="Preview"
          className="image-preview-modal__image"
        />
        <div className="image-preview-modal__info">
          <span className={`image-preview-modal__type image-preview-modal__type--${image.type}`}>
            {image.type === 'keyframe' ? 'Keyframe' : 'Subtitle'}
          </span>
        </div>
      </div>
    </div>
  )
}
