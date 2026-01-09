/** 图片类型 */
export type ImageType = 'keyframe' | 'subtitle';

/** 裁切模式：使用全局设置还是自定义 */
export type CropMode = 'global' | 'custom';

/** 裁切方式 */
export type CropMethod = 'drag' | 'bottom_ratio';

/** 裁切参数 */
export interface CropParams {
  method: CropMethod;
  /** 拖拽模式 - 裁切框顶部位置（相对比例 0-1） */
  topRatio?: number;
  /** 拖拽模式 - 裁切框高度（相对比例 0-1） */
  heightRatio?: number;
  /** 快捷裁切 - 保留底部百分比（0-100） */
  bottomPercent?: number;
}

/** 单张图片数据 */
export interface ImageItem {
  /** 唯一标识 */
  id: string;
  /** 原始文件 */
  file: File;
  /** Object URL（用于预览） */
  url: string;
  /** 原始宽度 */
  originalWidth: number;
  /** 原始高度 */
  originalHeight: number;
  /** 图片类型：关键帧或仅字幕 */
  type: ImageType;
  /** 裁切模式 */
  cropMode: CropMode;
  /** 自定义裁切参数（仅当 cropMode 为 custom 时使用） */
  customCrop?: CropParams;
}

/** 输出宽度 */
export type OutputWidth = 720 | 1080;

/** 背景颜色（用于间距填充） */
export type BackgroundColor = '#FFFFFF' | '#000000' | '#333333';

/** 导出设置 */
export interface ExportSettings {
  /** 输出宽度 */
  outputWidth: OutputWidth;
  /** 是否启用关键帧间距 */
  enableGap: boolean;
  /** 间距填充颜色 */
  gapColor: BackgroundColor;
  /** 水印文本 */
  watermark: string;
}

/** 全局裁切设置 */
export interface GlobalCropSettings {
  /** 是否已设置全局裁切 */
  enabled: boolean;
  /** 全局裁切参数 */
  params: CropParams;
}

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high';

/** 导出进度状态 */
export interface ExportProgress {
  /** 当前阶段 */
  stage: 'preparing' | 'processing' | 'composing' | 'exporting' | 'done';
  /** 当前处理的图片索引 */
  currentIndex: number;
  /** 总图片数 */
  totalCount: number;
  /** 进度百分比 0-100 */
  percent: number;
}

/** 处理后的图片段 */
export interface ProcessedSegment {
  /** 图片位图 */
  bitmap: ImageBitmap;
  /** 裁切起始 Y 坐标 */
  cropY: number;
  /** 裁切高度 */
  cropHeight: number;
  /** 缩放后的高度 */
  scaledHeight: number;
  /** 是否为关键帧 */
  isKeyframe: boolean;
  /** 原始图片 ID */
  imageId: string;
}
