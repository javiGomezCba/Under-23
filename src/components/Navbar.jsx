import { useEffect, useState } from 'react'

const links = [
  { label: 'INICIO', href: '#inicio' },
  { label: 'GALERÍA', href: '#galeria' },
  { label: 'SOMOS UNDER', href: '#about' },
  { label: 'RESERVAR TURNO', href: '#reservar', isBooking: true },
]

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24)

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)
  const classNames = [
    'navbar',
    isScrolled && 'navbar--scrolled',
    isMenuOpen && 'navbar--menu-open',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={classNames}>
      <div className="navbar__inner">
        <a className="navbar__brand" href="#inicio" onClick={closeMenu}>
          UNDER 23
        </a>

        <button
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="navbar__toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          aria-label="Navegación principal"
          className="navbar__links"
          id="primary-navigation"
        >
          {links.map(({ label, href, isBooking }) => (
            <a
              className={isBooking ? 'navbar__link navbar__link--booking' : 'navbar__link'}
              href={href}
              key={href}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
