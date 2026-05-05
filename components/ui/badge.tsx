import { cn } from '@/lib/utils'

export type BadgeVariant = 'feita' | 'pendente' | 'default'

const variantStyles: Record<BadgeVariant, { backgroundColor: string; color: string }> = {
  feita: { backgroundColor: '#DCFCE7', color: '#16A34A' },
  pendente: { backgroundColor: '#FEF9C3', color: '#B45309' },
  default: { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' },
}

const variantLabels: Record<BadgeVariant, string> = {
  feita: 'Feita',
  pendente: 'Pendente',
  default: '',
}

export interface BadgeProps {
  variant?: BadgeVariant
  children?: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const styles = variantStyles[variant]
  const label = children ?? variantLabels[variant]

  return (
    <span
      data-variant={variant}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        className,
      )}
      style={styles}
    >
      {label}
    </span>
  )
}
