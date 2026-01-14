import { forwardRef } from 'react'
import './GoPro.css'

export const GoPro = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section className="go-pro" ref={ref}>
      <div className="go-pro__container">
        <h2 className="go-pro__title">Go Pro (Optional)</h2>
        <p className="go-pro__text">
          LineStack is free forever.
          <br />
          Go Pro is for creators who want advanced features and workflows.
        </p>
        <button className="go-pro__btn" disabled>
          Coming Soon
        </button>
      </div>
    </section>
  )
})

GoPro.displayName = 'GoPro'
