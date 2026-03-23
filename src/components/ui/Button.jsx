const variants = {
  primary:
    'bg-gradient-to-r from-brand to-[#6f8cff] text-[#050712] shadow-[0_18px_34px_rgba(90,117,225,0.28)] hover:shadow-[0_22px_42px_rgba(90,117,225,0.35)]',
  secondary:
    'border border-white/10 bg-white/[0.04] text-slate-100 hover:border-brand/25 hover:bg-white/[0.06]',
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
      {children}
    </button>
  )
}
