export type ImageType = 'keyframe' | 'subtitle'

export interface ImageItem {
  id: string
  file: File
  type: ImageType
  manualKeyframe: boolean
  previewUrl: string
}

export type OutputWidth = 720 | 1080

export type BackgroundColor = '#FFFFFF' | '#000000' | '#333333'

export interface GlobalSettings {
  outputWidth: OutputWidth
  enableKeyframeGap: boolean
  gapSize: number
  backgroundColor: BackgroundColor
  bottomKeepRatio: number
  watermarkText: string
  jpgQuality: number
}

export interface ExportProgress {
  status: 'idle' | 'processing' | 'done' | 'error'
  current: number
  total: number
  message: string
}

export const MAX_IMAGES = 30
export const MAX_WATERMARK_LENGTH = 20
export const DEFAULT_GAP_SIZE = 8
export const DEFAULT_BOTTOM_KEEP_RATIO = 0.2
export const DEFAULT_JPG_QUALITY = 0.9

export const MAX_HEIGHT_MAP: Record<OutputWidth, number> = {
  720: 18000,
  1080: 12000,
}

export const DEFAULT_SETTINGS: GlobalSettings = {
  outputWidth: 720,
  enableKeyframeGap: false,
  gapSize: DEFAULT_GAP_SIZE,
  backgroundColor: '#FFFFFF',
  bottomKeepRatio: DEFAULT_BOTTOM_KEEP_RATIO,
  watermarkText: '',
  jpgQuality: DEFAULT_JPG_QUALITY,
}
