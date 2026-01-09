import { useState } from 'react';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useImageStore } from '../../hooks/useImageStore';
import {
  OUTPUT_WIDTHS,
  BACKGROUND_COLORS,
  WATERMARK_MAX_LENGTH,
} from '../../constants';
import type { OutputWidth, BackgroundColor } from '../../types';

export function SettingsPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { settings, setOutputWidth, setEnableGap, setGapColor, setWatermark } =
    useSettingsStore();
  const { images } = useImageStore();

  // 检查是否有 ≥2 个 Keyframe
  const keyframeCount = images.filter((img) => img.type === 'keyframe').length;
  const canEnableGap = keyframeCount >= 2;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">Settings</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-5">
          {/* Output Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Width
            </label>
            <div className="flex gap-2">
              {OUTPUT_WIDTHS.map((width) => (
                <button
                  key={width}
                  onClick={() => setOutputWidth(width as OutputWidth)}
                  className={`
                    flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      settings.outputWidth === width
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {width}px
                </button>
              ))}
            </div>
          </div>

          {/* Keyframe Gap */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableGap}
                onChange={(e) => setEnableGap(e.target.checked)}
                disabled={!canEnableGap}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
              />
              <div>
                <span
                  className={`text-sm font-medium ${
                    canEnableGap ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  Enable keyframe gap
                </span>
                {!canEnableGap && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Requires 2+ keyframes
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Background Color - 只在启用间距时显示 */}
          {settings.enableGap && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background (gap fill)
              </label>
              <div className="flex gap-2">
                {BACKGROUND_COLORS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setGapColor(value as BackgroundColor)}
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      flex items-center justify-center gap-2
                      ${
                        settings.gapColor === value
                          ? 'ring-2 ring-primary ring-offset-1'
                          : 'hover:bg-gray-50'
                      }
                      border border-gray-200
                    `}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: value }}
                    />
                    <span className="text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Watermark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Watermark
              <span className="text-gray-400 font-normal ml-1">
                (max {WATERMARK_MAX_LENGTH} chars)
              </span>
            </label>
            <input
              type="text"
              value={settings.watermark}
              onChange={(e) => setWatermark(e.target.value)}
              maxLength={WATERMARK_MAX_LENGTH}
              placeholder="Enter watermark text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {settings.watermark && (
              <p className="text-xs text-gray-400 mt-1 text-right">
                {settings.watermark.length}/{WATERMARK_MAX_LENGTH}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
