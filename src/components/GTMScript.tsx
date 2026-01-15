import { useEffect } from 'react'

const GTM_ID = 'GTM-WMJSMTWF'

/**
 * Google Tag Manager script - only loads in production
 */
export function GTMScript() {
  useEffect(() => {
    // Only load in production
    if (import.meta.env.VITE_ENV !== 'production') {
      console.log('[GTM] Disabled - not in production environment')
      return
    }

    // Check if GTM already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtm.js"]`)) {
      return
    }

    // GTM script
    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `
    document.head.appendChild(script)

    console.log('[GTM] Loaded for production environment')
  }, [])

  return null
}
