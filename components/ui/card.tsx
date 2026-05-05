import { cn } from '@/lib/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn('rounded-2xl p-5', className)}
      style={{ backgroundColor: 'var(--surface)', border: '1.5px solid var(--border)' }}
    >
      {children}
    </div>
  )
}

export function CardSection({ title, children, className }: CardProps & { title?: string }) {
  return (
    <Card className={className}>
      {title && (
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}
        >
          {title}
        </p>
      )}
      {children}
    </Card>
  )
}
