const variants = {
  primary:
    'relative overflow-hidden border border-brand/30 bg-[linear-gradient(135deg,#FF8C42_0%,#FF6B1A_52%,#e85d0f_100%)] text-white shadow-[0_20px_40px_rgba(255,107,26,0.26)] hover:shadow-[0_24px_48px_rgba(255,107,26,0.38)]',
  secondary:
    'border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] text-slate-100 hover:border-brand/22 hover:bg-white/[0.07]',
}

export default function Button({
  children,
  variant = 'primary',
  compact = false,
  className = '',
  type = 'button',
  ...props
}) {
  const size = compact ? 'px-4 py-2.5 text-sm' : 'px-5 py-3.5 text-sm sm:text-base'

  return (
    <button
      type={type}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${size} ${variants[variant]} ${className}`}
      {...props}
    >
      {variant === 'primary' ? (
        <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]" />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}
