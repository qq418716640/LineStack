import { forwardRef } from 'react'
import { ImageUpload } from './ImageUpload'
import { ImageList } from './ImageList'
import { BottomKeepBar } from './BottomKeepBar'
import { ExportSettings } from './ExportSettings'
import { ExportButton } from './ExportButton'
import './ToolSection.css'

export const ToolSection = forwardRef<HTMLElement>((_props, ref) => {
  return (
    <section className="tool-section" ref={ref}>
      <div className="tool-section__container">
        <div className="tool-section__header">
          <h2 className="tool-section__title">
            Free Dialogue Screenshot Stitcher (No Sign-Up)
          </h2>
          <div className="tool-section__hints">
            <span>Max 30 images</span>
            <span>Export JPG</span>
            <span>Default width: 720</span>
          </div>
        </div>

        <div className="tool-section__content">
          <div className="tool-section__left">
            <ImageUpload />
            <ImageList />
            <BottomKeepBar />
          </div>
          <div className="tool-section__right">
            <ExportSettings />
            <ExportButton />
          </div>
        </div>
      </div>
    </section>
  )
})

ToolSection.displayName = 'ToolSection'
