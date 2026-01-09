import { useState } from 'react';
import { useImageStore } from '../../hooks/useImageStore';
import type { ImageItem } from '../../types';

interface ImageCardProps {
  image: ImageItem;
  index: number;
  onEditCrop: () => void;
}

export function ImageCard({ image, index, onEditCrop }: ImageCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { removeImage, moveToTop, setImageType } = useImageStore();

  const isFirst = index === 0;
  const isKeyframe = image.type === 'keyframe';

  const handleToggleType = () => {
    if (isFirst) return; // 第一张不能切换
    setImageType(image.id, isKeyframe ? 'subtitle' : 'keyframe');
    setShowMenu(false);
  };

  const handleMoveToTop = () => {
    moveToTop(image.id);
    setShowMenu(false);
  };

  const handleRemove = () => {
    removeImage(image.id);
    setShowMenu(false);
  };

  return (
    <div className="image-card relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 类型标签 */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
        <span
          className={`
            px-2 py-0.5 text-xs font-medium rounded
            ${
              isKeyframe
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }
          `}
        >
          {isKeyframe ? 'K' : 'S'}
        </span>
        {isFirst && (
          <span className="text-yellow-500" title="First image (locked as Keyframe)">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        )}
      </div>

      {/* 更多菜单按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-8 right-2 z-30 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
            {!isFirst && (
              <button
                onClick={handleMoveToTop}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Move to Top
              </button>
            )}
            <button
              onClick={handleToggleType}
              disabled={isFirst}
              className={`
                w-full px-3 py-2 text-left text-sm flex items-center gap-2
                ${isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {isKeyframe ? 'Set as Subtitle' : 'Set as Keyframe'}
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleRemove}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
        </>
      )}

      {/* 图片缩略图 */}
      <div className="aspect-video bg-gray-100">
        <img
          src={image.url}
          alt={`Image ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* 底部操作栏 */}
      <div className="p-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">#{index + 1}</span>
        {image.type === 'subtitle' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditCrop();
            }}
            className="text-xs text-primary hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
            Edit crop
          </button>
        )}
      </div>
    </div>
  );
}
