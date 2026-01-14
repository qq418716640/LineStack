# LineStack · 开发执行文档（Implementation Guide）

> **Version:** v1.3  
> **Based on:** Product Spec v1.4 (Frozen)  
> **Scope:** Pure Frontend · Local Processing · Mobile-first  
>  
> 本文档用于指导前端工程师 **直接落地实现 LineStack v1**，无需再回看 PRD。

---

## 0. 技术与实现边界

### 0.1 技术定位
- 运行环境：现代浏览器（Chrome / Safari / Mobile WebView）
- 架构：纯前端（无后端、无登录）
- 图片处理：浏览器本地（Canvas / OffscreenCanvas / ImageBitmap）
- 导出格式：JPG

### 0.2 v1 明确不做
- 实时拼接预览
- 单张图片裁切覆盖（per-image override）
- 云端导出 / 云端存储
- 用户系统

---

## 1. 页面与模块结构

### 1.1 页面模块
1. Upload Section  
2. Image List & Ordering Panel  
3. Global Subtitle Crop (Bottom Keep Bar)  
4. Export Settings  
5. Export Action & Status

---

## 2. 核心数据模型

### 2.1 ImageItem

```ts
type ImageItem = {
  id: string
  file: File
  type: 'keyframe' | 'subtitle'
  manualKeyframe: boolean
}
```

- `manualKeyframe = true`：用户手动标记
- 位置锁定产生的 keyframe **不得**设置为 true

---

### 2.2 GlobalSettings

```ts
type GlobalSettings = {
  outputWidth: 720 | 1080          // default: 720
  enableKeyframeGap: boolean       // default: false
  gapSize: number                  // fixed: 8
  backgroundColor: '#FFFFFF' | '#000000' | '#333333'
  bottomKeepRatio: number          // default: 0.2
  watermarkText: string            // auto-trim to 20 chars
  jpgQuality: number               // default: 0.9
}
```

---

## 3. 上传与初始化

- 最大图片数：30（硬限制）
- 初始化规则：
  - index=0 → keyframe
  - 其余 → subtitle
  - manualKeyframe 均为 false

---

## 4. 排序、置顶与关键帧回退（重点）

### 4.1 排序
- 拖拽即更新数组
- Move to Top = 移动到 index=0

### 4.2 第一张 keyframe 回退规则

1. 当前 index=0：强制 keyframe
2. 原 index=0 若离开：
   - manualKeyframe=false → 回退 subtitle
   - manualKeyframe=true → 保持 keyframe

⚠️ 不得误回退用户手动 keyframe。

---

## 5. Bottom Keep Bar（全局裁切）

- 控制 subtitle 保留底部比例
- UI 不显示百分比
- 默认 bottomKeepRatio = 0.2
- 建议限制范围：0.1 ~ 0.8

裁切公式：
- cropTop = H * (1 - bottomKeepRatio)
- cropHeight = H * bottomKeepRatio

---

## 6. 导出设置

- Width：720（default）/ 1080
- Keyframe Gap：8px（subtitle → keyframe，且 keyframe ≥ 2）
- Background Color：仅 gap 开启时可选
- Watermark：右下角，≤20 字，超出自动截断

---

## 7. 导出流程

1. 校验数量
2. 逐张解码
3. subtitle 裁切
4. 缩放至目标宽度
5. 拼接（含 gap）
6. 绘制 watermark
7. 导出 JPG（quality=0.9）

---

## 8. 自动分段导出

| Width | Max Height |
|------|------------|
| 720  | 18,000 px |
| 1080 | 12,000 px |

- 超出阈值自动分段
- 不拆单张图片
- 文件名：linestack_01.jpg …

---

## 9. 测试 Checklist

- [ ] 30 张图片导出
- [ ] 排序触发 keyframe 回退
- [ ] Bottom Keep Bar 生效
- [ ] watermark 自动截断
- [ ] 自动分段导出

---

> **LineStack**  
> Stack dialogue screenshots into a clean vertical story.  
> Implementation Guide v1.3
