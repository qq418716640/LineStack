# LineStack 素材替换指南

本文档说明如何替换 LineStack 网站中的占位素材。

---

## 1. Examples Gallery（示例图库）

### 位置
- 文件：`src/components/Examples.tsx`
- 存放目录：`public/examples/`

### 需要准备的素材
6 张示例图片，展示 LineStack 的导出效果。

| 文件名 | 建议内容 | 尺寸建议 |
|--------|----------|----------|
| `example-1.jpg` | 经典对话拼接效果 | 720x960 或 3:4 比例 |
| `example-2.jpg` | 深色间距效果 | 720x960 或 3:4 比例 |
| `example-3.jpg` | 多关键帧效果 | 720x960 或 3:4 比例 |
| `example-4.jpg` | 纯字幕拼接效果 | 720x960 或 3:4 比例 |
| `example-5.jpg` | 长对话（分段导出）效果 | 720x960 或 3:4 比例 |
| `example-6.jpg` | 带水印效果 | 720x960 或 3:4 比例 |

### 替换步骤

1. 将准备好的图片放入 `public/examples/` 目录

2. 编辑 `src/components/Examples.tsx`，找到以下代码块：

```tsx
<div className="example-card__placeholder">
  ...
</div>
{/* Uncomment when images are ready:
<img src={example.image} alt={example.title} />
*/}
```

3. 替换为：

```tsx
<img src={example.image} alt={example.title} />
```

4. 修改 `examples` 数组中的标题和描述（可选）：

```tsx
const examples = [
  {
    id: 'example-1',
    image: '/examples/example-1.jpg',
    title: '你的标题',           // 修改这里
    description: '你的描述',     // 修改这里
  },
  // ...
]
```

---

## 2. AI Tools Inspirations（AI 工具推荐）

### 位置
- 文件：`src/components/AITools.tsx`
- 存放目录：`public/ai-tools/`

### 需要准备的素材
8 个 AI 工具的缩略图和信息。

| 文件名 | 说明 |
|--------|------|
| `tool-1.jpg` ~ `tool-8.jpg` | 工具缩略图，64x64 或 1:1 比例 |

### 替换步骤

1. 将准备好的图片放入 `public/ai-tools/` 目录

2. 编辑 `src/components/AITools.tsx`，修改 `tools` 数组：

```tsx
const tools = [
  {
    id: 'tool-1',
    image: '/ai-tools/tool-1.jpg',
    title: '工具名称',           // 修改
    description: '工具描述',     // 修改
    link: 'https://...',        // 修改为实际链接
  },
  // ...
]
```

3. 找到以下代码块：

```tsx
<div className="ai-tool-card__placeholder">
  ...
</div>
{/* Uncomment when images are ready:
<img src={tool.image} alt={tool.title} />
*/}
```

4. 替换为：

```tsx
<img src={tool.image} alt={tool.title} />
```

---

## 3. 目录结构

替换完成后，`public` 目录结构应如下：

```
public/
├── vite.svg
├── examples/
│   ├── example-1.jpg
│   ├── example-2.jpg
│   ├── example-3.jpg
│   ├── example-4.jpg
│   ├── example-5.jpg
│   └── example-6.jpg
└── ai-tools/
    ├── tool-1.jpg
    ├── tool-2.jpg
    ├── tool-3.jpg
    ├── tool-4.jpg
    ├── tool-5.jpg
    ├── tool-6.jpg
    ├── tool-7.jpg
    └── tool-8.jpg
```

---

## 4. 图片优化建议

- **格式**：使用 JPG 或 WebP，保持文件较小
- **尺寸**：
  - Examples: 建议 720px 宽，3:4 比例
  - AI Tools: 建议 128x128 或 256x256（会被缩放显示）
- **文件大小**：单张建议 < 200KB
- **压缩工具**：可使用 [TinyPNG](https://tinypng.com/) 或 [Squoosh](https://squoosh.app/)

---

## 5. 测试

替换完成后：

1. 运行 `npm run dev` 启动开发服务器
2. 检查图片是否正确显示
3. 运行 `npm run build` 确保构建成功
4. 提交并推送到 GitHub，等待 Vercel 自动部署

---

## 6. 注意事项

- 图片文件名必须与代码中的路径一致
- 确保图片已优化，避免影响页面加载速度
- 如果需要增加或减少示例数量，修改对应的数组即可
- AI Tools 的链接如果暂时没有，可以先保持 `#`

---

> **LineStack**
> Stack dialogue screenshots into a clean vertical story.
> Assets Replacement Guide
