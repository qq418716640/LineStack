import type { OutputWidth, BackgroundColor, CropParams, ExportSettings, GlobalCropSettings } from '../types';

/** 最大图片数量 */
export const MAX_IMAGES = 30;

/** 输出宽度选项 */
export const OUTPUT_WIDTHS: OutputWidth[] = [720, 1080];

/** 默认输出宽度 */
export const DEFAULT_OUTPUT_WIDTH: OutputWidth = 720;

/** 背景颜色选项 */
export const BACKGROUND_COLORS: { value: BackgroundColor; label: string }[] = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#333333', label: 'Dark Gray' },
];

/** 默认背景颜色 */
export const DEFAULT_BACKGROUND_COLOR: BackgroundColor = '#FFFFFF';

/** 关键帧间距（像素） */
export const KEYFRAME_GAP = 8;

/** 水印最大长度 */
export const WATERMARK_MAX_LENGTH = 20;

/** JPG 导出质量 */
export const EXPORT_QUALITY = 0.9;

/** 风险阈值配置 */
export const RISK_THRESHOLDS: Record<OutputWidth, { low: number; medium: number }> = {
  720: { low: 20000, medium: 35000 },
  1080: { low: 14000, medium: 25000 },
};

/** 分段最大高度 */
export const SEGMENT_MAX_HEIGHT: Record<OutputWidth, number> = {
  720: 18000,
  1080: 12000,
};

/** 默认裁切参数（保留底部 20%） */
export const DEFAULT_CROP_PARAMS: CropParams = {
  method: 'bottom_ratio',
  bottomPercent: 20,
};

/** 默认全局裁切设置 */
export const DEFAULT_GLOBAL_CROP: GlobalCropSettings = {
  enabled: true,
  params: DEFAULT_CROP_PARAMS,
};

/** 默认导出设置 */
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  outputWidth: DEFAULT_OUTPUT_WIDTH,
  enableGap: false,
  gapColor: DEFAULT_BACKGROUND_COLOR,
  watermark: '',
};

/** 水印样式配置 */
export const WATERMARK_CONFIG = {
  /** 距右边距 */
  paddingRight: 16,
  /** 距底边距 */
  paddingBottom: 16,
  /** 字体大小比例（相对于画布宽度） */
  fontSizeRatio: 0.02,
  /** 最小字体大小 */
  minFontSize: 14,
  /** 字体透明度 */
  opacity: 0.6,
  /** 阴影模糊 */
  shadowBlur: 4,
};

/** 支持的图片类型 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

/** 文件扩展名 */
export const SUPPORTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.gif';
