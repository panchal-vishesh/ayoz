const variants = {
  warm: 'border border-brand/20 bg-[linear-gradient(135deg,rgba(255,107,26,0.12),rgba(255,107,26,0.06))] text-brand-soft',
  cool: 'border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-slate-200',
  neutral: 'border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] text-slate-300/90',
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
