# LineStack 技术实现方案

> 基于 LineStack_Product_Spec_v1.2.md 规格说明的代码实现方案
> 编写日期：2026-01-08

---

## 1. 需求理解

### 1.1 产品定位

**LineStack** 是一款面向影视爱好者与内容创作者的轻量工具，用于将影视剧对话截图整理、裁切并拼接为适合社交平台传播的纵向长图。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| 纯前端处理 | 浏览器本地完成，不上传图片 |
| 移动端优先 | 主要使用场景为手机 |
| 图片类型 | Keyframe（关键帧）/ Subtitle-only（仅台词） |
| 输出格式 | JPG，宽度 720/1080px |

### 1.3 样例素材分析

查看了 `LineStack/样例图片/` 中的 8 张电影《盗梦空间》截图：

- **尺寸特点**：宽高比约 2.5:1（电影宽银幕比例）
- **字幕位置**：底部约 15-20% 区域
- **字幕样式**：中英双语字幕
- **水印**：右上角爱奇艺 logo

这类截图是典型的影视剧对话场景，用户希望：
1. 第一张保留完整画面（Keyframe）作为引导
2. 后续仅保留字幕区域（Subtitle-only）形成对话流

---

## 2. 技术栈选择

```
前端框架：React 18 + TypeScript
构建工具：Vite
样式方案：Tailwind CSS（移动端优先的响应式设计）
拖拽排序：@dnd-kit/core（轻量、触摸友好、无障碍支持）
状态管理：Zustand（轻量、简洁）
图片处理：Canvas API（原生浏览器能力）
```

### 2.1 技术选型理由

| 技术 | 选择理由 |
|------|----------|
| React + TS | 组件化开发，类型安全，生态丰富 |
| Vite | 快速开发体验，优秀的生产构建 |
| Tailwind | 移动端优先，无需写 CSS 文件 |
| @dnd-kit | 比 react-dnd 更轻量，触摸支持更好 |
| Zustand | 比 Redux 简单，比 Context 性能好 |
| Canvas API | 原生支持，无需额外依赖 |

---

## 3. 项目结构

```
linestack/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx                    # 入口文件
    ├── App.tsx                     # 主应用组件
    ├── index.css                   # 全局样式 + Tailwind
    │
    ├── components/
    │   ├── Header/
    │   │   └── Header.tsx          # 顶部标题栏
    │   │
    │   ├── ImageUploader/
    │   │   └── ImageUploader.tsx   # 图片上传组件
    │   │
    │   ├── ImageList/
    │   │   ├── ImageList.tsx       # 图片列表容器（拖拽上下文）
    │   │   └── SortableItem.tsx    # 可拖拽项包装器
    │   │
    │   ├── ImageCard/
    │   │   └── ImageCard.tsx       # 单张图片卡片（缩略图+操作）
    │   │
    │   ├── CropEditor/
    │   │   ├── CropEditor.tsx      # 裁切编辑器弹窗
    │   │   ├── CropOverlay.tsx     # 裁切框可视化
    │   │   └── QuickCropInput.tsx  # 快捷裁切输入
    │   │
    │   ├── SettingsPanel/
    │   │   └── SettingsPanel.tsx   # 设置面板
    │   │
    │   ├── WatermarkInput/
    │   │   └── WatermarkInput.tsx  # 水印输入组件
    │   │
    │   ├── ExportButton/
    │   │   └── ExportButton.tsx    # 导出按钮（含风险提示）
    │   │
    │   └── RiskIndicator/
    │       └── RiskIndicator.tsx   # 风险等级指示器
    │
    ├── hooks/
    │   ├── useImageStore.ts        # 图片列表状态管理
    │   ├── useSettingsStore.ts     # 导出设置状态管理
    │   ├── useCropEditor.ts        # 裁切编辑器逻辑
    │   └── useExport.ts            # 导出处理逻辑
    │
    ├── utils/
    │   ├── imageProcessor.ts       # 图片裁切/缩放工具
    │   ├── canvasComposer.ts       # 画布拼接逻辑
    │   ├── riskCalculator.ts       # 风险评估计算
    │   ├── segmentExporter.ts      # 分段导出逻辑
    │   └── download.ts             # 文件下载工具
    │
    ├── types/
    │   └── index.ts                # TypeScript 类型定义
    │
    └── constants/
        └── index.ts                # 常量定义（阈值、默认值等）
```

---

## 4. 核心数据结构

### 4.1 类型定义

```typescript
// types/index.ts

/** 图片类型 */
export type ImageType = 'keyframe' | 'subtitle';

/** 裁切模式 */
export type CropMode = 'global' | 'custom';

/** 裁切方式 */
export type CropMethod = 'drag' | 'bottom_ratio';

/** 裁切参数 */
export interface CropParams {
  method: CropMethod;
  // 拖拽模式参数（相对比例 0-1）
  topRatio?: number;
  heightRatio?: number;
  // 快捷裁切参数（百分比 0-100）
  bottomPercent?: number;
}

/** 单张图片数据 */
export interface ImageItem {
  id: string;                      // 唯一标识
  file: File;                      // 原始文件
  url: string;                     // Object URL（用于预览）
  originalWidth: number;           // 原始宽度
  originalHeight: number;          // 原始高度
  type: ImageType;                 // 图片类型
  cropMode: CropMode;              // 裁切模式
  customCrop?: CropParams;         // 自定义裁切参数
}

/** 输出宽度 */
export type OutputWidth = 720 | 1080;

/** 背景颜色 */
export type BackgroundColor = '#FFFFFF' | '#000000' | '#333333';

/** 导出设置 */
export interface ExportSettings {
  outputWidth: OutputWidth;
  enableGap: boolean;
  gapColor: BackgroundColor;
  watermark: string;
}

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high';

/** 全局裁切设置 */
export interface GlobalCropSettings {
  enabled: boolean;
  params: CropParams;
}
```

### 4.2 状态管理

```typescript
// hooks/useImageStore.ts (Zustand)

interface ImageStore {
  // 状态
  images: ImageItem[];
  globalCrop: GlobalCropSettings;

  // 操作
  addImages: (files: FileList) => Promise<void>;
  removeImage: (id: string) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  moveToTop: (id: string) => void;
  setImageType: (id: string, type: ImageType) => void;
  setImageCropMode: (id: string, mode: CropMode) => void;
  setImageCustomCrop: (id: string, crop: CropParams) => void;
  setGlobalCrop: (params: CropParams) => void;
  clearAll: () => void;
}
```

```typescript
// hooks/useSettingsStore.ts (Zustand)

interface SettingsStore {
  // 状态
  settings: ExportSettings;

  // 操作
  setOutputWidth: (width: OutputWidth) => void;
  setEnableGap: (enabled: boolean) => void;
  setGapColor: (color: BackgroundColor) => void;
  setWatermark: (text: string) => void;
}
```

---

## 5. 核心功能实现

### 5.1 图片上传与初始化

```typescript
// 实现要点：
// 1. 限制最大30张
// 2. 读取图片尺寸
// 3. 第一张强制 Keyframe
// 4. 后续默认 Subtitle-only

async function addImages(files: FileList) {
  const currentCount = get().images.length;
  const maxAdd = 30 - currentCount;

  if (maxAdd <= 0) {
    alert('Maximum 30 images allowed');
    return;
  }

  const filesToAdd = Array.from(files).slice(0, maxAdd);

  const newImages: ImageItem[] = await Promise.all(
    filesToAdd.map(async (file, index) => {
      const url = URL.createObjectURL(file);
      const { width, height } = await getImageDimensions(url);
      const isFirst = currentCount === 0 && index === 0;

      return {
        id: generateId(),
        file,
        url,
        originalWidth: width,
        originalHeight: height,
        type: isFirst ? 'keyframe' : 'subtitle',
        cropMode: 'global',
      };
    })
  );

  set(state => ({ images: [...state.images, ...newImages] }));
}
```

### 5.2 拖拽排序与第一张锁定

```typescript
// 实现要点：
// 1. 使用 @dnd-kit 实现拖拽
// 2. 排序后，第一张自动变为 Keyframe（锁定）
// 3. 原来第一张如果被移走，变为可编辑

function reorderImages(fromIndex: number, toIndex: number) {
  set(state => {
    const newImages = arrayMove([...state.images], fromIndex, toIndex);

    // 第一张强制 Keyframe
    if (newImages.length > 0) {
      newImages[0] = { ...newImages[0], type: 'keyframe' };
    }

    return { images: newImages };
  });
}
```

### 5.3 裁切编辑器

```typescript
// CropEditor 组件实现要点：
// 1. 显示原图预览
// 2. 可拖拽裁切框（横向100%，纵向可调）
// 3. 快捷输入框（底部x%）
// 4. "Apply to all" 复选框
// 5. 保存时更新全局或单张裁切参数

interface CropEditorProps {
  image: ImageItem;
  onSave: (crop: CropParams, applyToAll: boolean) => void;
  onClose: () => void;
}

// 裁切框状态
interface CropBoxState {
  topRatio: number;    // 0-1，框顶部位置
  heightRatio: number; // 0-1，框高度
}

// 转换为实际像素
function ratioToPixels(ratio: number, dimension: number): number {
  return Math.round(ratio * dimension);
}
```

### 5.4 导出拼接（核心逻辑）

```typescript
// utils/canvasComposer.ts

interface ProcessedSegment {
  bitmap: ImageBitmap;
  cropY: number;        // 裁切起始Y
  cropHeight: number;   // 裁切高度
  scaledHeight: number; // 缩放后高度
  isKeyframe: boolean;
}

async function composeImage(
  images: ImageItem[],
  globalCrop: GlobalCropSettings,
  settings: ExportSettings
): Promise<Blob[]> {

  // 1. 处理每张图片
  const segments: ProcessedSegment[] = await Promise.all(
    images.map(async (img) => {
      const bitmap = await createImageBitmap(img.file);
      const { cropY, cropHeight } = calculateCropArea(img, globalCrop, bitmap);
      const scaledHeight = (cropHeight / bitmap.width) * settings.outputWidth;

      return {
        bitmap,
        cropY,
        cropHeight,
        scaledHeight,
        isKeyframe: img.type === 'keyframe',
      };
    })
  );

  // 2. 计算间距
  const gaps = calculateGaps(images, settings.enableGap);
  const totalGapHeight = gaps.filter(Boolean).length * 8;

  // 3. 计算总高度
  const totalHeight = segments.reduce((h, s) => h + s.scaledHeight, 0) + totalGapHeight;

  // 4. 风险评估
  const risk = assessRisk(totalHeight, settings.outputWidth);

  // 5. 高风险时分段导出
  if (risk === 'high') {
    return exportInSegments(segments, gaps, settings);
  }

  // 6. 创建画布并绘制
  const canvas = document.createElement('canvas');
  canvas.width = settings.outputWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = settings.gapColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let y = 0;
  for (let i = 0; i < segments.length; i++) {
    // 插入间距
    if (gaps[i]) {
      y += 8;
    }

    const seg = segments[i];
    const sourceWidth = seg.bitmap.width;

    // 绘制图片段
    ctx.drawImage(
      seg.bitmap,
      0, seg.cropY, sourceWidth, seg.cropHeight,  // 源区域
      0, y, settings.outputWidth, seg.scaledHeight // 目标区域
    );

    y += seg.scaledHeight;
  }

  // 7. 添加水印
  if (settings.watermark) {
    drawWatermark(ctx, settings.watermark, canvas.width, canvas.height);
  }

  // 8. 导出 JPG
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve([blob!]),
      'image/jpeg',
      0.9
    );
  });
}
```

### 5.5 间距计算逻辑

```typescript
// 间距规则：仅在 Subtitle-only → Keyframe 边界插入 8px

function calculateGaps(images: ImageItem[], enableGap: boolean): boolean[] {
  if (!enableGap) return images.map(() => false);

  // 检查是否有 ≥2 个 Keyframe
  const keyframeCount = images.filter(img => img.type === 'keyframe').length;
  if (keyframeCount < 2) return images.map(() => false);

  return images.map((img, index) => {
    if (index === 0) return false; // 第一张前面不插入

    const prevImg = images[index - 1];
    // Subtitle-only → Keyframe 边界
    return prevImg.type === 'subtitle' && img.type === 'keyframe';
  });
}
```

### 5.6 风险评估与分段导出

```typescript
// utils/riskCalculator.ts

const RISK_THRESHOLDS = {
  720: { low: 20000, medium: 35000 },
  1080: { low: 14000, medium: 25000 },
};

const SEGMENT_MAX_HEIGHT = {
  720: 18000,
  1080: 12000,
};

function assessRisk(totalHeight: number, width: OutputWidth): RiskLevel {
  const thresholds = RISK_THRESHOLDS[width];

  if (totalHeight <= thresholds.low) return 'low';
  if (totalHeight <= thresholds.medium) return 'medium';
  return 'high';
}

// utils/segmentExporter.ts

async function exportInSegments(
  segments: ProcessedSegment[],
  gaps: boolean[],
  settings: ExportSettings
): Promise<Blob[]> {
  const maxHeight = SEGMENT_MAX_HEIGHT[settings.outputWidth];
  const blobs: Blob[] = [];

  let currentSegments: ProcessedSegment[] = [];
  let currentHeight = 0;
  let segmentIndex = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const gapHeight = gaps[i] ? 8 : 0;
    const neededHeight = seg.scaledHeight + gapHeight;

    // 检查是否需要新建分段
    if (currentHeight + neededHeight > maxHeight && currentSegments.length > 0) {
      // 导出当前分段
      const blob = await renderSegment(currentSegments, settings, segmentIndex);
      blobs.push(blob);
      segmentIndex++;

      currentSegments = [];
      currentHeight = 0;
    }

    currentSegments.push(seg);
    currentHeight += neededHeight;
  }

  // 导出最后一个分段
  if (currentSegments.length > 0) {
    const blob = await renderSegment(currentSegments, settings, segmentIndex);
    blobs.push(blob);
  }

  return blobs;
}
```

### 5.7 水印绘制

```typescript
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number
) {
  const fontSize = Math.max(14, canvasWidth * 0.02);

  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  // 添加阴影增强可读性
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillText(text, canvasWidth - 16, canvasHeight - 16);

  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}
```

---

## 6. UI 设计

### 6.1 整体布局（移动端优先）

```
┌─────────────────────────────────┐
│  LineStack                    ≡ │ ← Header
├─────────────────────────────────┤
│                                 │
│     ┌─────────────────────┐     │
│     │  + Upload Images    │     │ ← 上传区域
│     │    (tap to select)  │     │
│     └─────────────────────┘     │
│                                 │
├─────────────────────────────────┤
│  8 images · Risk: Low ●         │ ← 状态栏
├─────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │ ★ K   │ │   S   │ │   S   │  │
│ │ [img] │ │ [img] │ │ [img] │  │ ← 图片网格
│ │ ✂ ⋮  │ │ ✂ ⋮  │ │ ✂ ⋮  │  │   (可拖拽排序)
│ └───────┘ └───────┘ └───────┘  │
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │   S   │ │   K   │ │   S   │  │
│ │ [img] │ │ [img] │ │ [img] │  │
│ │ ✂ ⋮  │ │ ✂ ⋮  │ │ ✂ ⋮  │  │
│ └───────┘ └───────┘ └───────┘  │
├─────────────────────────────────┤
│  Settings                    ▼  │ ← 设置区域
│  ┌─────────────────────────────┐│
│  │ Output Width               ││
│  │ [● 720px] [ 1080px]        ││
│  │                            ││
│  │ □ Enable keyframe gap      ││
│  │                            ││
│  │ Background (gap fill)      ││
│  │ [● White][Black][Gray]     ││
│  │                            ││
│  │ Watermark (max 20 chars)   ││
│  │ [_____________________]    ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │     Export Image           ││ ← 导出按钮
│  │     Estimated: ~2.1 MB     ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

### 6.2 图片卡片组件

```
┌─────────────────┐
│ ★ Keyframe   ⋮ │ ← 类型标签 + 更多菜单
│                 │
│   [缩略图]       │ ← 图片预览
│                 │
│ ✂ Edit crop     │ ← 裁切编辑按钮
└─────────────────┘

更多菜单选项：
- Move to Top（置顶）
- Set as Keyframe / Set as Subtitle（切换类型，第一张禁用）
- Remove（删除）
```

### 6.3 裁切编辑器弹窗

```
┌─────────────────────────────────┐
│  Edit Crop                   ✕  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │      [原图预览区域]          ││
│  │    ═══════════════════      ││ ← 可拖拽裁切框
│  │    ║  字幕区域预览  ║        ││   (横向100%固定)
│  │    ═══════════════════      ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Quick crop: Keep bottom [__]%  │ ← 快捷输入
│                                 │
│  ☑ Apply to all subtitle-only   │ ← 全局应用
│                                 │
│  [  Cancel  ]  [  Save  ]       │
└─────────────────────────────────┘
```

---

## 7. 关键交互流程

### 7.1 上传流程

```
用户点击上传 → 选择图片
     ↓
检查数量限制（≤30）
     ↓
逐张读取尺寸信息
     ↓
第一张设为 Keyframe，其余为 Subtitle-only
     ↓
显示图片网格
```

### 7.2 裁切流程

```
用户点击 "Edit crop"
     ↓
打开裁切编辑器（显示当前裁切参数）
     ↓
拖拽调整裁切框 或 输入底部百分比
     ↓
选择是否 "Apply to all"
     ↓
保存 → 更新全局/单张裁切参数
```

### 7.3 导出流程

```
用户点击 "Export Image"
     ↓
校验：图片数量、第一张为Keyframe
     ↓
逐张处理：裁切 → 缩放
     ↓
计算总高度 → 风险评估
     ↓
Low/Medium: 单图导出
High: 自动分段导出
     ↓
创建画布 → 拼接 → 添加水印
     ↓
导出 JPG → 触发下载
```

---

## 8. 性能优化策略

### 8.1 图片处理优化

1. **懒加载缩略图**：网格中显示压缩后的缩略图，原图仅在导出时加载
2. **逐张处理**：导出时逐张解码图片，避免内存峰值
3. **Object URL 管理**：及时 revoke 不再使用的 URL

### 8.2 移动端适配

1. **触摸友好**：拖拽区域足够大，支持长按触发
2. **手势支持**：裁切框支持触摸拖拽
3. **内存控制**：监控内存使用，必要时降低处理质量

### 8.3 Canvas 优化

1. **离屏 Canvas**：避免频繁重绘
2. **分批绘制**：大量图片时分批处理
3. **质量参数**：JPG 质量默认 0.9，可根据输出大小调整

---

## 9. 依赖清单

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## 10. 开发计划

### Phase 1: 基础框架
- 项目初始化（Vite + React + TS + Tailwind）
- 基础布局组件
- 图片上传功能

### Phase 2: 核心功能
- 图片列表与拖拽排序
- 图片类型切换
- 裁切编辑器

### Phase 3: 导出功能
- 画布拼接逻辑
- 风险评估
- 分段导出

### Phase 4: 完善与优化
- 水印功能
- 设置面板
- 移动端适配优化
- 性能优化

---

## 11. 注意事项

1. **第一张锁定**：UI 上明确禁用第一张的类型切换
2. **内存管理**：移动端浏览器内存有限，需要监控和优化
3. **兼容性**：测试主流移动端浏览器（Safari、Chrome）
4. **错误处理**：图片加载失败、Canvas 创建失败等异常处理
5. **用户体验**：导出过程添加进度提示

---

> 文档版本：v1.0
> 对应产品规格：LineStack_Product_Spec_v1.2
