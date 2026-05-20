// scripts/create-templates.mjs
// Run with: node scripts/create-templates.mjs
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType,
  convertInchesToTwip, TableLayoutType,
} from 'docx'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/templates')
mkdirSync(OUT, { recursive: true })

// ─── helpers ────────────────────────────────────────────────────────────────

const HR = new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } },
  spacing: { after: 200 },
})

const sectionTitle = (text, color = '333333') =>
  new Paragraph({
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    children: [new TextRun({ text, bold: true, size: 26, color })],
  })

const field = (label, placeholder) =>
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}：`, bold: true, size: 20, color: '555555' }),
      new TextRun({ text: placeholder, size: 20, color: '333333' }),
    ],
  })

// ─── Template 1: 求职通用版 ──────────────────────────────────────────────────

async function makeJobGeneral() {
  const ACCENT = 'C0392B'
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(0.9),
            right: convertInchesToTwip(0.9),
          }
        }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: '{name}', bold: true, size: 52, color: ACCENT })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: '{phone}   |   {email}   |   {city}', size: 20, color: '555555' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: '意向岗位：{expectedPosition}', size: 20, color: '555555' })],
        }),
        HR,

        sectionTitle('教育背景', ACCENT),
        field('学校', '{school}'),
        field('专业', '{major}（{degree}）'),
        field('时间', '{eduDates}'),
        field('GPA', '{gpa}　排名：{rank}'),
        HR,

        sectionTitle('实习 / 项目经历', ACCENT),
        new Paragraph({ children: [new TextRun({ text: '{#experiences}', size: 1, color: 'FFFFFF' })] }),
        new Paragraph({
          spacing: { before: 180, after: 60 },
          children: [
            new TextRun({ text: '{name}', bold: true, size: 22, color: '333333' }),
            new TextRun({ text: '　·　{organization}', size: 20, color: '888888' }),
            new TextRun({ text: '　{dates}', size: 20, color: '888888' }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: '{bulletsText}', size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '{/experiences}', size: 1, color: 'FFFFFF' })] }),
        HR,

        sectionTitle('获奖荣誉', ACCENT),
        new Paragraph({ children: [new TextRun({ text: '{#awards}', size: 1, color: 'FFFFFF' })] }),
        new Paragraph({
          spacing: { after: 80 },
          bullet: { level: 0 },
          children: [
            new TextRun({ text: '{levelAndName}', bold: true, size: 20 }),
            new TextRun({ text: '　{date}', size: 20, color: '888888' }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: '{/awards}', size: 1, color: 'FFFFFF' })] }),
        HR,

        sectionTitle('技能特长', ACCENT),
        field('语言', '{languages}'),
        field('技能', '{computerSkills}'),
        field('兴趣', '{hobbies}'),

        sectionTitle('自我评价', ACCENT),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{selfIntro}', size: 20 })] }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  writeFileSync(resolve(OUT, 'job-general.docx'), buffer)
  console.log('✅ job-general.docx created')
}

// ─── Template 2: 社团/部门申请版 ─────────────────────────────────────────────

async function makeClubApply() {
  const ACCENT = '2E7D32'
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(0.6),
            right: convertInchesToTwip(0.9),
          }
        }
      },
      children: [
        new Table({
          layout: TableLayoutType.FIXED,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideH: { style: BorderStyle.NONE },
            insideV: { style: BorderStyle.NONE },
          },
          rows: [new TableRow({
            children: [
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: 'E8F5E9' },
                children: [
                  new Paragraph({ spacing: { before: 200, after: 120 }, children: [new TextRun({ text: '{name}', bold: true, size: 36, color: ACCENT })] }),
                  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{expectedPosition}', size: 20, color: '555555' })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{phone}', size: 18, color: '555555' })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{email}', size: 18, color: '555555' })] }),
                  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '{city}', size: 18, color: '555555' })] }),
                  new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '技能', bold: true, size: 22, color: ACCENT })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{languages}', size: 18 })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{computerSkills}', size: 18 })] }),
                  new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '兴趣爱好', bold: true, size: 22, color: ACCENT })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{hobbies}', size: 18 })] }),
                ],
              }),
              new TableCell({
                width: { size: 72, type: WidthType.PERCENTAGE },
                children: [
                  sectionTitle('教育背景', ACCENT),
                  field('学校', '{school}'),
                  field('专业', '{major}（{degree}）'),
                  field('时间', '{eduDates}'),
                  field('GPA', '{gpa}'),
                  sectionTitle('参与经历', ACCENT),
                  new Paragraph({ children: [new TextRun({ text: '{#experiences}', size: 1, color: 'FFFFFF' })] }),
                  new Paragraph({
                    spacing: { before: 160, after: 60 },
                    children: [new TextRun({ text: '{name}  ·  {organization}  {dates}', bold: true, size: 22, color: '333333' })],
                  }),
                  new Paragraph({ children: [new TextRun({ text: '{bulletsText}', size: 20 })] }),
                  new Paragraph({ children: [new TextRun({ text: '{/experiences}', size: 1, color: 'FFFFFF' })] }),
                  sectionTitle('获奖荣誉', ACCENT),
                  new Paragraph({ children: [new TextRun({ text: '{#awards}', size: 1, color: 'FFFFFF' })] }),
                  new Paragraph({
                    bullet: { level: 0 },
                    spacing: { after: 80 },
                    children: [new TextRun({ text: '{levelAndName}　{date}', size: 20 })],
                  }),
                  new Paragraph({ children: [new TextRun({ text: '{/awards}', size: 1, color: 'FFFFFF' })] }),
                  sectionTitle('自我评价', ACCENT),
                  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{selfIntro}', size: 20 })] }),
                ],
              }),
            ],
          })],
        }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  writeFileSync(resolve(OUT, 'club-apply.docx'), buffer)
  console.log('✅ club-apply.docx created')
}

// ─── Template 3: 保研/留学申请版 ─────────────────────────────────────────────

async function makePostgradApply() {
  const ACCENT = '1565C0'
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.7),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          }
        }
      },
      children: [
        new Table({
          layout: TableLayoutType.FIXED,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideH: { style: BorderStyle.NONE },
            insideV: { style: BorderStyle.NONE },
          },
          rows: [new TableRow({
            children: [new TableCell({
              shading: { type: ShadingType.SOLID, color: '1565C0' },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 160, after: 80 },
                  children: [new TextRun({ text: '{name}', bold: true, size: 52, color: 'FFFFFF' })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 160 },
                  children: [new TextRun({ text: '{phone}   |   {email}   |   {city}', size: 18, color: 'E3F2FD' })],
                }),
              ],
            })],
          })],
        }),

        sectionTitle('学术背景', ACCENT),
        field('学校', '{school}'),
        field('专业', '{major}（{degree}）'),
        field('学习时间', '{eduDates}'),
        field('GPA / 绩点', '{gpa}　专业排名：{rank}'),
        HR,

        sectionTitle('科研 / 项目经历', ACCENT),
        new Paragraph({ children: [new TextRun({ text: '{#experiences}', size: 1, color: 'FFFFFF' })] }),
        new Paragraph({
          spacing: { before: 180, after: 60 },
          children: [new TextRun({ text: '{name}', bold: true, size: 22, color: '333333' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: '{organization}　{dates}', size: 20, color: '888888' })],
        }),
        new Paragraph({ children: [new TextRun({ text: '{bulletsText}', size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '{/experiences}', size: 1, color: 'FFFFFF' })] }),
        HR,

        sectionTitle('奖项与荣誉', ACCENT),
        new Paragraph({ children: [new TextRun({ text: '{#awards}', size: 1, color: 'FFFFFF' })] }),
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [new TextRun({ text: '{levelAndName}　{date}　{description}', size: 20 })],
        }),
        new Paragraph({ children: [new TextRun({ text: '{/awards}', size: 1, color: 'FFFFFF' })] }),
        HR,

        sectionTitle('语言与技能', ACCENT),
        field('语言能力', '{languages}'),
        field('专业技能', '{computerSkills}'),
        HR,

        sectionTitle('个人陈述', ACCENT),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{selfIntro}', size: 20 })] }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  writeFileSync(resolve(OUT, 'postgrad-apply.docx'), buffer)
  console.log('✅ postgrad-apply.docx created')
}

await makeJobGeneral()
await makeClubApply()
await makePostgradApply()
console.log('\n🎉 All templates generated in public/templates/')
