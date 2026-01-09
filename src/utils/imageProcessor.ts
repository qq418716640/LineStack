import type { ImageItem, CropParams, GlobalCropSettings, ProcessedSegment, OutputWidth } from '../types';
import { DEFAULT_CROP_PARAMS } from '../constants';

/**
 * 获取图片的裁切参数
 */
export function getCropParams(
  image: ImageItem,
  globalCrop: GlobalCropSettings
): CropParams {
  // Keyframe 不裁切
  if (image.type === 'keyframe') {
    return { method: 'drag', topRatio: 0, heightRatio: 1 };
  }

  // 自定义裁切
  if (image.cropMode === 'custom' && image.customCrop) {
    return image.customCrop;
  }

  // 全局裁切
  if (globalCrop.enabled) {
    return globalCrop.params;
  }

  // 默认裁切
  return DEFAULT_CROP_PARAMS;
}

/**
 * 根据裁切参数计算实际裁切区域
 */
export function calculateCropArea(
  imageHeight: number,
  cropParams: CropParams
): { cropY: number; cropHeight: number } {
  if (cropParams.method === 'bottom_ratio' && cropParams.bottomPercent !== undefined) {
    const cropHeight = Math.round(imageHeight * (cropParams.bottomPercent / 100));
    const cropY = imageHeight - cropHeight;
    return { cropY, cropHeight };
  }

  // drag 模式
  const topRatio = cropParams.topRatio ?? 0;
  const heightRatio = cropParams.heightRatio ?? 1;
  const cropY = Math.round(imageHeight * topRatio);
  const cropHeight = Math.round(imageHeight * heightRatio);

  return { cropY, cropHeight };
}

/**
 * 处理单张图片，返回 ProcessedSegment
 */
export async function processImage(
  image: ImageItem,
  globalCrop: GlobalCropSettings,
  outputWidth: OutputWidth
): Promise<ProcessedSegment> {
  const bitmap = await createImageBitmap(image.file);
  const cropParams = getCropParams(image, globalCrop);
  const { cropY, cropHeight } = calculateCropArea(bitmap.height, cropParams);

  // 计算缩放后的高度（保持宽高比）
  const scaledHeight = Math.round((cropHeight / bitmap.width) * outputWidth);

  return {
    bitmap,
    cropY,
    cropHeight,
    scaledHeight,
    isKeyframe: image.type === 'keyframe',
    imageId: image.id,
  };
}

/**
 * 计算预估总高度
 */
export function estimateTotalHeight(
  images: ImageItem[],
  globalCrop: GlobalCropSettings,
  outputWidth: OutputWidth,
  enableGap: boolean
): number {
  let totalHeight = 0;

  for (const image of images) {
    const cropParams = getCropParams(image, globalCrop);
    const { cropHeight } = calculateCropArea(image.originalHeight, cropParams);
    const scaledHeight = Math.round((cropHeight / image.originalWidth) * outputWidth);
    totalHeight += scaledHeight;
  }

  // 添加间距高度
  if (enableGap) {
    const gaps = calculateGaps(images);
    totalHeight += gaps.filter(Boolean).length * 8;
  }

  return totalHeight;
}

/**
 * 计算间距位置
 * 返回数组，表示每个图片前是否需要插入间距
 */
export function calculateGaps(images: ImageItem[]): boolean[] {
  // 检查是否有 ≥2 个 Keyframe
  const keyframeCount = images.filter((img) => img.type === 'keyframe').length;
  if (keyframeCount < 2) {
    return images.map(() => false);
  }

  return images.map((img, index) => {
    if (index === 0) return false; // 第一张前面不插入

    const prevImg = images[index - 1];
    // Subtitle-only → Keyframe 边界
    return prevImg.type === 'subtitle' && img.type === 'keyframe';
  });
}
