import { useEffect } from 'react'

/**
 * Component that dynamically injects Umami analytics script
 * Only loads if VITE_UMAMI_WEBSITE_ID is set
 */
export function UmamiScript() {
  useEffect(() => {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
    const src = import.meta.env.VITE_UMAMI_SRC

    // Don't load if no website ID configured
    if (!websiteId || !src) {
      console.log('[Umami] Tracking disabled - no website ID configured')
      return
    }

    // Check if script already exists
    if (document.querySelector(`script[data-website-id="${websiteId}"]`)) {
      return
    }

    // Create and inject Umami script
    const script = document.createElement('script')
    script.defer = true
    script.src = src
    script.setAttribute('data-website-id', websiteId)

    document.head.appendChild(script)

    console.log(`[Umami] Tracking enabled for ${import.meta.env.VITE_ENV} environment`)

    // Cleanup on unmount (though this rarely happens for analytics)
    return () => {
      const existingScript = document.querySelector(`script[data-website-id="${websiteId}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}
