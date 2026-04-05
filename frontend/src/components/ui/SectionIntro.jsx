import Badge from './Badge'

export default function SectionIntro({ badge, badgeVariant = 'cool', title, description, className = '' }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Badge variant={badgeVariant}>{badge}</Badge>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:mt-4 sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-400 sm:mt-4">{description}</p>
    </div>
  )
}
