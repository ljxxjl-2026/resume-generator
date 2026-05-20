import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'

/** Convert base64 data URL to Uint8Array */
function base64ToUint8Array(dataUrl) {
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/** Create a gray placeholder image (1-inch photo, 295x413px) as PNG Uint8Array */
function createPhotoPlaceholder() {
  const W = 295, H = 413
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#E8E8E8'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#AAAAAA'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('证件照', W / 2, H / 2 - 10)
  ctx.font = '16px sans-serif'
  ctx.fillText('Photo', W / 2, H / 2 + 18)
  const dataUrl = canvas.toDataURL('image/png')
  return base64ToUint8Array(dataUrl)
}

export function buildTemplateData(store) {
  const { basic, education, experiences, awards, skills } = store
  return {
    name: basic.name,
    phone: basic.phone,
    email: basic.email,
    city: basic.city,
    birthdate: basic.birthdate,
    expectedPosition: basic.expectedPosition,
    portfolio: basic.portfolio,
    politicalStatus: basic.politicalStatus || '共青团员',

    school: education.school,
    major: education.major,
    degree: education.degree,
    eduDates: `${education.enrollDate} — ${education.gradDate || '至今'}`,
    gpa: education.gpa,
    rank: education.rank,

    experiences: experiences.map((e) => ({
      name: e.name,
      organization: e.organization,
      dates: `${e.startDate} — ${e.endDate || '至今'}`,
      bulletsText: e.bullets.filter(Boolean).map((b) => `• ${b}`).join('\n'),
    })),

    awards: awards.map((a) => ({
      name: a.name,
      date: a.date,
      level: a.level,
      levelAndName: `${a.level} ${a.name}`,
      description: a.description,
    })),

    languages: skills.languages,
    computerSkills: skills.computerSkills,
    hobbies: skills.hobbies,
    selfIntro: skills.selfIntro,
  }
}

export async function generateAndDownload(store) {
  const base = import.meta.env.BASE_URL
  const templateMap = {
    'job-general':    `${base}templates/job-general.docx`,
    'club-apply':     `${base}templates/club-apply.docx`,
    'postgrad-apply': `${base}templates/postgrad-apply.docx`,
  }
  const url = templateMap[store.templateId] ?? templateMap['job-general']

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch template: ${url}`)
  const arrayBuffer = await response.arrayBuffer()
  const zip = new PizZip(arrayBuffer)

  // Prepare photo data
  const photoData = store.basic.photoDataUrl
    ? base64ToUint8Array(store.basic.photoDataUrl)
    : createPhotoPlaceholder()

  // Image module: {%photo} → 一寸照片 (25mm × 35mm at 96dpi ≈ 94×132px display)
  const imageModule = new ImageModule({
    centered: true,
    fileType: 'docx',
    getImage: (tagValue) => tagValue,
    getSize: () => [94, 132],
  })

  const doc = new Docxtemplater(zip, {
    modules: [imageModule],
    paragraphLoop: true,
    linebreaks: true,
  })

  const data = {
    ...buildTemplateData(store),
    photo: photoData,
  }
  doc.render(data)

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const fileName = `${store.basic.name || 'resume'}_简历.docx`
  const link = document.createElement('a')
  link.href = URL.createObjectURL(out)
  link.download = fileName
  link.click()
  URL.revokeObjectURL(link.href)
}
