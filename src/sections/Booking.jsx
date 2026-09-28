import { useState } from 'react'
import { barberia } from '../data/barberia.js'
import './Booking.css'

const steps = [
  { id: 1, label: 'SERVICIO' },
  { id: 2, label: 'FECHA' },
  { id: 3, label: 'HORARIO' },
  { id: 4, label: 'DATOS' },
  { id: 5, label: 'CONFIRMAR' },
]

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function getNextAvailableDates(count) {
  const dates = []
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + 1)

  while (dates.length < count) {
    if (date.getDay() !== 1) {
      dates.push(new Date(date))
    }

    date.setDate(date.getDate() + 1)
  }

  return dates
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDateParts(date) {
  const weekday = new Intl.DateTimeFormat('es-AR', {
    weekday: 'short',
  })
    .format(date)
    .replace('.', '')
    .slice(0, 3)
    .toUpperCase()
  const month = new Intl.DateTimeFormat('es-AR', {
    month: 'short',
  })
    .format(date)
    .replace('.', '')
    .slice(0, 3)
    .toUpperCase()

  return { weekday, month }
}

function formatLongDate(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`)
  const formatted = dateFormatter.format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function escapeCalendarText(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function formatCalendarDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}`
}

function formatUtcCalendarDate(date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function fitsBeforeClosing(time, duration, closingTime) {
  const [hours, minutes] = time.split(':').map(Number)
  const [closingHour, closingMinute] = closingTime.split(':').map(Number)
  const startMinutes = hours * 60 + minutes
  const endMinutes = startMinutes + duration
  return endMinutes <= closingHour * 60 + closingMinute
}

function createCalendarFile({ service, date, time }) {
  const start = new Date(`${date}T${time}:00`)
  const durationMinutes = Number.parseInt(service.duration, 10)
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const address = `${barberia.address}, ${barberia.location.city}, ${barberia.location.country}`
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UNDER 23//Reserva//ES',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}@under23`,
    `DTSTAMP:${formatUtcCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(start)}`,
    `DTEND:${formatCalendarDate(end)}`,
    `SUMMARY:${escapeCalendarText(`Solicitud de turno ${service.name} · ${barberia.name}`)}`,
    `LOCATION:${escapeCalendarText(address)}`,
    `DESCRIPTION:${escapeCalendarText(`Solicitud de turno pendiente de confirmación por WhatsApp en ${barberia.name}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const file = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'turno-under-23.ics'
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function Booking() {
  const dates = getNextAvailableDates(barberia.booking.daysToShow)
  const [step, setStep] = useState(1)
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [formError, setFormError] = useState('')
  const [isRequestReady, setIsRequestReady] = useState(false)

  const selectedService = barberia.services.find(
    (service) => service.id === selectedServiceId,
  )
  const chosenDate = dates.find((date) => toDateKey(date) === selectedDate)
  const durationMinutes = Number.parseInt(selectedService?.duration ?? '0', 10)
  const canContinue = [
    Boolean(selectedService),
    Boolean(selectedDate),
    Boolean(selectedTime),
    Boolean(name.trim() && phone.trim()),
    false,
  ]

  const goBack = () => {
    setFormError('')
    setStep((currentStep) => Math.max(1, currentStep - 1))
  }

  const submitDetails = (event) => {
    event.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setFormError('Completá tu nombre y tu WhatsApp para continuar.')
      return
    }

    setFormError('')
    setStep(5)
  }

  const prepareRequest = () => {
    setIsRequestReady(true)
  }

  const openWhatsApp = () => {
    const message = `Hola! Soy ${name.trim()}. Quiero confirmar una solicitud de turno en ${barberia.name} para ${selectedService.name} el ${formatLongDate(selectedDate)} a las ${selectedTime}.`
    window.open(
      `${barberia.whatsapp.url}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <section
      aria-labelledby="booking-title"
      className="booking"
      id="reservar"
    >
      <div className="booking__inner">
        {isRequestReady ? (
          <div aria-live="polite" className="booking-confirmation">
            <span aria-hidden="true" className="booking-confirmation__mark">
              …
            </span>
            <p className="booking__eyebrow">RESERVÁ TU TURNO</p>
            <h2
              className="booking-confirmation__title"
              id="booking-title"
            >
              SOLICITUD DE TURNO
            </h2>
            <p className="booking-confirmation__message">
              Tu solicitud está lista. Confirmá el turno por WhatsApp con {barberia.name}.
            </p>

            <dl className="booking-confirmation__details">
              <div>
                <dt>SERVICIO</dt>
                <dd>{selectedService.name}</dd>
              </div>
              <div>
                <dt>FECHA</dt>
                <dd>{formatLongDate(selectedDate)}</dd>
              </div>
              <div>
                <dt>HORARIO</dt>
                <dd>{selectedTime}</dd>
              </div>
              <div>
                <dt>DIRECCIÓN</dt>
                <dd>{barberia.address}</dd>
              </div>
            </dl>

            <div className="booking-confirmation__actions">
              <button
                className="booking__button booking__button--primary"
                onClick={openWhatsApp}
                type="button"
              >
                CONFIRMAR POR WHATSAPP <span aria-hidden="true">→</span>
              </button>
              <button
                className="booking__button booking__button--secondary"
                onClick={() =>
                  createCalendarFile({
                    service: selectedService,
                    date: selectedDate,
                    time: selectedTime,
                  })
                }
                type="button"
              >
                AGREGAR AL CALENDARIO
              </button>
              <p className="booking-confirmation__calendar-note">
                Agregarlo al calendario no confirma el turno; esperá la
                confirmación por WhatsApp.
              </p>
              <a className="booking-confirmation__home" href="#inicio">
                VOLVER AL INICIO
              </a>
            </div>
          </div>
        ) : (
          <>
            <header className="booking__header">
              <p className="booking__eyebrow">RESERVÁ TU TURNO</p>
              <h2 className="booking__title" id="booking-title">
                TU PRÓXIMO CORTE EMPIEZA ACÁ.
              </h2>
              <p className="booking__description">
                Elegí el servicio, el día y el horario que mejor te quede.
              </p>
            </header>

            <nav aria-label="Progreso de la reserva" className="booking-stepper">
              <div className="booking-stepper__compact">
                <span>
                  PASO {String(step).padStart(2, '0')} DE{' '}
                  {String(steps.length).padStart(2, '0')}
                </span>
                <strong>{steps[step - 1].label}</strong>
              </div>
              <ol className="booking-stepper__list">
                {steps.map(({ id, label }) => {
                  const isComplete = id < step
                  const isCurrent = id === step
                  const stepClass = [
                    'booking-stepper__step',
                    isCurrent && 'booking-stepper__step--current',
                    isComplete && 'booking-stepper__step--complete',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <li className={stepClass} key={id}>
                      {isComplete ? (
                        <button
                          aria-label={`Volver al paso ${String(id).padStart(2, '0')} ${label}`}
                          className="booking-stepper__button"
                          onClick={() => setStep(id)}
                          type="button"
                        >
                          <span className="booking-stepper__number">
                            {String(id).padStart(2, '0')}
                          </span>
                          <span className="booking-stepper__label">{label}</span>
                        </button>
                      ) : (
                        <span
                          aria-current={isCurrent ? 'step' : undefined}
                          className="booking-stepper__item"
                        >
                          <span className="booking-stepper__number">
                            {String(id).padStart(2, '0')}
                          </span>
                          <span className="booking-stepper__label">{label}</span>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
              <div
                aria-label={`Paso ${step} de 5`}
                className="booking-stepper__progress"
                role="progressbar"
                aria-valuemin="1"
                aria-valuemax="5"
                aria-valuenow={step}
              >
                <span style={{ width: `${(step / steps.length) * 100}%` }} />
              </div>
            </nav>

            <div className="booking__layout">
              <div className="booking__flow">
                {step > 1 && selectedService && (
                  <div aria-live="polite" className="booking__selection">
                    <span>{selectedService.name}</span>
                    {chosenDate && <span>{formatLongDate(selectedDate)}</span>}
                    {selectedTime && <span>{selectedTime}</span>}
                  </div>
                )}

                <div aria-live="polite" className="booking-panel">
                  {step === 1 && (
                    <div className="booking-step">
                      <div className="booking-step__heading">
                        <span>01</span>
                        <h3>ELEGÍ TU SERVICIO</h3>
                      </div>
                      <p className="booking-step__hint">
                        Servicios, precios y duraciones de demostración;
                        pendientes de confirmación.
                      </p>
                      <div
                        aria-label="Servicios disponibles"
                        className="booking-services"
                        role="group"
                      >
                        {barberia.services.map((service) => {
                          const isSelected = selectedServiceId === service.id

                          return (
                            <button
                              aria-pressed={isSelected}
                              className={`booking-service${isSelected ? ' booking-service--selected' : ''}`}
                              key={service.id}
                              onClick={() => {
                                setSelectedServiceId(service.id)
                                setSelectedTime('')
                              }}
                              type="button"
                            >
                              <span className="booking-service__top">
                                <span className="booking-service__name">
                                  {service.name}
                                </span>
                                <span
                                  aria-hidden="true"
                                  className="booking-service__indicator"
                                >
                                  {isSelected ? '✓' : ''}
                                </span>
                              </span>
                              <span className="booking-service__description">
                                {service.description}
                              </span>
                              <span className="booking-service__meta">
                                <span>{service.duration}</span>
                                <span>{service.price}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <button
                        className="booking__button booking__button--primary"
                        disabled={!canContinue[0]}
                        onClick={() => setStep(2)}
                        type="button"
                      >
                        CONTINUAR <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="booking-step">
                      <div className="booking-step__heading">
                        <span>02</span>
                        <h3>ELEGÍ EL DÍA</h3>
                      </div>
                      <p className="booking-step__hint">
                        Próximas fechas disponibles. Lunes cerrado.
                      </p>
                      <div
                        aria-label="Fechas disponibles"
                        className="booking-dates"
                        role="group"
                      >
                        {dates.map((date) => {
                          const key = toDateKey(date)
                          const { weekday, month } = getDateParts(date)
                          const isSelected = selectedDate === key

                          return (
                            <button
                              aria-label={dateFormatter.format(date)}
                              aria-pressed={isSelected}
                              className={`booking-date${isSelected ? ' booking-date--selected' : ''}`}
                              data-date={key}
                              key={key}
                              onClick={() => {
                                setSelectedDate(key)
                                setSelectedTime('')
                              }}
                              type="button"
                            >
                              <span>{weekday}</span>
                              <strong>{date.getDate()}</strong>
                              <span>{month}</span>
                            </button>
                          )
                        })}
                      </div>
                      <button
                        className="booking__button booking__button--primary"
                        disabled={!canContinue[1]}
                        onClick={() => setStep(3)}
                        type="button"
                      >
                        CONTINUAR <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="booking-step">
                      <div className="booking-step__heading">
                        <span>03</span>
                        <h3>ELEGÍ EL HORARIO</h3>
                      </div>
                      <p className="booking-step__hint">
                        Horarios de ejemplo; sujetos a confirmación.
                      </p>
                      <div className="booking-time-groups">
                        {barberia.booking.timeSlots.map(
                          ({ label, times, closesAt }) => (
                          <fieldset className="booking-time-group" key={label}>
                            <legend>{label}</legend>
                            <div className="booking-times">
                              {times
                                .filter((time) =>
                                  fitsBeforeClosing(
                                    time,
                                    durationMinutes,
                                    closesAt,
                                  ),
                                )
                                .map((time) => {
                                const isSelected = selectedTime === time

                                return (
                                  <button
                                    aria-pressed={isSelected}
                                    className={`booking-time${isSelected ? ' booking-time--selected' : ''}`}
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    type="button"
                                  >
                                    {time}
                                  </button>
                                )
                                })}
                            </div>
                          </fieldset>
                          ),
                        )}
                      </div>
                      <button
                        className="booking__button booking__button--primary"
                        disabled={!canContinue[2]}
                        onClick={() => setStep(4)}
                        type="button"
                      >
                        CONTINUAR <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  )}

                  {step === 4 && (
                    <form className="booking-step" onSubmit={submitDetails}>
                      <div className="booking-step__heading">
                        <span>04</span>
                        <h3>TUS DATOS</h3>
                      </div>
                      <div className="booking-fields">
                        <label className="booking-field">
                          <span>NOMBRE</span>
                          <input
                            autoComplete="name"
                            name="name"
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Tu nombre"
                            required
                            value={name}
                          />
                        </label>
                        <label className="booking-field">
                          <span>WHATSAPP</span>
                          <input
                            autoComplete="tel"
                            inputMode="tel"
                            name="phone"
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="Ej: 351 745 8778"
                            required
                            type="tel"
                            value={phone}
                          />
                        </label>
                      </div>
                      {formError && (
                        <p className="booking__error" role="alert">
                          {formError}
                        </p>
                      )}
                      <button
                        className="booking__button booking__button--primary"
                        type="submit"
                      >
                        VER RESUMEN <span aria-hidden="true">→</span>
                      </button>
                    </form>
                  )}

                  {step === 5 && (
                    <div className="booking-step">
                      <div className="booking-step__heading">
                        <span>05</span>
                        <h3>RESUMEN DE TU TURNO</h3>
                      </div>
                      <dl className="booking-summary">
                        <div>
                          <dt>SERVICIO</dt>
                          <dd>{selectedService.name}</dd>
                        </div>
                        <div>
                          <dt>DURACIÓN</dt>
                          <dd>{selectedService.duration}</dd>
                        </div>
                        <div>
                          <dt>FECHA</dt>
                          <dd>{formatLongDate(selectedDate)}</dd>
                        </div>
                        <div>
                          <dt>HORARIO</dt>
                          <dd>{selectedTime}</dd>
                        </div>
                        <div>
                          <dt>NOMBRE</dt>
                          <dd>{name.trim()}</dd>
                        </div>
                        <div>
                          <dt>WHATSAPP</dt>
                          <dd>{phone.trim()}</dd>
                        </div>
                        <div>
                          <dt>PRECIO</dt>
                          <dd>{selectedService.price}</dd>
                        </div>
                      </dl>
                      <button
                        className="booking__button booking__button--primary"
                        onClick={prepareRequest}
                        type="button"
                      >
                        PREPARAR SOLICITUD
                      </button>
                      <button
                        className="booking__button booking__button--text"
                        onClick={goBack}
                        type="button"
                      >
                        ← EDITAR
                      </button>
                    </div>
                  )}
                </div>

                {step > 1 && step < 5 && (
                  <button
                    className="booking__back"
                    onClick={goBack}
                    type="button"
                  >
                    ← VOLVER
                  </button>
                )}
              </div>

              <aside
                aria-label="Resumen de la selección"
                className="booking-overview"
              >
                <p className="booking-overview__eyebrow">TU TURNO</p>
                {selectedService ? (
                  <dl>
                    <div>
                      <dt>SERVICIO</dt>
                      <dd>{selectedService.name}</dd>
                    </div>
                    {selectedDate && (
                      <div>
                        <dt>FECHA</dt>
                        <dd>{formatLongDate(selectedDate)}</dd>
                      </div>
                    )}
                    {selectedTime && (
                      <div>
                        <dt>HORARIO</dt>
                        <dd>{selectedTime}</dd>
                      </div>
                    )}
                    <div>
                      <dt>PRECIO</dt>
                      <dd>{selectedService.price}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="booking-overview__empty">
                    Tu selección va a aparecer acá.
                  </p>
                )}
                <p className="booking-overview__mock">
                  {barberia.booking.availabilityLabel}
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Booking
