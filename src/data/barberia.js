import galleryMock01 from '../assets/gallery-mock-01.svg'
import galleryMock02 from '../assets/gallery-mock-02.svg'
import galleryMock03 from '../assets/gallery-mock-03.svg'
import galleryMock04 from '../assets/gallery-mock-04.svg'

export const barberia = {
  name: 'UNDER 23',
  instagram: {
    handle: '@under_barbershop23',
    url: 'https://www.instagram.com/under_barbershop23/',
  },
  location: {
    city: 'Córdoba',
    country: 'Argentina',
  },
  address: 'Fray Miguel de Mojica 1255',
  openingHours: {
    openDays: 'MARTES — DOMINGO',
    periods: ['10:00 — 13:00', '16:00 — 21:00'],
    closedDay: 'LUNES',
    closedLabel: 'CERRADO',
  },
  whatsapp: {
    display: '+54 9 351 745-8778',
    number: '5493517458778',
    url: 'https://wa.me/5493517458778',
  },
  booking: {
    availabilityLabel: 'DISPONIBILIDAD DE DEMO · MOCK',
    daysToShow: 14,
    timeSlots: [
      {
        label: 'MAÑANA',
        closesAt: '13:00',
        times: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30'],
      },
      {
        label: 'TARDE',
        closesAt: '21:00',
        times: [
          '16:00',
          '16:30',
          '17:00',
          '17:30',
          '18:00',
          '18:30',
          '19:00',
          '19:30',
          '20:00',
          '20:30',
        ],
      },
    ],
  },
  services: [
    {
      id: 'corte',
      number: '01',
      name: 'CORTE',
      description: 'Corte de cabello personalizado.',
      duration: '45 MIN',
      price: '$XX.XXX',
      isMock: true,
    },
    {
      id: 'barba',
      number: '02',
      name: 'BARBA',
      description: 'Perfilado y arreglo de barba.',
      duration: '30 MIN',
      price: '$XX.XXX',
      isMock: true,
    },
    {
      id: 'corte-barba',
      number: '03',
      name: 'CORTE + BARBA',
      description: 'Corte de cabello y arreglo de barba.',
      duration: '60 MIN',
      price: '$XX.XXX',
      isMock: true,
    },
  ],
  gallery: [
    {
      id: 'mock-work-01',
      src: galleryMock01,
      alt: 'Ilustración MOCK de perfil con corte geométrico. Placeholder para reemplazar por una fotografía real.',
    },
    {
      id: 'mock-work-02',
      src: galleryMock02,
      alt: 'Ilustración MOCK de un peinado con líneas diagonales. Placeholder para reemplazar por una fotografía real.',
    },
    {
      id: 'mock-work-03',
      src: galleryMock03,
      alt: 'Ilustración MOCK de un perfil con barba delineada. Placeholder para reemplazar por una fotografía real.',
    },
    {
      id: 'mock-work-04',
      src: galleryMock04,
      alt: 'Ilustración MOCK de un diseño abstracto de barbería. Placeholder para reemplazar por una fotografía real.',
    },
  ],
}
