// src/utils/docxGenerator.js
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

/**
 * Build the flat data object that docxtemplater uses to fill placeholders.
 */
export function buildTemplateData(store) {
  const { basic, education, experiences, awards, skills } = store

  return {
    // Basic
    name: basic.name,
    phone: basic.phone,
    email: basic.email,
    city: basic.city,
    birthdate: basic.birthdate,
    expectedPosition: basic.expectedPosition,
    portfolio: basic.portfolio,

    // Education
    school: education.school,
    major: education.major,
    degree: education.degree,
    eduDates: `${education.enrollDate} — ${education.gradDate || '至今'}`,
    gpa: education.gpa,
    rank: education.rank,

    // Experiences — array for docxtemplater loop {#experiences}…{/experiences}
    experiences: experiences.map((e) => ({
      name: e.name,
      organization: e.organization,
      dates: `${e.startDate} — ${e.endDate || '至今'}`,
      bulletsText: e.bullets.filter(Boolean).map((b) => `• ${b}`).join('\n'),
    })),

    // Awards — array for docxtemplater loop {#awards}…{/awards}
    awards: awards.map((a) => ({
      name: a.name,
      date: a.date,
      level: a.level,
      levelAndName: `${a.level} ${a.name}`,
      description: a.description,
    })),

    // Skills
    languages: skills.languages,
    computerSkills: skills.computerSkills,
    hobbies: skills.hobbies,
    selfIntro: skills.selfIntro,
  }
}

/**
 * Fetch the .docx template, fill placeholders, and trigger browser download.
 * This function runs in the browser only.
 */
export async function generateAndDownload(store) {
  const templateMap = {
    'job-general':    '/templates/job-general.docx',
    'club-apply':     '/templates/club-apply.docx',
    'postgrad-apply': '/templates/postgrad-apply.docx',
  }
  const url = templateMap[store.templateId] ?? templateMap['job-general']

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch template: ${url}`)

  const arrayBuffer = await response.arrayBuffer()
  const zip = new PizZip(arrayBuffer)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  const data = buildTemplateData(store)
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
