import { ImageItem, GlobalSettings, MAX_HEIGHT_MAP } from '../types'

interface ProcessedImage {
  bitmap: ImageBitmap
  width: number
  height: number
  isKeyframe: boolean
}

export async function loadImage(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file)
}

export async function processImages(
  images: ImageItem[],
  settings: GlobalSettings,
  onProgress: (current: number, total: number) => void
): Promise<Blob[]> {
  const { outputWidth, bottomKeepRatio, enableKeyframeGap, gapSize, backgroundColor, watermarkText, jpgQuality } = settings
  const maxHeight = MAX_HEIGHT_MAP[outputWidth]

  // Load and process all images
  const processedImages: ProcessedImage[] = []

  for (let i = 0; i < images.length; i++) {
    onProgress(i + 1, images.length)
    const img = images[i]
    const bitmap = await loadImage(img.file)

    const isKeyframe = img.type === 'keyframe'
    const originalWidth = bitmap.width
    const originalHeight = bitmap.height

    // Calculate scaled dimensions
    const scale = outputWidth / originalWidth
    let cropHeight = originalHeight

    if (!isKeyframe) {
      // Crop from top, keep bottom portion
      cropHeight = Math.round(originalHeight * bottomKeepRatio)
    }

    const scaledHeight = Math.round(cropHeight * scale)

    processedImages.push({
      bitmap,
      width: outputWidth,
      height: scaledHeight,
      isKeyframe,
    })
  }

  // Calculate total height and determine if we need to split
  const keyframeCount = processedImages.filter(p => p.isKeyframe).length
  const shouldAddGap = enableKeyframeGap && keyframeCount >= 2

  let totalHeight = 0
  let prevWasKeyframe = false

  for (const processed of processedImages) {
    if (shouldAddGap && prevWasKeyframe && processed.isKeyframe) {
      totalHeight += gapSize
    }
    totalHeight += processed.height
    prevWasKeyframe = processed.isKeyframe
  }

  // Split into segments if needed
  const segments = splitIntoSegments(processedImages, maxHeight, shouldAddGap, gapSize)

  // Render each segment
  const blobs: Blob[] = []

  for (const segment of segments) {
    const blob = await renderSegment(
      segment.images,
      segment.height,
      outputWidth,
      shouldAddGap,
      gapSize,
      backgroundColor,
      watermarkText,
      jpgQuality,
      settings.bottomKeepRatio
    )
    blobs.push(blob)
  }

  // Clean up bitmaps
  processedImages.forEach(p => p.bitmap.close())

  return blobs
}

interface Segment {
  images: ProcessedImage[]
  height: number
}

function splitIntoSegments(
  images: ProcessedImage[],
  maxHeight: number,
  shouldAddGap: boolean,
  gapSize: number
): Segment[] {
  const segments: Segment[] = []
  let currentSegment: ProcessedImage[] = []
  let currentHeight = 0
  let prevWasKeyframe = false

  for (const img of images) {
    const gapBefore = shouldAddGap && prevWasKeyframe && img.isKeyframe ? gapSize : 0
    const neededHeight = gapBefore + img.height

    // Check if adding this image would exceed max height
    // Don't split if it's the only image in segment
    if (currentSegment.length > 0 && currentHeight + neededHeight > maxHeight) {
      segments.push({ images: currentSegment, height: currentHeight })
      currentSegment = []
      currentHeight = 0
      prevWasKeyframe = false
    }

    // Recalculate gap for new segment context
    const actualGap = shouldAddGap && prevWasKeyframe && img.isKeyframe ? gapSize : 0
    currentHeight += actualGap + img.height
    currentSegment.push(img)
    prevWasKeyframe = img.isKeyframe
  }

  if (currentSegment.length > 0) {
    segments.push({ images: currentSegment, height: currentHeight })
  }

  return segments
}

async function renderSegment(
  images: ProcessedImage[],
  height: number,
  width: number,
  shouldAddGap: boolean,
  gapSize: number,
  backgroundColor: string,
  watermarkText: string,
  jpgQuality: number,
  bottomKeepRatio: number
): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!

  // Fill with white background (for JPG)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)

  let y = 0
  let prevWasKeyframe = false

  for (const img of images) {
    // Add gap before keyframe if needed
    if (shouldAddGap && prevWasKeyframe && img.isKeyframe) {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, y, width, gapSize)
      y += gapSize
    }

    const bitmap = img.bitmap

    if (img.isKeyframe) {
      // Draw full image scaled
      ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, y, width, img.height)
    } else {
      // Draw cropped bottom portion
      const cropTop = bitmap.height * (1 - bottomKeepRatio)
      const cropHeight = bitmap.height * bottomKeepRatio
      ctx.drawImage(
        bitmap,
        0, cropTop, bitmap.width, cropHeight,
        0, y, width, img.height
      )
    }

    y += img.height
    prevWasKeyframe = img.isKeyframe
  }

  // Draw watermark if provided
  if (watermarkText) {
    drawWatermark(ctx, watermarkText, width, height)
  }

  return canvas.convertToBlob({ type: 'image/jpeg', quality: jpgQuality })
}

function drawWatermark(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number
) {
  const fontSize = Math.round(canvasWidth * 0.025)
  const padding = Math.round(canvasWidth * 0.02)

  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'

  // Draw text shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillText(text, canvasWidth - padding + 1, canvasHeight - padding + 1)

  // Draw text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.fillText(text, canvasWidth - padding, canvasHeight - padding)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
