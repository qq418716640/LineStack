// Umami Analytics Utilities
// https://umami.is/docs/track-events

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number>) => void
    }
  }
}

/**
 * Track a custom event with Umami
 * @param eventName - Name of the event (e.g., 'upload_images', 'export_start')
 * @param eventData - Optional data to attach to the event
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number>
): void {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData)
  }
}

// Pre-defined event tracking functions for type safety and consistency

/**
 * Track when user uploads images
 */
export function trackUploadImages(count: number): void {
  trackEvent('upload_images', { count })
}

/**
 * Track when user starts export
 */
export function trackExportStart(count: number, width: number): void {
  trackEvent('export_start', { count, width })
}

/**
 * Track successful export
 */
export function trackExportSuccess(files: number): void {
  trackEvent('export_success', { files })
}

/**
 * Track export error
 */
export function trackExportError(error: string): void {
  trackEvent('export_error', { error })
}

/**
 * Track keyframe toggle
 */
export function trackToggleKeyframe(): void {
  trackEvent('toggle_keyframe')
}

/**
 * Track crop adjustment
 */
export function trackAdjustCrop(): void {
  trackEvent('adjust_crop')
}

/**
 * Track settings change
 */
export function trackChangeSettings(setting: string): void {
  trackEvent('change_settings', { setting })
}

/**
 * Track navigation clicks
 */
export function trackNavClick(target: string): void {
  trackEvent('nav_click', { target })
}

/**
 * Track FAQ expansion
 */
export function trackFaqExpand(question: string): void {
  trackEvent('faq_expand', { question })
}
