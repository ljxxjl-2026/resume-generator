import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useResumeStore } from '@/store/resumeStore'

describe('resumeStore', () => {
  beforeEach(() => {
    act(() => useResumeStore.getState().reset())
  })

  it('sets templateId', () => {
    act(() => useResumeStore.getState().setTemplateId('job-general'))
    expect(useResumeStore.getState().templateId).toBe('job-general')
  })

  it('updates basic info fields', () => {
    act(() => useResumeStore.getState().setBasic({ name: '张三', phone: '13800138000' }))
    const { name, phone } = useResumeStore.getState().basic
    expect(name).toBe('张三')
    expect(phone).toBe('13800138000')
  })

  it('adds and updates an experience entry', () => {
    act(() => useResumeStore.getState().addExperience())
    expect(useResumeStore.getState().experiences).toHaveLength(1)
    const id = useResumeStore.getState().experiences[0].id
    act(() => useResumeStore.getState().updateExperience(id, { name: '字节实习' }))
    expect(useResumeStore.getState().experiences[0].name).toBe('字节实习')
  })

  it('removes an experience entry', () => {
    act(() => useResumeStore.getState().addExperience())
    const id = useResumeStore.getState().experiences[0].id
    act(() => useResumeStore.getState().removeExperience(id))
    expect(useResumeStore.getState().experiences).toHaveLength(0)
  })

  it('adds and removes an award', () => {
    act(() => useResumeStore.getState().addAward())
    expect(useResumeStore.getState().awards).toHaveLength(1)
    const id = useResumeStore.getState().awards[0].id
    act(() => useResumeStore.getState().removeAward(id))
    expect(useResumeStore.getState().awards).toHaveLength(0)
  })

  it('resets all data', () => {
    act(() => {
      useResumeStore.getState().setTemplateId('club-apply')
      useResumeStore.getState().setBasic({ name: '李四' })
      useResumeStore.getState().reset()
    })
    expect(useResumeStore.getState().templateId).toBe('')
    expect(useResumeStore.getState().basic.name).toBe('')
  })
})
