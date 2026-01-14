import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ImageItem } from '../types'
import { useStore } from '../store/StoreContext'
import { trackToggleKeyframe } from '../utils/umami'
import './SortableImageItem.css'

interface Props {
  image: ImageItem
  index: number
}

export function SortableImageItem({ image, index }: Props) {
  const { removeImage, moveToTop, toggleImageType, settings } = useStore()
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

      <div className="image-item__preview-wrapper">
        <img
          src={image.previewUrl}
          alt={`Screenshot ${index + 1}`}
          className="image-item__preview"
        />
        {!isKeyframe && (
          <div
            className="image-item__crop-overlay"
            style={{
              height: `${(1 - settings.bottomKeepRatio) * 100}%`,
            }}
          />
        )}
      </div>

      <div className="image-item__info">
        <span className="image-item__index">#{index + 1}</span>
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
            className="image-item__btn"
            onClick={() => {
              toggleImageType(image.id)
              trackToggleKeyframe()
            }}
            title={isKeyframe ? 'Set as Subtitle' : 'Set as Keyframe'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
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
