import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'

/**
 * Extract pure base64 string from a data URL (or return as-is if already base64).
 * The image module must receive a STRING (not Uint8Array/Buffer) as tagValue,
 * otherwise it hits the wrong branch: `typeof tagValue === 'object'` → tries
 * tagValue.rId / tagValue.sizePixel which are undefined → crashes.
 */
function dataUrlToBase64(dataUrl) {
  return dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
}

/**
 * Convert a base64 string to Uint8Array (used inside getImage callback).
 */
function base64ToUint8Array(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/**
 * Draw a gray 一寸 placeholder (295×413) on canvas and return pure base64 string.
 */
function createPlaceholderBase64() {
  const W = 295, H = 413
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ECECEC'
  ctx.fillRect(0, 0, W, H)
  // Simple person silhouette hint
  ctx.fillStyle = '#C0C0C0'
  ctx.beginPath()
  ctx.arc(W / 2, H * 0.32, 52, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(W / 2 - 68, H * 0.52, 136, 120)
  ctx.fillStyle = '#ECECEC'
  ctx.fillRect(W / 2 - 68, H * 0.52, 136, 10)
  ctx.fillStyle = '#AAAAAA'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('证件照', W / 2, H * 0.85)
  return dataUrlToBase64(canvas.toDataURL('image/jpeg', 0.85))
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
  if (!response.ok) throw new Error(`模板加载失败 (${response.status})，请刷新重试`)
  const arrayBuffer = await response.arrayBuffer()
  const zip = new PizZip(arrayBuffer)

  // Photo must be a plain BASE64 STRING in data (not Uint8Array/object),
  // so the image module takes the correct code path and calls getImage/getSize.
  const photoBase64 = store.basic.photoDataUrl
    ? dataUrlToBase64(store.basic.photoDataUrl)
    : createPlaceholderBase64()

  const imageModule = new ImageModule({
    centered: true,
    // getImage receives the base64 string and must return Uint8Array for the zip
    getImage: (tagValue) => base64ToUint8Array(tagValue),
    // getSize receives the Uint8Array returned by getImage; return [width_px, height_px]
    // 一寸照片 25mm×35mm at ~90 DPI → 89×125 px display in Word
    getSize: () => [89, 125],
  })

  const doc = new Docxtemplater(zip, {
    modules: [imageModule],
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render({
    ...buildTemplateData(store),
    photo: photoBase64,   // ← string, not Uint8Array
  })

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
