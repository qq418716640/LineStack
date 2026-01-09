import { useImageStore } from '../../hooks/useImageStore';

export function Header() {
  const { images, clearAll } = useImageStore();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-primary"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <rect x="4" y="2" width="24" height="6" rx="1" />
            <rect x="4" y="10" width="24" height="4" rx="1" opacity="0.7" />
            <rect x="4" y="16" width="24" height="4" rx="1" opacity="0.7" />
            <rect x="4" y="22" width="24" height="4" rx="1" opacity="0.7" />
            <rect x="4" y="28" width="24" height="2" rx="1" opacity="0.5" />
          </svg>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">LineStack</h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Stack dialogue screenshots into a clean vertical story
            </p>
          </div>
        </div>

        {images.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
          >
            Clear All
          </button>
        )}
      </div>
    </header>
  );
}
