import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ImageItem } from '../types'
import { useStore } from '../store/StoreContext'
import { trackToggleKeyframe } from '../utils/umami'
import './SortableImageItem.css'

interface Props {
  image: ImageItem
  index: number
  onPreview?: (image: ImageItem) => void
}

export function SortableImageItem({ image, index, onPreview }: Props) {
  const { removeImage, moveToTop, toggleImageType } = useStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isFirst = index === 0
  const isKeyframe = image.type === 'keyframe'

  // Get display name from file name
  const getDisplayName = (fileName: string) => {
    // Remove extension and truncate if too long
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    if (nameWithoutExt.length > 20) {
      return nameWithoutExt.substring(0, 17) + '...'
    }
    return nameWithoutExt
  }

  const handlePreviewClick = () => {
    if (onPreview) {
      onPreview(image)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`image-item ${isDragging ? 'image-item--dragging' : ''}`}
    >
      <div className="image-item__drag-handle" {...attributes} {...listeners}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>

      <div className="image-item__preview-wrapper" onClick={handlePreviewClick}>
        <img
          src={image.previewUrl}
          alt={`Screenshot ${index + 1}`}
          className="image-item__preview"
        />
        <div className="image-item__zoom-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </div>
      </div>

      <div className="image-item__info">
        <span className="image-item__name" title={image.file.name}>
          {getDisplayName(image.file.name)}
        </span>
        <span
          className={`image-item__type ${
            isKeyframe ? 'image-item__type--keyframe' : 'image-item__type--subtitle'
          }`}
        >
          {isKeyframe ? 'Keyframe' : 'Subtitle'}
        </span>
      </div>

      <div className="image-item__actions">
        {!isFirst && (
          <button
            className="image-item__btn"
            onClick={() => moveToTop(image.id)}
            title="Move to Top"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 11 12 6 7 11" />
              <line x1="12" y1="6" x2="12" y2="18" />
            </svg>
          </button>
        )}
        {!isFirst && (
          <button
            className={`image-item__btn ${isKeyframe ? 'image-item__btn--keyframe-active' : ''}`}
            onClick={() => {
              toggleImageType(image.id)
              trackToggleKeyframe()
            }}
            title={isKeyframe ? 'Set as Subtitle' : 'Set as Keyframe'}
          >
            <svg viewBox="0 0 24 24" fill={isKeyframe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        )}
        <button
          className="image-item__btn image-item__btn--delete"
          onClick={() => removeImage(image.id)}
          title="Remove"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
