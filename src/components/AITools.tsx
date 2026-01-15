import { forwardRef } from 'react'
import './AITools.css'

// Placeholder AI tools - replace with actual data
// See ASSETS_GUIDE.md for replacement instructions
const tools = [
  {
    id: 'tool-1',
    image: '/ai-tools/tool-1.webp',
    title: 'Remove People from Photos',
    description: 'Remove unwanted people from photos with AI automatically, no manual editing needed.',
    link: 'https://www.ailogocreator.io/ai-tools/remove-people-from-photos',
    hasImage: true,
  },
  {
    id: 'tool-2',
    image: '/ai-tools/tool-2.webp',
    title: 'Watermark Remover',
    description: 'Remove watermarks from photos with AI.',
    link: 'https://www.ailogocreator.io/ai-tools/watermark-remover',
    hasImage: true,
  },
  {
    id: 'tool-3',
    image: '/ai-tools/tool-3.webp',
    title: 'Background Removal (Cutout)',
    description: 'Remove photo background to transparent or plain background.',
    link: 'https://www.ailogocreator.io/ai-tools/cutout',
    hasImage: true,
  },
  {
    id: 'tool-4',
    image: '/ai-tools/tool-4.webp',
    title: 'White Background Tool',
    description: 'Change photo background to pure white for e-commerce or clean display.',
    link: 'https://www.ailogocreator.io/ai-tools/white-background',
    hasImage: true,
  },
  {
    id: 'tool-5',
    image: '/ai-tools/tool-5.webp',
    title: 'Christmas Polaroid Photo',
    description: 'Turn any photo into festive holiday Polaroid style prints.',
    link: 'https://www.ailogocreator.io/ai-tools/christmas-polaroid-photo',
    hasImage: true,
  },
  {
    id: 'tool-6',
    image: '/ai-tools/tool-6.webp',
    title: 'Christmas Sweater Photo',
    description: 'Add a festive sweater effect to photos for holiday themes.',
    link: 'https://www.ailogocreator.io/ai-tools/christmas-sweater-photo',
    hasImage: true,
  },
  {
    id: 'tool-7',
    image: '/ai-tools/tool-7.webp',
    title: 'Add Santa Hat to Photo',
    description: 'Add a Santa hat overlay to photos instantly with AI.',
    link: 'https://www.ailogocreator.io/ai-tools/add-santa-hat-to-photo',
    hasImage: true,
  },
  {
    id: 'tool-8',
    image: '/ai-tools/tool-8.webp',
    title: 'Add Santa to Photo',
    description: 'Add Santa Claus character to a photo for a festive look.',
    link: 'https://www.ailogocreator.io/ai-tools/add-santa-to-photo',
    hasImage: true,
  },
]

export const AITools = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section className="ai-tools" ref={ref}>
      <div className="ai-tools__container">
        <h2 className="ai-tools__title">More Free AI Tools & Inspirations</h2>
        <p className="ai-tools__subtitle">
          Explore trending inspirations and prompts to spark creativity.
        </p>
        <div className="ai-tools__grid">
          {tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.link}
              className="ai-tool-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ai-tool-card__image">
                {tool.hasImage ? (
                  <img src={tool.image} alt={tool.title} />
                ) : (
                  <div className="ai-tool-card__placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span>Coming Soon</span>
                  </div>
                )}
              </div>
              <div className="ai-tool-card__info">
                <h3 className="ai-tool-card__title">{tool.title}</h3>
                <p className="ai-tool-card__description">{tool.description}</p>
                <span className="ai-tool-card__link">Explore →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
})

AITools.displayName = 'AITools'
