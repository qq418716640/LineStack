import './WhatIs.css'

export function WhatIs() {
  return (
    <section className="what-is">
      <div className="what-is__container">
        <h2 className="what-is__title">What is a Vertical Movie Screenshot Stitcher?</h2>

        <div className="what-is__content">
          <p className="what-is__paragraph what-is__paragraph--lead">
            A <strong>vertical movie screenshot stitcher</strong> is a specialized tool designed to combine
            multiple screenshots from movies and TV shows into a single, continuous vertical image. Unlike
            generic image collage tools, it focuses on <strong>preserving subtitles</strong> and maintaining
            the <strong>cinematic sequence</strong> of scenes.
          </p>

          <p className="what-is__paragraph">
            When you capture dialogue moments from your favorite films or series, each screenshot typically
            includes a visual scene at the top and subtitle text at the bottom. LineStack intelligently
            crops and arranges these screenshots so that the visual narrative flows naturally while keeping
            every subtitle readable — creating a scroll-friendly format perfect for social media sharing.
          </p>

          <p className="what-is__paragraph">
            This approach differs fundamentally from horizontal collages or grid layouts. Vertical stitching
            preserves the <strong>linear storytelling rhythm</strong> of cinema, allowing viewers to follow
            the dialogue sequence from top to bottom, just as they would experience it in the original film.
          </p>
        </div>
      </div>
    </section>
  )
}
