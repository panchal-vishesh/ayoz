const variants = {
  warm:    'border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.08] text-[#FFB347]',
  cool:    'border border-[#1F2A3D] bg-[#101726] text-[#CBD5E1]',
  neutral: 'border border-[#1F2A3D] bg-[#151D2E] text-[#CBD5E1]/80',
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
