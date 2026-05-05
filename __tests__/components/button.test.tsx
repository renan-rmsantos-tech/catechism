// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button — primary amber variant', () => {
  it('renders with default variant', () => {
    render(<Button>Salvar</Button>)
    const btn = screen.getByRole('button', { name: 'Salvar' })
    expect(btn).toBeInTheDocument()
  })

  it('default variant applies bg-primary class (maps to --accent = #B45309)', () => {
    render(<Button variant="default">Confirmar Chamada</Button>)
    const btn = screen.getByRole('button', { name: 'Confirmar Chamada' })
    expect(btn).toHaveClass('bg-primary')
  })

  it('renders with text-primary-foreground class for white text', () => {
    render(<Button>CTA</Button>)
    const btn = screen.getByRole('button', { name: 'CTA' })
    expect(btn).toHaveClass('text-primary-foreground')
  })

  it('renders as disabled when disabled prop is set', () => {
    render(<Button disabled>Salvar</Button>)
    const btn = screen.getByRole('button', { name: 'Salvar' })
    expect(btn).toBeDisabled()
  })

  it('renders outline variant', () => {
    render(<Button variant="outline">Cancelar</Button>)
    const btn = screen.getByRole('button', { name: 'Cancelar' })
    expect(btn).toHaveClass('border-border')
  })
})
