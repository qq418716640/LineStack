import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  ImageItem,
  GlobalSettings,
  ExportProgress,
  DEFAULT_SETTINGS,
  MAX_IMAGES,
} from '../types'

export function useLineStackStore() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS)
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    status: 'idle',
    current: 0,
    total: 0,
    message: '',
  })

  const addImages = useCallback((files: File[]) => {
    setImages((prev) => {
      const remaining = MAX_IMAGES - prev.length
      if (remaining <= 0) return prev

      const filesToAdd = files.slice(0, remaining)
      const newImages: ImageItem[] = filesToAdd.map((file, index) => ({
        id: uuidv4(),
        file,
        type: prev.length === 0 && index === 0 ? 'keyframe' : 'subtitle',
        manualKeyframe: false,
        previewUrl: URL.createObjectURL(file),
      }))

      return [...prev, ...newImages]
    })
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id)
      // Ensure first image is keyframe
      if (filtered.length > 0 && filtered[0].type !== 'keyframe') {
        filtered[0] = { ...filtered[0], type: 'keyframe' }
      }
      return filtered
    })
  }, [])

  const clearAllImages = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.previewUrl))
      return []
    })
  }, [])

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      const [removed] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, removed)

      // Apply keyframe rules after reorder
      return newImages.map((img, index) => {
        if (index === 0) {
          // First position is always keyframe
          return { ...img, type: 'keyframe' }
        }
        // If moved away from first position and wasn't manually set
        if (img.type === 'keyframe' && !img.manualKeyframe) {
          return { ...img, type: 'subtitle' }
        }
        return img
      })
    })
  }, [])

  const moveToTop = useCallback((id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      if (index <= 0) return prev

      const newImages = [...prev]
      const [removed] = newImages.splice(index, 1)
      newImages.unshift(removed)

      // Apply keyframe rules
      return newImages.map((img, idx) => {
        if (idx === 0) {
          return { ...img, type: 'keyframe' }
        }
        if (img.type === 'keyframe' && !img.manualKeyframe) {
          return { ...img, type: 'subtitle' }
        }
        return img
      })
    })
  }, [])

  const toggleImageType = useCallback((id: string) => {
    setImages((prev) => {
      return prev.map((img, index) => {
        if (img.id !== id) return img
        // First image cannot be changed to subtitle
        if (index === 0) return img

        const newType = img.type === 'keyframe' ? 'subtitle' : 'keyframe'
        return {
          ...img,
          type: newType,
          manualKeyframe: newType === 'keyframe',
        }
      })
    })
  }, [])

  const updateSettings = useCallback(
    (updates: Partial<GlobalSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }))
    },
    []
  )

  const updateExportProgress = useCallback((progress: Partial<ExportProgress>) => {
    setExportProgress((prev) => ({ ...prev, ...progress }))
  }, [])

  return {
    images,
    settings,
    exportProgress,
    addImages,
    removeImage,
    clearAllImages,
    reorderImages,
    moveToTop,
    toggleImageType,
    updateSettings,
    updateExportProgress,
  }
}

export type LineStackStore = ReturnType<typeof useLineStackStore>
