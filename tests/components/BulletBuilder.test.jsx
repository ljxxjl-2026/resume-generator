import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BulletBuilder from '@/components/BulletBuilder'

describe('BulletBuilder', () => {
  it('renders existing bullets', () => {
    render(<BulletBuilder bullets={['负责运营', '完成50%增长']} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('负责运营')).toBeInTheDocument()
    expect(screen.getByDisplayValue('完成50%增长')).toBeInTheDocument()
  })

  it('adds a new bullet on click', () => {
    const onChange = vi.fn()
    render(<BulletBuilder bullets={['第一条']} onChange={onChange} />)
    fireEvent.click(screen.getByText('+ 添加一条'))
    expect(onChange).toHaveBeenCalledWith(['第一条', ''])
  })

  it('removes a bullet on delete click', () => {
    const onChange = vi.fn()
    render(<BulletBuilder bullets={['第一条', '第二条']} onChange={onChange} />)
    const deleteButtons = screen.getAllByLabelText('删除')
    fireEvent.click(deleteButtons[0])
    expect(onChange).toHaveBeenCalledWith(['第二条'])
  })

  it('updates bullet text on change', () => {
    const onChange = vi.fn()
    render(<BulletBuilder bullets={['旧文本']} onChange={onChange} />)
    fireEvent.change(screen.getByDisplayValue('旧文本'), { target: { value: '新文本' } })
    expect(onChange).toHaveBeenCalledWith(['新文本'])
  })
})
