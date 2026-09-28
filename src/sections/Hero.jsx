import Button from '../components/Button.jsx'

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero" id="inicio">
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">BARBERÍA · CÓRDOBA</p>
          <h1 className="hero__title" id="hero-title">
            <span>TU CORTE.</span>
            <span>TU ESTILO.</span>
            <span>TU LUGAR.</span>
          </h1>
          <p className="hero__description">
            Cortes, barba y estilo en UNDER 23.
          </p>
          <div className="hero__actions">
            <Button className="button--booking" href="#reservar">
              RESERVAR TURNO <span aria-hidden="true">→</span>
            </Button>
            <Button href="#galeria" variant="secondary">
              VER GALERÍA
            </Button>
          </div>
          <p className="hero__claim">NO ES SOLO UN CORTE.</p>
        </div>
      </div>
      <a
        aria-label="Desplazarse a la sección siguiente"
        className="hero__scroll"
        href="#galeria"
      >
        <span>SCROLL</span>
        <span aria-hidden="true" className="hero__scroll-mark">
          <span>↓</span>
        </span>
      </a>
    </section>
  )
}

export default Hero
