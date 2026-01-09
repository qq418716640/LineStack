import { useState } from 'react';
import { useImageStore } from '../../hooks/useImageStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { composeImages } from '../../utils/canvasComposer';
import { downloadBlobs } from '../../utils/download';
import { estimateTotalHeight } from '../../utils/imageProcessor';
import { assessRisk } from '../../utils/riskCalculator';
import { RiskIndicator } from '../RiskIndicator/RiskIndicator';

export function ExportButton() {
  const { images, globalCrop } = useImageStore();
  const { settings } = useSettingsStore();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, stage: '' });

  const canExport = images.length > 0;

  // 计算预估高度和风险
  const estimatedHeight = canExport
    ? estimateTotalHeight(images, globalCrop, settings.outputWidth, settings.enableGap)
    : 0;
  const risk = canExport ? assessRisk(estimatedHeight, settings.outputWidth) : 'low';

  const handleExport = async () => {
    if (!canExport || isExporting) return;

    setIsExporting(true);
    setProgress({ percent: 0, stage: 'Starting...' });

    try {
      const blobs = await composeImages(images, globalCrop, settings, (percent, stage) => {
        setProgress({ percent, stage });
      });

      await downloadBlobs(blobs, 'linestack');

      setProgress({ percent: 100, stage: 'Done!' });
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setProgress({ percent: 0, stage: '' });
      }, 1000);
    }
  };

  if (!canExport) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* 状态栏 */}
      <RiskIndicator
        risk={risk}
        imageCount={images.length}
        estimatedHeight={estimatedHeight}
      />

      {/* 风险警告 */}
      {risk === 'high' && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
          High risk: Image will be exported in multiple segments to prevent memory issues.
        </div>
      )}

      {risk === 'medium' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-700">
          Medium risk: Export may be slow on some devices.
        </div>
      )}

      {/* 导出按钮 */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          w-full py-3 rounded-xl font-semibold text-white transition-all btn-press
          ${
            isExporting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-600 active:bg-blue-700'
          }
        `}
      >
        {isExporting ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>
              {progress.stage} ({progress.percent}%)
            </span>
          </div>
        ) : (
          'Export Image'
        )}
      </button>
    </div>
  );
}
