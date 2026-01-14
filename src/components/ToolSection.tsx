import { forwardRef } from 'react'
import { useStore } from '../store/StoreContext'
import { ImageUpload } from './ImageUpload'
import { ImageList } from './ImageList'
import { ExportPanel } from './ExportPanel'
import './ToolSection.css'

export const ToolSection = forwardRef<HTMLElement>((_props, ref) => {
  const { images } = useStore()
  const hasImages = images.length > 0

  return (
    <section className="tool-section" ref={ref}>
      <div className="tool-section__container">
        <div className="tool-section__header">
          <h2 className="tool-section__title">
            Vertical Movie Screenshot Stitcher
          </h2>
          <p className="tool-section__subtitle">
            Upload your movie or TV screenshots, preserve subtitles, export as vertical story image
          </p>
        </div>

        <div className={`tool-section__content ${!hasImages ? 'tool-section__content--empty' : ''}`}>
          <div className={`tool-section__left ${!hasImages ? 'tool-section__left--centered' : ''}`}>
            <ImageUpload />
            {hasImages && <ImageList />}
          </div>
          <div className="tool-section__right">
            <ExportPanel disabled={!hasImages} />
          </div>
        </div>
      </div>
    </section>
  )
})

ToolSection.displayName = 'ToolSection'
