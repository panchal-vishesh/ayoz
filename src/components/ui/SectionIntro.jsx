import Badge from './Badge'
import { sectionText, sectionTitle } from './styles'

export default function SectionIntro({
  badge,
  badgeVariant = 'cool',
  title,
  description,
  className = '',
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Badge variant={badgeVariant}>{badge}</Badge>
      <h2 className={`mt-3 font-display text-3xl tracking-[-0.04em] text-slate-50 sm:mt-4 sm:text-4xl lg:text-5xl xl:text-6xl`}>{title}</h2>
      <p className={`mt-3 text-xs leading-6 text-slate-300/75 sm:mt-4 sm:text-sm sm:leading-7`}>{description}</p>
    </div>
  )
}
