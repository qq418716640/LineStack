import { useState, useRef, useEffect, useCallback } from 'react';
import { useImageStore } from '../../hooks/useImageStore';
import type { ImageItem, CropParams } from '../../types';
import { DEFAULT_CROP_PARAMS } from '../../constants';

interface CropEditorProps {
  image: ImageItem;
  onClose: () => void;
}

export function CropEditor({ image, onClose }: CropEditorProps) {
  const { globalCrop, setGlobalCrop, setImageCustomCrop } = useImageStore();

  // 初始化裁切参数
  const getInitialCrop = (): { topRatio: number; heightRatio: number } => {
    const params =
      image.cropMode === 'custom' && image.customCrop
        ? image.customCrop
        : globalCrop.enabled
        ? globalCrop.params
        : DEFAULT_CROP_PARAMS;

    if (params.method === 'bottom_ratio' && params.bottomPercent !== undefined) {
      return {
        topRatio: 1 - params.bottomPercent / 100,
        heightRatio: params.bottomPercent / 100,
      };
    }

    return {
      topRatio: params.topRatio ?? 0.8,
      heightRatio: params.heightRatio ?? 0.2,
    };
  };

  const initialCrop = getInitialCrop();
  const [topRatio, setTopRatio] = useState(initialCrop.topRatio);
  const [heightRatio, setHeightRatio] = useState(initialCrop.heightRatio);
  const [quickPercent, setQuickPercent] = useState(
    Math.round((1 - initialCrop.topRatio) * 100).toString()
  );
  const [applyToAll, setApplyToAll] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'top' | 'bottom' | null>(null);

  // 更新快捷百分比显示
  useEffect(() => {
    setQuickPercent(Math.round(heightRatio * 100).toString());
  }, [heightRatio]);

  // 处理拖拽
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, edge: 'top' | 'bottom') => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(edge);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const y = (e.clientY - rect.top) / rect.height;
      const clampedY = Math.max(0, Math.min(1, y));

      if (isDragging === 'top') {
        const newTop = Math.min(clampedY, 1 - 0.05); // 最小高度 5%
        const newHeight = Math.max(0.05, 1 - newTop);
        setTopRatio(newTop);
        setHeightRatio(newHeight);
      } else if (isDragging === 'bottom') {
        const newHeight = Math.max(0.05, clampedY - topRatio);
        setHeightRatio(Math.min(newHeight, 1 - topRatio));
      }
    },
    [isDragging, topRatio]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // 快捷裁切输入
  const handleQuickPercentChange = (value: string) => {
    setQuickPercent(value);
    const percent = parseInt(value, 10);
    if (!isNaN(percent) && percent >= 1 && percent <= 100) {
      setTopRatio(1 - percent / 100);
      setHeightRatio(percent / 100);
    }
  };

  // 保存
  const handleSave = () => {
    const cropParams: CropParams = {
      method: 'drag',
      topRatio,
      heightRatio,
    };

    if (applyToAll) {
      setGlobalCrop(cropParams);
    } else {
      setImageCustomCrop(image.id, cropParams);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Crop</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {/* 图片预览区域 */}
          <div
            ref={containerRef}
            className="relative bg-gray-900 rounded-lg overflow-hidden select-none"
            style={{ aspectRatio: `${image.originalWidth} / ${image.originalHeight}` }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <img
              src={image.url}
              alt="Preview"
              className="w-full h-full object-contain"
              draggable={false}
            />

            {/* 遮罩层 - 上方 */}
            <div
              className="absolute left-0 right-0 top-0 bg-black/60 pointer-events-none"
              style={{ height: `${topRatio * 100}%` }}
            />

            {/* 遮罩层 - 下方 */}
            <div
              className="absolute left-0 right-0 bottom-0 bg-black/60 pointer-events-none"
              style={{ height: `${(1 - topRatio - heightRatio) * 100}%` }}
            />

            {/* 裁切框 */}
            <div
              className="absolute left-0 right-0 border-2 border-primary"
              style={{
                top: `${topRatio * 100}%`,
                height: `${heightRatio * 100}%`,
              }}
            >
              {/* 上边界拖拽手柄 */}
              <div
                className="crop-handle absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 flex items-center justify-center"
                onPointerDown={(e) => handlePointerDown(e, 'top')}
              >
                <div className="w-8 h-1.5 bg-primary rounded-full" />
              </div>

              {/* 下边界拖拽手柄 */}
              <div
                className="crop-handle absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-6 flex items-center justify-center"
                onPointerDown={(e) => handlePointerDown(e, 'bottom')}
              >
                <div className="w-8 h-1.5 bg-primary rounded-full" />
              </div>

              {/* 尺寸显示 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded">
                  {Math.round(heightRatio * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 快捷裁切 */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              Quick crop: Keep bottom
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={quickPercent}
                onChange={(e) => handleQuickPercentChange(e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>

          {/* 应用到全部 */}
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                Apply to all subtitle-only images
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors btn-press"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
