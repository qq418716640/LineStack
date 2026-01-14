import { forwardRef } from 'react'
import './Examples.css'

// Placeholder examples - replace with actual images
// See ASSETS_GUIDE.md for replacement instructions
const examples = [
  {
    id: 'example-1',
    image: '/examples/example-1.jpg',
    title: 'Classic Dialogue',
    description: 'With keyframe · 720px',
  },
  {
    id: 'example-2',
    image: '/examples/example-2.jpg',
    title: 'Dark Theme',
    description: 'Dark gap · 1080px',
  },
  {
    id: 'example-3',
    image: '/examples/example-3.jpg',
    title: 'Movie Scene',
    description: 'Multiple keyframes · 720px',
  },
  {
    id: 'example-4',
    image: '/examples/example-4.jpg',
    title: 'TV Series',
    description: 'Subtitle only · 720px',
  },
  {
    id: 'example-5',
    image: '/examples/example-5.jpg',
    title: 'Long Conversation',
    description: 'Auto-split · 720px',
  },
  {
    id: 'example-6',
    image: '/examples/example-6.jpg',
    title: 'With Watermark',
    description: 'Custom watermark · 1080px',
  },
]

export const Examples = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section className="examples" ref={ref}>
      <div className="examples__container">
        <h2 className="examples__title">LineStack Examples</h2>
        <p className="examples__subtitle">
          See what you can create with LineStack
        </p>
        <div className="examples__grid">
          {examples.map((example) => (
            <div key={example.id} className="example-card">
              <div className="example-card__image">
                {/* Placeholder - replace with actual images */}
                <div className="example-card__placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span>Example Image</span>
                </div>
                {/* Uncomment when images are ready:
                <img src={example.image} alt={example.title} />
                */}
              </div>
              <div className="example-card__info">
                <h3 className="example-card__title">{example.title}</h3>
                <p className="example-card__description">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

Examples.displayName = 'Examples'
