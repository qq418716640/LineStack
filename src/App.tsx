import { useState } from 'react';
import { Header } from './components/Header/Header';
import { ImageUploader } from './components/ImageUploader/ImageUploader';
import { ImageList } from './components/ImageList/ImageList';
import { CropEditor } from './components/CropEditor/CropEditor';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { ExportButton } from './components/ExportButton/ExportButton';
import { useImageStore } from './hooks/useImageStore';
import type { ImageItem } from './types';

function App() {
  const { images } = useImageStore();
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);

  const handleEditCrop = (image: ImageItem) => {
    setEditingImage(image);
  };

  const handleCloseCropEditor = () => {
    setEditingImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 上传区域 */}
        <ImageUploader />

        {/* 图片列表 */}
        {images.length > 0 && (
          <>
            <ImageList onEditCrop={handleEditCrop} />

            {/* 设置面板 */}
            <SettingsPanel />

            {/* 导出按钮 */}
            <ExportButton />
          </>
        )}

        {/* 空状态提示 */}
        {images.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No images yet</h3>
            <p className="text-gray-500 text-sm">
              Upload your dialogue screenshots to get started
            </p>
          </div>
        )}
      </main>

      {/* 底部信息 */}
      <footer className="text-center py-4 text-xs text-gray-400">
        <p>LineStack - Stack dialogue screenshots into a clean vertical story</p>
        <p className="mt-1">All processing happens locally in your browser</p>
      </footer>

      {/* 裁切编辑器弹窗 */}
      {editingImage && (
        <CropEditor image={editingImage} onClose={handleCloseCropEditor} />
      )}
    </div>
  );
}

export default App;
