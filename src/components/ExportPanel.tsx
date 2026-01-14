import { useState, useRef } from 'react'
import { useStore } from '../store/StoreContext'
import { OutputWidth, BackgroundColor, MAX_WATERMARK_LENGTH } from '../types'
import { processImages, downloadBlob } from '../utils/imageProcessor'
import { trackChangeSettings, trackExportStart, trackExportSuccess, trackExportError, trackAdjustCrop } from '../utils/umami'
import './ExportPanel.css'

interface Props {
  disabled?: boolean
}

export function ExportPanel({ disabled = false }: Props) {
  const { images, settings, updateSettings, exportProgress, updateExportProgress } = useStore()
  const [isExporting, setIsExporting] = useState(false)
  const cropTracked = useRef(false)

  const firstImage = images[0]
  const keyframeCount = images.filter((img) => img.type === 'keyframe').length
  const subtitleCount = images.filter((img) => img.type === 'subtitle').length
  const hasImages = images.length > 0

  const handleWidthChange = (width: OutputWidth) => {
    if (disabled) return
    updateSettings({ outputWidth: width })
    trackChangeSettings('width')
  }

  const handleGapToggle = () => {
    if (disabled) return
    updateSettings({ enableKeyframeGap: !settings.enableKeyframeGap })
    trackChangeSettings('gap')
  }

  const handleBackgroundChange = (color: BackgroundColor) => {
    if (disabled) return
    updateSettings({ backgroundColor: color })
    trackChangeSettings('background')
  }

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const value = e.target.value.slice(0, MAX_WATERMARK_LENGTH)
    updateSettings({ watermarkText: value })
  }

  const handleCropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const value = parseFloat(e.target.value)
    updateSettings({ bottomKeepRatio: value })
    if (!cropTracked.current) {
      trackAdjustCrop()
      cropTracked.current = true
    }
  }

  const handleExport = async () => {
    if (images.length === 0 || isExporting || disabled) return

    setIsExporting(true)
    trackExportStart(images.length, settings.outputWidth)
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

      for (let i = 0; i < blobs.length; i++) {
        const filename =
          blobs.length === 1
            ? 'linestack.jpg'
            : `linestack_${String(i + 1).padStart(2, '0')}.jpg`
        downloadBlob(blobs[i], filename)

        if (i < blobs.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      updateExportProgress({
        status: 'done',
        message: `Successfully exported ${blobs.length} image(s)!`,
      })
      trackExportSuccess(blobs.length)

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
      const errorMessage = error instanceof Error ? error.message : 'unknown'
      trackExportError(errorMessage)
      updateExportProgress({
        status: 'error',
        message: 'Export failed. Please try again.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getExportRisk = (): { level: 'low' | 'medium' | 'high'; label: string } => {
    const count = images.length
    if (count <= 10) return { level: 'low', label: 'Low' }
    if (count <= 20) return { level: 'medium', label: 'Medium' }
    return { level: 'high', label: 'High' }
  }

  const exportRisk = getExportRisk()

  return (
    <div className={`export-panel ${disabled ? 'export-panel--disabled' : ''}`}>
      {/* Subtitle Crop Section */}
      <div className="export-panel__section">
        <div className="export-panel__section-header">
          <h3 className="export-panel__section-title">Subtitle Crop</h3>
          <span className="export-panel__section-hint">
            Adjust how much to keep for subtitle images
          </span>
        </div>
        <div className="export-panel__crop">
          <div className="export-panel__crop-preview">
            {firstImage ? (
              <img src={firstImage.previewUrl} alt="Preview" />
            ) : (
              <div className="export-panel__crop-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                </svg>
              </div>
            )}
            <div
              className="export-panel__crop-overlay"
              style={{ height: `${(1 - settings.bottomKeepRatio) * 100}%` }}
            />
            <div className="export-panel__crop-label">Keep</div>
          </div>
          <div className="export-panel__crop-slider">
            <span>Less</span>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={settings.bottomKeepRatio}
              onChange={handleCropChange}
              disabled={disabled}
            />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Export Settings Section */}
      <div className="export-panel__section">
        <div className="export-panel__section-header">
          <h3 className="export-panel__section-title">Export Settings</h3>
        </div>

        <div className="export-panel__row">
          <label>Output Width</label>
          <div className="export-panel__btn-group">
            <button
              className={settings.outputWidth === 720 ? 'active' : ''}
              onClick={() => handleWidthChange(720)}
              disabled={disabled}
            >
              720px
            </button>
            <button
              className={settings.outputWidth === 1080 ? 'active' : ''}
              onClick={() => handleWidthChange(1080)}
              disabled={disabled}
            >
              1080px
            </button>
          </div>
        </div>

        <div className="export-panel__row">
          <label>Image Gap</label>
          <button
            className={`export-panel__toggle ${settings.enableKeyframeGap ? 'active' : ''}`}
            onClick={handleGapToggle}
            disabled={disabled}
          >
            <span className="export-panel__toggle-slider" />
          </button>
        </div>

        {settings.enableKeyframeGap && (
          <div className="export-panel__row">
            <label>Gap Color</label>
            <div className="export-panel__color-group">
              {(['#FFFFFF', '#333333', '#000000'] as BackgroundColor[]).map((color) => (
                <button
                  key={color}
                  className={`export-panel__color-btn ${settings.backgroundColor === color ? 'active' : ''}`}
                  style={{ background: color }}
                  onClick={() => handleBackgroundChange(color)}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        )}

        <div className="export-panel__row">
          <label>
            Watermark
            <span className="export-panel__hint">
              ({settings.watermarkText.length}/{MAX_WATERMARK_LENGTH})
            </span>
          </label>
          <input
            type="text"
            className="export-panel__input"
            placeholder="Optional"
            value={settings.watermarkText}
            onChange={handleWatermarkChange}
            maxLength={MAX_WATERMARK_LENGTH}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Export Action Section */}
      <div className="export-panel__action">
        {hasImages && (
          <div className="export-panel__summary">
            <div className="export-panel__summary-row">
              <span>Images:</span>
              <span>{images.length} ({keyframeCount} key, {subtitleCount} sub)</span>
            </div>
            <div className="export-panel__summary-row">
              <span>Risk:</span>
              <span className={`export-panel__risk export-panel__risk--${exportRisk.level}`}>
                {exportRisk.label}
              </span>
            </div>
          </div>
        )}

        {hasImages && images.length > 15 && (
          <div className="export-panel__notice">
            Long conversations may be split into multiple files.
          </div>
        )}

        {exportProgress.status !== 'idle' && (
          <div
            className={`export-panel__status ${
              exportProgress.status === 'error' ? 'export-panel__status--error' : ''
            } ${exportProgress.status === 'done' ? 'export-panel__status--success' : ''}`}
          >
            {exportProgress.message}
          </div>
        )}

        <button
          className="export-panel__export-btn"
          onClick={handleExport}
          disabled={isExporting || !hasImages || disabled}
        >
          {isExporting ? (
            <>
              <span className="export-panel__spinner" />
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

        <p className="export-panel__disclaimer">
          {disabled
            ? 'Upload images to get started'
            : 'Free forever. No uploads. Your images stay on your device.'}
        </p>
      </div>
    </div>
  )
}
