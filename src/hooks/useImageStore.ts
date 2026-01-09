import { create } from 'zustand';
import type { ImageItem, CropParams, GlobalCropSettings, CropMode } from '../types';
import { MAX_IMAGES, DEFAULT_GLOBAL_CROP } from '../constants';

/** 生成唯一 ID */
function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** 获取图片尺寸 */
function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

/** 数组元素移动 */
function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}

interface ImageStore {
  /** 图片列表 */
  images: ImageItem[];
  /** 全局裁切设置 */
  globalCrop: GlobalCropSettings;

  /** 添加图片 */
  addImages: (files: FileList | File[]) => Promise<{ added: number; skipped: number }>;
  /** 移除图片 */
  removeImage: (id: string) => void;
  /** 重新排序 */
  reorderImages: (fromIndex: number, toIndex: number) => void;
  /** 置顶图片 */
  moveToTop: (id: string) => void;
  /** 设置图片类型 */
  setImageType: (id: string, type: 'keyframe' | 'subtitle') => void;
  /** 设置图片裁切模式 */
  setImageCropMode: (id: string, mode: CropMode) => void;
  /** 设置图片自定义裁切 */
  setImageCustomCrop: (id: string, crop: CropParams) => void;
  /** 设置全局裁切 */
  setGlobalCrop: (params: CropParams) => void;
  /** 清空所有图片 */
  clearAll: () => void;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  globalCrop: DEFAULT_GLOBAL_CROP,

  addImages: async (files) => {
    const currentCount = get().images.length;
    const maxAdd = MAX_IMAGES - currentCount;

    if (maxAdd <= 0) {
      return { added: 0, skipped: Array.from(files).length };
    }

    const filesToAdd = Array.from(files).slice(0, maxAdd);
    const skipped = Array.from(files).length - filesToAdd.length;

    const newImages: ImageItem[] = [];

    for (let i = 0; i < filesToAdd.length; i++) {
      const file = filesToAdd[i];
      try {
        const url = URL.createObjectURL(file);
        const { width, height } = await getImageDimensions(url);
        const isFirst = currentCount === 0 && i === 0;

        newImages.push({
          id: generateId(),
          file,
          url,
          originalWidth: width,
          originalHeight: height,
          type: isFirst ? 'keyframe' : 'subtitle',
          cropMode: 'global',
        });
      } catch (error) {
        console.error('Failed to load image:', file.name, error);
      }
    }

    set((state) => ({
      images: [...state.images, ...newImages],
    }));

    return { added: newImages.length, skipped };
  },

  removeImage: (id) => {
    set((state) => {
      const newImages = state.images.filter((img) => img.id !== id);

      // 确保第一张是 keyframe
      if (newImages.length > 0 && newImages[0].type !== 'keyframe') {
        newImages[0] = { ...newImages[0], type: 'keyframe' };
      }

      // 释放被删除图片的 Object URL
      const removedImage = state.images.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.url);
      }

      return { images: newImages };
    });
  },

  reorderImages: (fromIndex, toIndex) => {
    set((state) => {
      const newImages = arrayMove(state.images, fromIndex, toIndex);

      // 第一张强制 keyframe
      if (newImages.length > 0) {
        // 如果原来第一张被移走，变回 subtitle
        if (fromIndex === 0 && toIndex !== 0) {
          newImages[toIndex] = { ...newImages[toIndex], type: 'subtitle' };
        }
        // 新的第一张变成 keyframe
        newImages[0] = { ...newImages[0], type: 'keyframe' };
      }

      return { images: newImages };
    });
  },

  moveToTop: (id) => {
    set((state) => {
      const index = state.images.findIndex((img) => img.id === id);
      if (index <= 0) return state;

      const newImages = arrayMove(state.images, index, 0);

      // 原来第一张变回 subtitle
      if (newImages.length > 1) {
        newImages[1] = { ...newImages[1], type: 'subtitle' };
      }
      // 新的第一张变成 keyframe
      newImages[0] = { ...newImages[0], type: 'keyframe' };

      return { images: newImages };
    });
  },

  setImageType: (id, type) => {
    set((state) => ({
      images: state.images.map((img, index) => {
        if (img.id !== id) return img;
        // 第一张不能改成 subtitle
        if (index === 0 && type === 'subtitle') return img;
        return { ...img, type };
      }),
    }));
  },

  setImageCropMode: (id, mode) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, cropMode: mode } : img
      ),
    }));
  },

  setImageCustomCrop: (id, crop) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, customCrop: crop, cropMode: 'custom' } : img
      ),
    }));
  },

  setGlobalCrop: (params) => {
    set({
      globalCrop: { enabled: true, params },
    });
  },

  clearAll: () => {
    // 释放所有 Object URL
    get().images.forEach((img) => URL.revokeObjectURL(img.url));
    set({
      images: [],
      globalCrop: DEFAULT_GLOBAL_CROP,
    });
  },
}));
