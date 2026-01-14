import { useState } from 'react'
import { trackFaqExpand } from '../utils/umami'
import './FAQ.css'

const faqs = [
  {
    question: 'What is a vertical movie screenshot stitcher?',
    answer:
      'A vertical movie screenshot stitcher is a specialized tool that combines multiple screenshots from movies and TV shows into a single, continuous vertical image. Unlike generic collage tools, it focuses on preserving subtitles and maintaining the cinematic sequence of scenes, creating a scroll-friendly format ideal for social media platforms.',
  },
  {
    question: 'Can I keep subtitles when stitching screenshots?',
    answer:
      'Yes, subtitle preservation is a core feature of LineStack. You can adjust the "subtitle crop" slider to control exactly how much of the subtitle area is kept in each screenshot. This ensures all dialogue text remains readable in your final vertical image.',
  },
  {
    question: 'How is LineStack different from collage or meme tools?',
    answer:
      'LineStack is purpose-built for linear cinematic storytelling, not for creating grid layouts or adding text overlays. It maintains the sequential flow of movie scenes with proper subtitle handling, whereas collage tools arrange images in grids and meme generators focus on adding custom text. LineStack preserves the original cinematic context.',
  },
  {
    question: 'Is LineStack free to use?',
    answer:
      'Yes, LineStack is completely free with no sign-up required, no hidden limits, and no watermark traps. It runs entirely in your browser, so your screenshots are never uploaded to any server.',
  },
  {
    question: 'What output formats does LineStack support?',
    answer:
      'LineStack exports high-quality JPG images optimized for social media sharing. You can choose between 720px width (ideal for faster loading) or 1080px width (for higher resolution). Long sequences are automatically split into multiple files to ensure stable exports.',
  },
  {
    question: 'Why use vertical format for movie screenshots?',
    answer:
      'Vertical format is optimized for mobile viewing and social media feeds. When you scroll through a vertical movie screenshot compilation, you experience the dialogue sequence naturally from top to bottom — just like reading subtitles in the original film. This format is thumb-friendly and works perfectly on platforms like Instagram Stories, TikTok, and Twitter.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    const isOpening = openIndex !== index
    setOpenIndex(isOpening ? index : null)
    if (isOpening) {
      trackFaqExpand(faqs[index].question)
    }
  }

  return (
    <section className="faq">
      <div className="faq__container">
        <h2 className="faq__title">Frequently Asked Questions</h2>
        <div className="faq__list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
            >
              <button className="faq__question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                <svg
                  className="faq__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="faq__answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
