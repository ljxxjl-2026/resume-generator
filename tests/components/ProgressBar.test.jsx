import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProgressBar from '@/components/ProgressBar'

const STEPS = ['基本信息','教育背景','实习经历','获奖情况','技能特长','确认提交']

describe('ProgressBar', () => {
  it('renders all step labels', () => {
    render(<ProgressBar steps={STEPS} currentStep={0} />)
    STEPS.forEach(label => expect(screen.getByText(label)).toBeInTheDocument())
  })

  it('marks completed steps with aria-label', () => {
    render(<ProgressBar steps={STEPS} currentStep={2} />)
    expect(screen.getAllByLabelText('completed')).toHaveLength(2)
  })

  it('marks current step', () => {
    render(<ProgressBar steps={STEPS} currentStep={3} />)
    expect(screen.getByLabelText('current')).toBeInTheDocument()
  })
})
