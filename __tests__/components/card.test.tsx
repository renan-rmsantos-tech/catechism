// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardSection } from '@/components/ui/card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies amber border color via CSS variable in inline style', () => {
    render(<Card>content</Card>)
    const card = screen.getByText('content').closest('div')
    expect(card?.getAttribute('style')).toContain('1.5px solid var(--border)')
  })

  it('applies surface background via CSS variable', () => {
    render(<Card>content</Card>)
    const card = screen.getByText('content').closest('div')
    expect(card).toHaveStyle({ backgroundColor: 'var(--surface)' })
  })

  it('accepts additional className', () => {
    render(<Card className="extra">content</Card>)
    const card = screen.getByText('content').closest('div')
    expect(card).toHaveClass('extra')
  })
})

describe('CardSection', () => {
  it('renders title in amber accent color', () => {
    render(<CardSection title="DADOS PESSOAIS">content</CardSection>)
    const title = screen.getByText('DADOS PESSOAIS')
    expect(title).toBeInTheDocument()
    expect(title).toHaveStyle({ color: 'var(--accent)' })
  })

  it('renders children', () => {
    render(<CardSection title="Section">section content</CardSection>)
    expect(screen.getByText('section content')).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(<CardSection>no title content</CardSection>)
    expect(screen.getByText('no title content')).toBeInTheDocument()
  })
})
