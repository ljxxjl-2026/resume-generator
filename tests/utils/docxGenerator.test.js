import { describe, it, expect } from 'vitest'
import { buildTemplateData } from '@/utils/docxGenerator'

describe('buildTemplateData', () => {
  const baseStore = {
    templateId: 'job-general',
    basic: { name: '张三', phone: '13800138000', email: 'z@test.com', city: '北京', birthdate: '2002.08', expectedPosition: '产品实习', portfolio: '' },
    education: { school: '北京大学', major: '计算机', degree: '本科', enrollDate: '2021.09', gradDate: '2025.06', gpa: '3.8', rank: '前10%' },
    experiences: [
      { id: 1, name: '字节实习', organization: '字节跳动', startDate: '2024.06', endDate: '2024.09', bullets: ['负责A', '完成B'] }
    ],
    awards: [
      { id: 1, name: '国家奖学金', date: '2023.11', level: '国家级', description: '' }
    ],
    skills: { languages: '英语CET-6', computerSkills: 'Python', hobbies: '摄影', selfIntro: '热爱产品' },
  }

  it('maps basic info fields correctly', () => {
    const data = buildTemplateData(baseStore)
    expect(data.name).toBe('张三')
    expect(data.phone).toBe('13800138000')
    expect(data.email).toBe('z@test.com')
    expect(data.expectedPosition).toBe('产品实习')
  })

  it('maps education fields', () => {
    const data = buildTemplateData(baseStore)
    expect(data.school).toBe('北京大学')
    expect(data.degree).toBe('本科')
    expect(data.eduDates).toBe('2021.09 — 2025.06')
  })

  it('maps experiences as array', () => {
    const data = buildTemplateData(baseStore)
    expect(data.experiences).toHaveLength(1)
    expect(data.experiences[0].name).toBe('字节实习')
    expect(data.experiences[0].bulletsText).toBe('• 负责A\n• 完成B')
  })

  it('maps awards as array', () => {
    const data = buildTemplateData(baseStore)
    expect(data.awards).toHaveLength(1)
    expect(data.awards[0].levelAndName).toBe('国家级 国家奖学金')
  })
})
