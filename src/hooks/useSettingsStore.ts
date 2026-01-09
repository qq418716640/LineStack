import { create } from 'zustand';
import type { ExportSettings, OutputWidth, BackgroundColor } from '../types';
import { DEFAULT_EXPORT_SETTINGS, WATERMARK_MAX_LENGTH } from '../constants';

interface SettingsStore {
  /** 导出设置 */
  settings: ExportSettings;

  /** 设置输出宽度 */
  setOutputWidth: (width: OutputWidth) => void;
  /** 设置是否启用间距 */
  setEnableGap: (enabled: boolean) => void;
  /** 设置间距颜色 */
  setGapColor: (color: BackgroundColor) => void;
  /** 设置水印文本 */
  setWatermark: (text: string) => void;
  /** 重置设置 */
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: DEFAULT_EXPORT_SETTINGS,

  setOutputWidth: (width) => {
    set((state) => ({
      settings: { ...state.settings, outputWidth: width },
    }));
  },

  setEnableGap: (enabled) => {
    set((state) => ({
      settings: { ...state.settings, enableGap: enabled },
    }));
  },

  setGapColor: (color) => {
    set((state) => ({
      settings: { ...state.settings, gapColor: color },
    }));
  },

  setWatermark: (text) => {
    // 限制最大长度
    const trimmed = text.slice(0, WATERMARK_MAX_LENGTH);
    set((state) => ({
      settings: { ...state.settings, watermark: trimmed },
    }));
  },

  resetSettings: () => {
    set({ settings: DEFAULT_EXPORT_SETTINGS });
  },
}));
