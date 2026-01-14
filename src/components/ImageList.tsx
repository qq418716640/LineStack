import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useStore } from '../store/StoreContext'
import { ImageItem } from '../types'
import { SortableImageItem } from './SortableImageItem'
import { ImagePreviewModal } from './ImagePreviewModal'
import './ImageList.css'

export function ImageList() {
  const { images, reorderImages, clearAllImages } = useStore()
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      reorderImages(oldIndex, newIndex)
    }
  }

  const handlePreview = (image: ImageItem) => {
    setPreviewImage(image)
  }

  const handleClosePreview = () => {
    setPreviewImage(null)
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="image-list-container">
      <div className="image-list-header">
        <h3 className="image-list-title">
          Screenshots ({images.length})
        </h3>
        <button
          className="clear-all-btn"
          onClick={clearAllImages}
        >
          Clear All
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="image-list">
            {images.map((image, index) => (
              <SortableImageItem
                key={image.id}
                image={image}
                index={index}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <ImagePreviewModal image={previewImage} onClose={handleClosePreview} />
    </div>
  )
}
