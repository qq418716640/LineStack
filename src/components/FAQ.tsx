import { useState } from 'react'
import './FAQ.css'

const faqs = [
  {
    question: 'Is LineStack really free?',
    answer:
      'Yes. LineStack is 100% free to use, with no sign-up, no paywalls, and no hidden limits.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. You can start using LineStack instantly without creating an account.',
  },
  {
    question: 'What does LineStack do?',
    answer:
      'LineStack stitches TV or movie dialogue screenshots into a single clean vertical story image for easy sharing.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer:
      'No. All processing runs locally in your browser. Your screenshots stay on your device.',
  },
  {
    question: 'What export formats and sizes are supported?',
    answer:
      'LineStack exports JPG images. You can choose 720px (default) or 1080px width.',
  },
  {
    question: 'Why did I get multiple output images?',
    answer:
      'Very long conversations may be automatically split into multiple JPG files to ensure stable exports on mobile devices.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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
