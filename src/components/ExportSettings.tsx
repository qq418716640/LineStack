import { useStore } from '../store/StoreContext'
import { OutputWidth, BackgroundColor, MAX_WATERMARK_LENGTH } from '../types'
import './ExportSettings.css'

export function ExportSettings() {
  const { settings, updateSettings, images } = useStore()

  if (images.length === 0) {
    return null
  }

  const keyframeCount = images.filter((img) => img.type === 'keyframe').length
  const canEnableGap = keyframeCount >= 2

  const handleWidthChange = (width: OutputWidth) => {
    updateSettings({ outputWidth: width })
  }

  const handleGapToggle = () => {
    updateSettings({ enableKeyframeGap: !settings.enableKeyframeGap })
  }

  const handleBackgroundChange = (color: BackgroundColor) => {
    updateSettings({ backgroundColor: color })
  }

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_WATERMARK_LENGTH)
    updateSettings({ watermarkText: value })
  }

  return (
    <div className="export-settings">
      <h3 className="export-settings__title">Export Settings</h3>

      <div className="export-settings__section">
        <label className="export-settings__label">Output Width</label>
        <div className="export-settings__button-group">
          <button
            className={`export-settings__btn ${
              settings.outputWidth === 720 ? 'export-settings__btn--active' : ''
            }`}
            onClick={() => handleWidthChange(720)}
          >
            720px
          </button>
          <button
            className={`export-settings__btn ${
              settings.outputWidth === 1080 ? 'export-settings__btn--active' : ''
            }`}
            onClick={() => handleWidthChange(1080)}
          >
            1080px
          </button>
        </div>
      </div>

      <div className="export-settings__section">
        <label className="export-settings__label">
          Keyframe Gap
          {!canEnableGap && (
            <span className="export-settings__hint"> (Need 2+ keyframes)</span>
          )}
        </label>
        <button
          className={`export-settings__toggle ${
            settings.enableKeyframeGap ? 'export-settings__toggle--active' : ''
          }`}
          onClick={handleGapToggle}
          disabled={!canEnableGap}
        >
          <span className="export-settings__toggle-slider" />
        </button>
      </div>

      {settings.enableKeyframeGap && (
        <div className="export-settings__section">
          <label className="export-settings__label">Gap Background</label>
          <div className="export-settings__color-group">
            {(['#FFFFFF', '#333333', '#000000'] as BackgroundColor[]).map(
              (color) => (
                <button
                  key={color}
                  className={`export-settings__color-btn ${
                    settings.backgroundColor === color
                      ? 'export-settings__color-btn--active'
                      : ''
                  }`}
                  style={{ background: color }}
                  onClick={() => handleBackgroundChange(color)}
                  title={color}
                />
              )
            )}
          </div>
        </div>
      )}

      <div className="export-settings__section">
        <label className="export-settings__label">
          Watermark
          <span className="export-settings__hint">
            {' '}
            ({settings.watermarkText.length}/{MAX_WATERMARK_LENGTH})
          </span>
        </label>
        <input
          type="text"
          className="export-settings__input"
          placeholder="Optional watermark text"
          value={settings.watermarkText}
          onChange={handleWatermarkChange}
          maxLength={MAX_WATERMARK_LENGTH}
        />
      </div>
    </div>
  )
}
