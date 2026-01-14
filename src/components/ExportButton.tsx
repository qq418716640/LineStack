import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { processImages, downloadBlob } from '../utils/imageProcessor'
import './ExportButton.css'

export function ExportButton() {
  const { images, settings, exportProgress, updateExportProgress } = useStore()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (images.length === 0 || isExporting) return

    setIsExporting(true)
    updateExportProgress({
      status: 'processing',
      current: 0,
      total: images.length,
      message: 'Processing images...',
    })

    try {
      const blobs = await processImages(images, settings, (current, total) => {
        updateExportProgress({
          current,
          total,
          message: `Processing image ${current}/${total}...`,
        })
      })

      updateExportProgress({
        status: 'done',
        message: `Exporting ${blobs.length} file(s)...`,
      })

      // Download all blobs
      for (let i = 0; i < blobs.length; i++) {
        const filename =
          blobs.length === 1
            ? 'linestack.jpg'
            : `linestack_${String(i + 1).padStart(2, '0')}.jpg`
        downloadBlob(blobs[i], filename)

        // Small delay between downloads
        if (i < blobs.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      updateExportProgress({
        status: 'done',
        message: `Successfully exported ${blobs.length} image(s)!`,
      })

      // Reset after a delay
      setTimeout(() => {
        updateExportProgress({
          status: 'idle',
          current: 0,
          total: 0,
          message: '',
        })
      }, 3000)
    } catch (error) {
      console.error('Export failed:', error)
      updateExportProgress({
        status: 'error',
        message: 'Export failed. Please try again.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const keyframeCount = images.filter((img) => img.type === 'keyframe').length
  const subtitleCount = images.filter((img) => img.type === 'subtitle').length

  // Calculate export risk based on image count and output width
  const getExportRisk = (): { level: 'low' | 'medium' | 'high'; label: string } => {
    const count = images.length
    if (count <= 10) return { level: 'low', label: 'Low' }
    if (count <= 20) return { level: 'medium', label: 'Medium' }
    return { level: 'high', label: 'High' }
  }

  const exportRisk = getExportRisk()

  if (images.length === 0) {
    return null
  }

  return (
    <div className="export-button-container">
      <div className="export-summary">
        <div className="export-summary__row">
          <span>Images:</span>
          <span>
            {images.length} ({keyframeCount} keyframe, {subtitleCount} subtitle)
          </span>
        </div>
        <div className="export-summary__row">
          <span>Output:</span>
          <span>
            {settings.outputWidth}px JPG
            {settings.enableKeyframeGap ? ` · ${settings.gapSize}px gap` : ''}
          </span>
        </div>
        <div className="export-summary__row">
          <span>Export Risk:</span>
          <span className={`export-risk export-risk--${exportRisk.level}`}>
            {exportRisk.label}
          </span>
        </div>
      </div>

      {images.length > 15 && (
        <div className="export-notice">
          Long conversations may be split into multiple files automatically.
        </div>
      )}

      {exportProgress.status !== 'idle' && (
        <div
          className={`export-status ${
            exportProgress.status === 'error' ? 'export-status--error' : ''
          } ${exportProgress.status === 'done' ? 'export-status--success' : ''}`}
        >
          {exportProgress.message}
        </div>
      )}

      <button
        className="export-btn"
        onClick={handleExport}
        disabled={isExporting || images.length === 0}
      >
        {isExporting ? (
          <>
            <span className="export-btn__spinner" />
            Processing...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export JPG
          </>
        )}
      </button>

      <p className="export-disclaimer">
        Free forever. No uploads. Your images stay on your device.
      </p>
    </div>
  )
}
