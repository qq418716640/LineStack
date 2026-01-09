import type {
  ImageItem,
  ExportSettings,
  GlobalCropSettings,
  ProcessedSegment,
} from '../types';
import { processImage, calculateGaps } from './imageProcessor';
import { assessRisk, getSegmentMaxHeight } from './riskCalculator';
import { KEYFRAME_GAP, EXPORT_QUALITY, WATERMARK_CONFIG } from '../constants';

/**
 * 绘制水印
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number
): void {
  const fontSize = Math.max(
    WATERMARK_CONFIG.minFontSize,
    Math.round(canvasWidth * WATERMARK_CONFIG.fontSizeRatio)
  );

  ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  // 添加阴影增强可读性
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = WATERMARK_CONFIG.shadowBlur;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillStyle = `rgba(255, 255, 255, ${WATERMARK_CONFIG.opacity})`;
  ctx.fillText(
    text,
    canvasWidth - WATERMARK_CONFIG.paddingRight,
    canvasHeight - WATERMARK_CONFIG.paddingBottom
  );

  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * 在画布上绘制单个分段
 */
function drawSegmentsOnCanvas(
  ctx: CanvasRenderingContext2D,
  segments: ProcessedSegment[],
  gaps: boolean[],
  startIndex: number,
  outputWidth: number
): number {
  let y = 0;

  for (let i = 0; i < segments.length; i++) {
    const globalIndex = startIndex + i;

    // 插入间距
    if (gaps[globalIndex]) {
      y += KEYFRAME_GAP;
    }

    const seg = segments[i];

    // 绘制图片
    ctx.drawImage(
      seg.bitmap,
      0,
      seg.cropY,
      seg.bitmap.width,
      seg.cropHeight,
      0,
      y,
      outputWidth,
      seg.scaledHeight
    );

    y += seg.scaledHeight;
  }

  return y;
}

/**
 * 渲染单个画布为 Blob
 */
async function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * 单图导出
 */
async function exportSingle(
  segments: ProcessedSegment[],
  gaps: boolean[],
  settings: ExportSettings,
  totalHeight: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = settings.outputWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d')!;

  // 填充背景色
  ctx.fillStyle = settings.gapColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制所有图片段
  drawSegmentsOnCanvas(ctx, segments, gaps, 0, settings.outputWidth);

  // 添加水印
  if (settings.watermark) {
    drawWatermark(ctx, settings.watermark, canvas.width, canvas.height);
  }

  return canvasToBlob(canvas, EXPORT_QUALITY);
}

/**
 * 分段导出
 */
async function exportInSegments(
  segments: ProcessedSegment[],
  gaps: boolean[],
  settings: ExportSettings
): Promise<Blob[]> {
  const maxHeight = getSegmentMaxHeight(settings.outputWidth);
  const blobs: Blob[] = [];

  let currentSegments: ProcessedSegment[] = [];
  let currentStartIndex = 0;
  let currentHeight = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const gapHeight = gaps[i] ? KEYFRAME_GAP : 0;
    const neededHeight = seg.scaledHeight + gapHeight;

    // 检查是否需要新建分段
    if (currentHeight + neededHeight > maxHeight && currentSegments.length > 0) {
      // 渲染当前分段
      const canvas = document.createElement('canvas');
      canvas.width = settings.outputWidth;
      canvas.height = currentHeight;

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = settings.gapColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawSegmentsOnCanvas(
        ctx,
        currentSegments,
        gaps,
        currentStartIndex,
        settings.outputWidth
      );

      const blob = await canvasToBlob(canvas, EXPORT_QUALITY);
      blobs.push(blob);

      // 重置状态
      currentSegments = [];
      currentStartIndex = i;
      currentHeight = 0;
    }

    currentSegments.push(seg);
    currentHeight += neededHeight;
  }

  // 渲染最后一个分段
  if (currentSegments.length > 0) {
    const canvas = document.createElement('canvas');
    canvas.width = settings.outputWidth;
    canvas.height = currentHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = settings.gapColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSegmentsOnCanvas(
      ctx,
      currentSegments,
      gaps,
      currentStartIndex,
      settings.outputWidth
    );

    // 水印只添加在最后一段
    if (settings.watermark) {
      drawWatermark(ctx, settings.watermark, canvas.width, canvas.height);
    }

    const blob = await canvasToBlob(canvas, EXPORT_QUALITY);
    blobs.push(blob);
  }

  return blobs;
}

/**
 * 主导出函数
 */
export async function composeImages(
  images: ImageItem[],
  globalCrop: GlobalCropSettings,
  settings: ExportSettings,
  onProgress?: (percent: number, stage: string) => void
): Promise<Blob[]> {
  if (images.length === 0) {
    throw new Error('No images to export');
  }

  // 验证第一张是 Keyframe
  if (images[0].type !== 'keyframe') {
    throw new Error('First image must be a keyframe');
  }

  onProgress?.(0, 'Processing images...');

  // 处理所有图片
  const segments: ProcessedSegment[] = [];
  for (let i = 0; i < images.length; i++) {
    const segment = await processImage(images[i], globalCrop, settings.outputWidth);
    segments.push(segment);
    onProgress?.(Math.round(((i + 1) / images.length) * 50), 'Processing images...');
  }

  // 计算间距
  const gaps = settings.enableGap ? calculateGaps(images) : images.map(() => false);

  // 计算总高度
  let totalHeight = segments.reduce((h, seg) => h + seg.scaledHeight, 0);
  totalHeight += gaps.filter(Boolean).length * KEYFRAME_GAP;

  onProgress?.(60, 'Composing...');

  // 风险评估
  const risk = assessRisk(totalHeight, settings.outputWidth);

  let blobs: Blob[];

  if (risk === 'high') {
    onProgress?.(70, 'Exporting in segments...');
    blobs = await exportInSegments(segments, gaps, settings);
  } else {
    onProgress?.(70, 'Exporting...');
    const blob = await exportSingle(segments, gaps, settings, totalHeight);
    blobs = [blob];
  }

  // 清理 bitmap
  for (const seg of segments) {
    seg.bitmap.close();
  }

  onProgress?.(100, 'Done!');

  return blobs;
}
