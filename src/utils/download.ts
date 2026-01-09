/**
 * 下载 Blob 文件
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 批量下载多个 Blob
 */
export async function downloadBlobs(blobs: Blob[], baseFilename: string): Promise<void> {
  for (let i = 0; i < blobs.length; i++) {
    const filename = blobs.length === 1
      ? `${baseFilename}.jpg`
      : `${baseFilename}_${String(i + 1).padStart(2, '0')}.jpg`;

    downloadBlob(blobs[i], filename);

    // 如果有多个文件，添加小延迟避免浏览器阻止多次下载
    if (blobs.length > 1 && i < blobs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}
