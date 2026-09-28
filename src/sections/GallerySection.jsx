import Gallery from '../components/Gallery.jsx'
import { barberia } from '../data/barberia.js'
import './GallerySection.css'

function GallerySection() {
  return (
    <section
      aria-labelledby="gallery-title"
      className="gallery-section"
      id="galeria"
    >
      <div className="gallery-section__inner">
        <header className="gallery-section__header">
          <p className="gallery-section__eyebrow">REFERENCIAS</p>
          <h2 className="gallery-section__title" id="gallery-title">
            REFERENCIAS DE ESTILO.
          </h2>
          <p className="gallery-section__description">
            Imágenes de referencia para definir el estilo visual de UNDER 23.
          </p>
        </header>

        <Gallery images={barberia.gallery} />
      </div>
    </section>
  )
}

export default GallerySection
