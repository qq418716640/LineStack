import type { OutputWidth, RiskLevel } from '../types';
import { RISK_THRESHOLDS, SEGMENT_MAX_HEIGHT } from '../constants';

/**
 * 评估导出风险等级
 */
export function assessRisk(totalHeight: number, outputWidth: OutputWidth): RiskLevel {
  const thresholds = RISK_THRESHOLDS[outputWidth];

  if (totalHeight <= thresholds.low) {
    return 'low';
  }

  if (totalHeight <= thresholds.medium) {
    return 'medium';
  }

  return 'high';
}

/**
 * 获取分段最大高度
 */
export function getSegmentMaxHeight(outputWidth: OutputWidth): number {
  return SEGMENT_MAX_HEIGHT[outputWidth];
}

/**
 * 计算需要分成几段
 */
export function calculateSegmentCount(
  totalHeight: number,
  outputWidth: OutputWidth
): number {
  const maxHeight = getSegmentMaxHeight(outputWidth);
  return Math.ceil(totalHeight / maxHeight);
}
