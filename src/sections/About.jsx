import { barberia } from '../data/barberia.js'
import './About.css'

function About() {
  const address = `${barberia.address}, ${barberia.location.city}, ${barberia.location.country}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <section aria-labelledby="about-title" className="about" id="about">
      <div className="about__inner">
        <div className="about__brand">
          <p className="about__eyebrow">{barberia.name}</p>
          <h2 className="about__title" id="about-title">
            UN LUGAR PARA
            <br />
            VOLVER.
          </h2>
          <div className="about__copy">
            <p>
              Como concepto de marca, {barberia.name} pone el foco en el corte,
              el estilo y disfrutar el momento.
            </p>
            <p>La idea: un espacio cercano, simple y sin vueltas.</p>
          </div>
        </div>

        <div
          aria-label="Información práctica"
          className="about__information"
          role="group"
        >
          <div className="about__item">
            <h3 className="about__label">UBICACIÓN</h3>
            <address className="about__value">
              <span>{barberia.address}</span>
              <span>
                {barberia.location.city}, {barberia.location.country}
              </span>
            </address>
            <a
              className="about__action"
              href={mapsUrl}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Cómo llegar a UNDER 23 en Google Maps (abre en una pestaña nueva)"
            >
              CÓMO LLEGAR <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="about__item">
            <h3 className="about__label">HORARIOS</h3>
            <div className="about__value about__hours">
              <p>
                <span>{barberia.openingHours.openDays}</span>
                {barberia.openingHours.periods.map((period) => (
                  <span key={period}>{period}</span>
                ))}
              </p>
              <p>
                <span>{barberia.openingHours.closedDay}</span>
                <span>{barberia.openingHours.closedLabel}</span>
              </p>
            </div>
          </div>

          <div className="about__item">
            <h3 className="about__label">WHATSAPP</h3>
            <p className="about__value">{barberia.whatsapp.display}</p>
            <a
              className="about__action"
              href={barberia.whatsapp.url}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Escribir a UNDER 23 por WhatsApp (abre en una pestaña nueva)"
            >
              ESCRIBIR POR WHATSAPP <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="about__item">
            <h3 className="about__label">INSTAGRAM</h3>
            <p className="about__value">{barberia.instagram.handle}</p>
            <a
              className="about__action"
              href={barberia.instagram.url}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Ver Instagram de UNDER 23 (abre en una pestaña nueva)"
            >
              VER INSTAGRAM <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
