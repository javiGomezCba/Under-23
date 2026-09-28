import './Gallery.css'

function Gallery({ images }) {
  return (
    <div
      aria-label="Referencias visuales MOCK de UNDER 23. Desplazamiento horizontal."
      className="gallery"
      role="region"
      tabIndex={0}
    >
      <ul className="gallery__track">
        {images.map((image, index) => (
          <li className="gallery__item" key={image.id}>
            <figure className="gallery__figure">
              <img
                alt={image.alt}
                className="gallery__image"
                loading="lazy"
                src={image.src}
              />
              <figcaption className="gallery__caption">
                REFERENCIA MOCK · {String(index + 1).padStart(2, '0')}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Gallery
