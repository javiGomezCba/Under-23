# UNDER 23

Sitio web frontend de UNDER 23, barbería en Córdoba, Argentina. La página
presenta la barbería, una galería de referencias visuales y un flujo de
solicitud de turno frontend-only.

## Desarrollo

```sh
npm run dev
```

## Validación

```sh
npm run lint
npm run build
```

## Estructura

- `src/components/`: componentes reutilizables.
- `src/sections/`: Hero, GallerySection, About y Booking.
- `src/data/barberia.js`: información confirmada y datos `MOCK`/provisionales.
- `src/App.jsx`: composición principal de la aplicación.
- `src/index.css`: tokens de diseño y estilos globales.

La selección de servicios forma parte del primer paso de Booking. Los servicios,
precios, duraciones, disponibilidad e imágenes son demostrativos y están
marcados como `MOCK`; una solicitud requiere confirmación por WhatsApp.
