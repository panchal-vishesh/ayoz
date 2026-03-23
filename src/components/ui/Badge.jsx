const variants = {
  warm: 'border border-brand/25 bg-brand/10 text-brand-soft',
  cool: 'border border-white/10 bg-white/[0.05] text-slate-200',
  neutral: 'border border-white/10 bg-white/[0.04] text-slate-300/90',
}

export default function Badge({ children, variant = 'cool', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
