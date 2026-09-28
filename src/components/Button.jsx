function Button({ href, variant = 'primary', children, className = '' }) {
  return (
    <a className={`button button--${variant} ${className}`.trim()} href={href}>
      {children}
    </a>
  )
}

export default Button
