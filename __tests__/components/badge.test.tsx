// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/badge'

describe('Badge', () => {
  it('renders "Feita" with success color background', () => {
    render(<Badge variant="feita" />)
    const badge = screen.getByText('Feita')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: '#DCFCE7', color: '#16A34A' })
    expect(badge).toHaveAttribute('data-variant', 'feita')
  })

  it('renders "Pendente" with secondary text color', () => {
    render(<Badge variant="pendente" />)
    const badge = screen.getByText('Pendente')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveStyle({ backgroundColor: '#FEF9C3', color: '#B45309' })
    expect(badge).toHaveAttribute('data-variant', 'pendente')
  })

  it('renders custom children over default label', () => {
    render(<Badge variant="feita">Chamada Feita</Badge>)
    expect(screen.getByText('Chamada Feita')).toBeInTheDocument()
  })

  it('renders default variant', () => {
    render(<Badge>Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveAttribute('data-variant', 'default')
  })

  it('applies additional className', () => {
    render(<Badge variant="feita" className="extra-class" />)
    const badge = screen.getByText('Feita')
    expect(badge).toHaveClass('extra-class')
  })

  it('has rounded-full pill shape', () => {
    render(<Badge variant="feita" />)
    const badge = screen.getByText('Feita')
    expect(badge).toHaveClass('rounded-full')
  })
})
