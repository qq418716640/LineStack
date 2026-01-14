import './AITools.css'

// Placeholder AI tools - replace with actual data
// See ASSETS_GUIDE.md for replacement instructions
const tools = [
  {
    id: 'tool-1',
    image: '/ai-tools/tool-1.jpg',
    title: 'AI Logo Creator',
    description: 'Create stunning logos with AI in seconds',
    link: '#',
  },
  {
    id: 'tool-2',
    image: '/ai-tools/tool-2.jpg',
    title: 'AI Background Remover',
    description: 'Remove backgrounds from images instantly',
    link: '#',
  },
  {
    id: 'tool-3',
    image: '/ai-tools/tool-3.jpg',
    title: 'AI Image Upscaler',
    description: 'Enhance image resolution with AI',
    link: '#',
  },
  {
    id: 'tool-4',
    image: '/ai-tools/tool-4.jpg',
    title: 'AI Art Generator',
    description: 'Generate unique art from text prompts',
    link: '#',
  },
  {
    id: 'tool-5',
    image: '/ai-tools/tool-5.jpg',
    title: 'AI Photo Editor',
    description: 'Edit photos with intelligent AI tools',
    link: '#',
  },
  {
    id: 'tool-6',
    image: '/ai-tools/tool-6.jpg',
    title: 'AI Color Palette',
    description: 'Generate beautiful color palettes',
    link: '#',
  },
  {
    id: 'tool-7',
    image: '/ai-tools/tool-7.jpg',
    title: 'AI Font Pairing',
    description: 'Find perfect font combinations',
    link: '#',
  },
  {
    id: 'tool-8',
    image: '/ai-tools/tool-8.jpg',
    title: 'AI Mockup Generator',
    description: 'Create product mockups easily',
    link: '#',
  },
]

export function AITools() {
  return (
    <section className="ai-tools">
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
                {/* Placeholder - replace with actual images */}
                <div className="ai-tool-card__placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                {/* Uncomment when images are ready:
                <img src={tool.image} alt={tool.title} />
                */}
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
}
