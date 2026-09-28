import { useLayoutEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './sections/Hero.jsx'
import GallerySection from './sections/GallerySection.jsx'
import About from './sections/About.jsx'
import Booking from './sections/Booking.jsx'
import Footer from './components/Footer.jsx'

function App() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion || !('IntersectionObserver' in window)) return undefined

    const targets = document.querySelectorAll(
      '.gallery-section__header, .gallery__item, .about__brand, .about__information, .booking__header, .booking-panel',
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    )

    targets.forEach((target) => {
      target.classList.add('is-reveal-ready')
      observer.observe(target)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <GallerySection />
        <About />
        <Booking />
      </main>
      <Footer />
    </div>
  )
}

export default App
