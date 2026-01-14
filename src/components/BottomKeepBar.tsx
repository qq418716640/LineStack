import { useRef } from 'react'
import { useStore } from '../store/StoreContext'
import { trackAdjustCrop } from '../utils/umami'
import './BottomKeepBar.css'

export function BottomKeepBar() {
  const { settings, updateSettings, images } = useStore()
  const hasTracked = useRef(false)

  const subtitleCount = images.filter((img) => img.type === 'subtitle').length

  if (subtitleCount === 0) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    updateSettings({ bottomKeepRatio: value })
    // Only track once per session to avoid spam
    if (!hasTracked.current) {
      trackAdjustCrop()
      hasTracked.current = true
    }
  }

  return (
    <div className="bottom-keep-bar">
      <div className="bottom-keep-bar__header">
        <h3 className="bottom-keep-bar__title">Subtitle Crop</h3>
        <span className="bottom-keep-bar__hint">
          Adjust how much of the bottom to keep for subtitle images
        </span>
      </div>
      <div className="bottom-keep-bar__slider-container">
        <div className="bottom-keep-bar__preview">
          <div className="bottom-keep-bar__preview-image">
            <div
              className="bottom-keep-bar__preview-crop"
              style={{
                height: `${(1 - settings.bottomKeepRatio) * 100}%`,
              }}
            />
            <div className="bottom-keep-bar__preview-keep">
              Keep
            </div>
          </div>
        </div>
        <div className="bottom-keep-bar__slider-wrapper">
          <span className="bottom-keep-bar__label">Less</span>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={settings.bottomKeepRatio}
            onChange={handleChange}
            className="bottom-keep-bar__slider"
          />
          <span className="bottom-keep-bar__label">More</span>
        </div>
      </div>
    </div>
  )
}
