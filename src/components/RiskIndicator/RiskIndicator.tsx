import type { RiskLevel } from '../../types';

interface RiskIndicatorProps {
  risk: RiskLevel;
  imageCount: number;
  estimatedHeight: number;
}

const RISK_CONFIG: Record<
  RiskLevel,
  { color: string; bgColor: string; label: string }
> = {
  low: {
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    label: 'Low',
  },
  medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    label: 'Medium',
  },
  high: {
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    label: 'High',
  },
};

export function RiskIndicator({
  risk,
  imageCount,
  estimatedHeight,
}: RiskIndicatorProps) {
  const config = RISK_CONFIG[risk];

  return (
    <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
      <span className="text-gray-600">
        {imageCount} image{imageCount !== 1 ? 's' : ''}
        {estimatedHeight > 0 && (
          <span className="text-gray-400 ml-2">
            ~{Math.round(estimatedHeight / 1000)}k px
          </span>
        )}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">Risk:</span>
        <span className={`font-medium ${config.color}`}>{config.label}</span>
        <span className={`w-2 h-2 rounded-full ${config.bgColor}`} />
      </div>
    </div>
  );
}
