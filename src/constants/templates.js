export const TEMPLATES = [
  {
    id: 'job-general',
    name: '求职通用版',
    desc: '简洁大方，适合大多数企业岗位投递',
    accentColor: '#FF4D6D',
    hlClass: 'hl-pink',
    file: '/templates/job-general.docx',
    previewLayout: 'single',
  },
  {
    id: 'club-apply',
    name: '社团部门申请版',
    desc: '活泼清新，突出综合素质与热情',
    accentColor: '#4CAF50',
    hlClass: 'hl-green',
    file: '/templates/club-apply.docx',
    previewLayout: 'sidebar',
  },
  {
    id: 'postgrad-apply',
    name: '保研/留学申请版',
    desc: '学术规范，强调科研与成绩',
    accentColor: '#2196F3',
    hlClass: 'hl-blue',
    file: '/templates/postgrad-apply.docx',
    previewLayout: 'academic',
  },
]

export function shuffleTemplates() {
  return [...TEMPLATES].sort(() => Math.random() - 0.5)
}
