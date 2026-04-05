const variants = {
  primary:
    'bg-[#FF6B1A] hover:bg-[#E55A12] text-white shadow-[0_8px_24px_rgba(255,107,26,0.3)] hover:shadow-[0_12px_32px_rgba(255,107,26,0.45)]',
  secondary:
    'border border-[#1F2A3D] bg-transparent text-[#CBD5E1] hover:border-[#FF6B1A]/40 hover:text-white hover:shadow-[0_0_20px_rgba(255,107,26,0.1)]',
  blue:
    'bg-[#0F2A44] border border-[#1F2A3D] text-[#CBD5E1] hover:border-[#FF6B1A]/30 hover:text-white',
  emerald:
    'bg-[#FF6B1A] hover:bg-[#E55A12] text-white shadow-[0_8px_24px_rgba(255,107,26,0.3)]',
  ghost:
    'border border-[#1F2A3D] bg-transparent text-[#64748B] hover:border-[#1F2A3D] hover:text-[#CBD5E1]',
  danger:
    'border border-rose-500/25 bg-rose-500/[0.08] text-rose-300 hover:bg-rose-500/[0.14] hover:border-rose-500/40',
  'blue-ghost':
    'border border-[#1F2A3D] bg-[#101726] text-[#CBD5E1] hover:border-[#FF6B1A]/30 hover:shadow-[0_0_20px_rgba(255,107,26,0.1)]',
  'emerald-ghost':
    'border border-[#1F2A3D] bg-[#101726] text-[#CBD5E1] hover:border-[#FF6B1A]/30 hover:shadow-[0_0_20px_rgba(255,107,26,0.1)]',
  'orange-ghost':
    'border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.06] text-[#FFB347] hover:bg-[#FF6B1A]/[0.12] hover:border-[#FF6B1A]/40',
}

export default function Button({
  children,
  variant = 'primary',
  compact = false,
  className = '',
  type = 'button',
  ...props
}) {
  const size = compact ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-3 text-sm sm:text-base'
  const hasShine = false

  return (
    <button
      type={type}
      className={`inline-flex min-h-[42px] items-center justify-center rounded-full font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A]/40 ${size} ${variants[variant] ?? variants.secondary} ${className}`}
      {...props}
    >
      {hasShine ? (
        <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)]" />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}
