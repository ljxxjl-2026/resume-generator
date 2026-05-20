# Resume Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React SPA that guides Chinese university students through a Q&A wizard to generate a filled, downloadable `.docx` resume.

**Architecture:** React 18 + Vite static app deployed on Vercel. Zustand manages all wizard state. React Router v6 controls step navigation. docxtemplater fills pre-built `.docx` templates in the browser and triggers download.

**Tech Stack:** React 18, Vite, React Router v6, Zustand, Tailwind CSS v4, docxtemplater, PizZip, Vitest + React Testing Library

---

## File Map

```
resume-generator/
├── public/
│   └── templates/
│       ├── job-general.docx          # 求职通用模板
│       ├── club-apply.docx           # 社团/部门申请模板
│       └── postgrad-apply.docx       # 保研/留学申请模板
├── scripts/
│   └── create-templates.mjs          # 生成三个 .docx 模板的 Node 脚本
├── src/
│   ├── main.jsx
│   ├── App.jsx                       # Router + routes
│   ├── index.css                     # Tailwind + global styles + animations
│   ├── store/
│   │   └── resumeStore.js            # Zustand store (全量简历数据)
│   ├── components/
│   │   ├── ProgressBar.jsx           # 顶部步骤进度条
│   │   ├── StepCard.jsx              # 每个步骤的容器卡片（动效、导航按钮）
│   │   ├── BulletBuilder.jsx         # 引导式分点输入组件
│   │   ├── TextInput.jsx             # 统一风格的文本输入框
│   │   ├── SelectInput.jsx           # 统一风格的下拉选择
│   │   └── HighlightTag.jsx          # 荧光笔标签装饰组件
│   ├── pages/
│   │   ├── Home.jsx                  # 首页（入口选择）
│   │   ├── TemplatePicker.jsx        # 模板选择页（3 张预览卡）
│   │   └── steps/
│   │       ├── BasicInfo.jsx         # Step 1: 基本信息
│   │       ├── Education.jsx         # Step 2: 教育背景
│   │       ├── Experience.jsx        # Step 3: 实习/活动经历
│   │       ├── Awards.jsx            # Step 4: 获奖经历
│   │       ├── Skills.jsx            # Step 5: 技能与自我介绍
│   │       └── Review.jsx            # Step 6: 汇总预览
│   ├── utils/
│   │   └── docxGenerator.js          # docxtemplater 封装：填充 + 下载
│   └── constants/
│       └── templates.js              # 3 个模板的元数据（id, 名称, 描述, 预览色调）
├── tests/
│   ├── store/
│   │   └── resumeStore.test.js
│   ├── components/
│   │   ├── BulletBuilder.test.jsx
│   │   └── ProgressBar.test.jsx
│   └── utils/
│       └── docxGenerator.test.js
├── vite.config.js
├── tailwind.config.js
├── vitest.config.js
└── vercel.json
```

---

## Task 1: Configure Vite, Tailwind, Vitest

**Files:**
- Modify: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `vitest.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Update vite.config.js**

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 2: Create vitest.config.js**

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 3: Create tests/setup.js**

```js
// tests/setup.js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Replace src/index.css with design tokens**

```css
/* src/index.css */
@import "tailwindcss";

:root {
  --bg: #FAFAF8;
  --surface: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #6B7280;
  --accent: #FF4D6D;
  --accent-soft: #FFF0F3;
  --hl-yellow: #FFF176;
  --hl-green: #CCFF90;
  --hl-blue: #B3E5FC;
  --hl-pink: #F8BBD9;
  --radius: 16px;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Page slide animation */
@keyframes slideIn {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}

.page-enter { animation: slideIn 0.3s ease-out; }

/* Highlighter effect */
.hl {
  background: linear-gradient(to bottom, transparent 55%, var(--hl-yellow) 55%);
  padding: 0 2px;
}
.hl-green { background: linear-gradient(to bottom, transparent 55%, var(--hl-green) 55%); padding: 0 2px; }
.hl-pink  { background: linear-gradient(to bottom, transparent 55%, var(--hl-pink)  55%); padding: 0 2px; }
.hl-blue  { background: linear-gradient(to bottom, transparent 55%, var(--hl-blue)  55%); padding: 0 2px; }
```

- [ ] **Step 5: Add test script to package.json**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 6: Run tests (empty suite, should pass)**

```bash
npm test
```
Expected: `No test files found`

- [ ] **Step 7: Commit**

```bash
git init && git add .
git commit -m "feat: scaffold Vite + React + Tailwind + Vitest"
```

---

## Task 2: Zustand Store

**Files:**
- Create: `src/store/resumeStore.js`
- Create: `tests/store/resumeStore.test.js`

- [ ] **Step 1: Write the failing test**

```js
// tests/store/resumeStore.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL — `Cannot find module '@/store/resumeStore'`

- [ ] **Step 3: Implement the store**

```js
// src/store/resumeStore.js
import { create } from 'zustand'

const initialState = {
  templateId: '',
  basic: {
    name: '', phone: '', email: '', city: '',
    birthdate: '', expectedPosition: '', portfolio: '',
  },
  education: {
    school: '', major: '', degree: '本科',
    enrollDate: '', gradDate: '', gpa: '', rank: '',
  },
  experiences: [],   // { id, name, organization, startDate, endDate, bullets: [] }
  awards: [],        // { id, name, date, level, description }
  skills: {
    languages: '', computerSkills: '', hobbies: '', selfIntro: '',
  },
}

let _nextId = 1
const nextId = () => _nextId++

export const useResumeStore = create((set) => ({
  ...initialState,

  setTemplateId: (templateId) => set({ templateId }),

  setBasic: (patch) =>
    set((s) => ({ basic: { ...s.basic, ...patch } })),

  setEducation: (patch) =>
    set((s) => ({ education: { ...s.education, ...patch } })),

  addExperience: () =>
    set((s) => ({
      experiences: [...s.experiences, {
        id: nextId(), name: '', organization: '',
        startDate: '', endDate: '', bullets: [],
      }],
    })),

  updateExperience: (id, patch) =>
    set((s) => ({
      experiences: s.experiences.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    })),

  removeExperience: (id) =>
    set((s) => ({ experiences: s.experiences.filter((e) => e.id !== id) })),

  addAward: () =>
    set((s) => ({
      awards: [...s.awards, {
        id: nextId(), name: '', date: '', level: '校级', description: '',
      }],
    })),

  updateAward: (id, patch) =>
    set((s) => ({
      awards: s.awards.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    })),

  removeAward: (id) =>
    set((s) => ({ awards: s.awards.filter((a) => a.id !== id) })),

  setSkills: (patch) =>
    set((s) => ({ skills: { ...s.skills, ...patch } })),

  reset: () => { _nextId = 1; set({ ...initialState, experiences: [], awards: [] }) },
}))
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: PASS — 7 tests

- [ ] **Step 5: Commit**

```bash
git add src/store/resumeStore.js tests/store/resumeStore.test.js tests/setup.js
git commit -m "feat: add Zustand resume store with full CRUD"
```

---

## Task 3: Constants + App Router

**Files:**
- Create: `src/constants/templates.js`
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create template metadata**

```js
// src/constants/templates.js
export const TEMPLATES = [
  {
    id: 'job-general',
    name: '求职通用版',
    desc: '简洁大方，适合大多数企业岗位投递',
    accentColor: '#FF4D6D',
    hlClass: 'hl-pink',
    file: '/templates/job-general.docx',
    previewLayout: 'single', // 单栏
  },
  {
    id: 'club-apply',
    name: '社团部门申请版',
    desc: '活泼清新，突出综合素质与热情',
    accentColor: '#4CAF50',
    hlClass: 'hl-green',
    file: '/templates/club-apply.docx',
    previewLayout: 'sidebar', // 左侧色条
  },
  {
    id: 'postgrad-apply',
    name: '保研/留学申请版',
    desc: '学术规范，强调科研与成绩',
    accentColor: '#2196F3',
    hlClass: 'hl-blue',
    file: '/templates/postgrad-apply.docx',
    previewLayout: 'academic', // 顶部标题栏
  },
]

// Returns shuffled copy (for "换一批" feature)
export function shuffleTemplates() {
  return [...TEMPLATES].sort(() => Math.random() - 0.5)
}
```

- [ ] **Step 2: Set up App.jsx with all routes**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import TemplatePicker from '@/pages/TemplatePicker'
import BasicInfo from '@/pages/steps/BasicInfo'
import Education from '@/pages/steps/Education'
import Experience from '@/pages/steps/Experience'
import Awards from '@/pages/steps/Awards'
import Skills from '@/pages/steps/Skills'
import Review from '@/pages/steps/Review'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template" element={<TemplatePicker />} />
        <Route path="/step/basic" element={<BasicInfo />} />
        <Route path="/step/education" element={<Education />} />
        <Route path="/step/experience" element={<Experience />} />
        <Route path="/step/awards" element={<Awards />} />
        <Route path="/step/skills" element={<Skills />} />
        <Route path="/step/review" element={<Review />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Update main.jsx**

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 4: Create placeholder pages so the app doesn't crash**

Create each file with a minimal placeholder:

```jsx
// src/pages/Home.jsx
export default function Home() { return <div>Home</div> }
```

Repeat for: `src/pages/TemplatePicker.jsx`, `src/pages/steps/BasicInfo.jsx`, `src/pages/steps/Education.jsx`, `src/pages/steps/Experience.jsx`, `src/pages/steps/Awards.jsx`, `src/pages/steps/Skills.jsx`, `src/pages/steps/Review.jsx`

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite server starts, visiting `http://localhost:5173` shows "Home"

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: set up router and template constants"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `src/components/ProgressBar.jsx`
- Create: `src/components/StepCard.jsx`
- Create: `src/components/TextInput.jsx`
- Create: `src/components/SelectInput.jsx`
- Create: `src/components/HighlightTag.jsx`
- Create: `src/components/BulletBuilder.jsx`
- Create: `tests/components/ProgressBar.test.jsx`
- Create: `tests/components/BulletBuilder.test.jsx`

### ProgressBar

- [ ] **Step 1: Write failing test for ProgressBar**

```jsx
// tests/components/ProgressBar.test.jsx
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
    // Steps 0 and 1 are completed
    expect(screen.getAllByLabelText('completed')).toHaveLength(2)
  })

  it('marks current step', () => {
    render(<ProgressBar steps={STEPS} currentStep={3} />)
    expect(screen.getByLabelText('current')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npm test tests/components/ProgressBar.test.jsx
```
Expected: FAIL

- [ ] **Step 3: Implement ProgressBar**

```jsx
// src/components/ProgressBar.jsx
export default function ProgressBar({ steps, currentStep }) {
  return (
    <nav className="w-full px-6 py-4">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((label, i) => {
          const isCompleted = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* connector line left */}
                {i > 0 && (
                  <div className={`h-0.5 flex-1 ${isCompleted ? 'bg-[var(--accent)]' : 'bg-gray-200'}`} />
                )}
                <div
                  aria-label={isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                    transition-all duration-300
                    ${isCompleted ? 'bg-[var(--accent)] text-white' : ''}
                    ${isCurrent  ? 'bg-[var(--accent-soft)] border-2 border-[var(--accent)] text-[var(--accent)]' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-100 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? '✓' : i + 1}
                </div>
                {/* connector line right */}
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 ${isCompleted ? 'bg-[var(--accent)]' : 'bg-gray-200'}`} />
                )}
              </div>
              <span className={`text-[10px] mt-1 text-center leading-tight
                ${isCurrent ? 'text-[var(--accent)] font-medium' : 'text-gray-400'}
              `}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify pass**

```bash
npm test tests/components/ProgressBar.test.jsx
```
Expected: PASS — 3 tests

### BulletBuilder

- [ ] **Step 5: Write failing test for BulletBuilder**

```jsx
// tests/components/BulletBuilder.test.jsx
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
```

- [ ] **Step 6: Run to verify it fails**

```bash
npm test tests/components/BulletBuilder.test.jsx
```
Expected: FAIL

- [ ] **Step 7: Implement BulletBuilder**

```jsx
// src/components/BulletBuilder.jsx
export default function BulletBuilder({ bullets = [], onChange, prompt }) {
  const update = (i, val) => {
    const next = [...bullets]
    next[i] = val
    onChange(next)
  }
  const remove = (i) => onChange(bullets.filter((_, idx) => idx !== i))
  const add = () => onChange([...bullets, ''])

  return (
    <div className="space-y-2">
      {prompt && (
        <p className="text-sm text-gray-500 mb-3">{prompt}</p>
      )}
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[var(--accent)] font-bold text-sm select-none">·</span>
          <input
            value={b}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`第 ${i + 1} 条描述...`}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm
              focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
          />
          <button
            aria-label="删除"
            onClick={() => remove(i)}
            className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-sm text-[var(--accent)] hover:underline mt-1 flex items-center gap-1"
      >
        + 添加一条
      </button>
    </div>
  )
}
```

- [ ] **Step 8: Implement remaining shared components**

```jsx
// src/components/TextInput.jsx
export default function TextInput({ label, hint, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-[var(--accent)] ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
          focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
      />
    </div>
  )
}
```

```jsx
// src/components/SelectInput.jsx
export default function SelectInput({ label, value, onChange, options }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
          focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  )
}
```

```jsx
// src/components/HighlightTag.jsx
export default function HighlightTag({ children, color = 'yellow' }) {
  const cls = { yellow: 'hl', green: 'hl-green', pink: 'hl-pink', blue: 'hl-blue' }[color]
  return <span className={cls}>{children}</span>
}
```

```jsx
// src/components/StepCard.jsx
import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

const STEPS_META = [
  { label: '基本信息', path: '/step/basic' },
  { label: '教育背景', path: '/step/education' },
  { label: '实习经历', path: '/step/experience' },
  { label: '获奖情况', path: '/step/awards' },
  { label: '技能特长', path: '/step/skills' },
  { label: '确认提交', path: '/step/review' },
]

export default function StepCard({ stepIndex, title, subtitle, children, onNext, nextLabel = '下一步 →', isValid = true }) {
  const navigate = useNavigate()
  const prevPath = stepIndex > 0 ? STEPS_META[stepIndex - 1].path : '/template'

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <ProgressBar steps={STEPS_META.map(s => s.label)} currentStep={stepIndex} />

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16 pt-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 page-enter">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mb-6">{subtitle}</p>}
          <div className="space-y-5">{children}</div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate(prevPath)}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← 返回
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${isValid
              ? 'bg-[var(--accent)] text-white hover:opacity-90 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Run all tests**

```bash
npm test
```
Expected: PASS — all tests

- [ ] **Step 10: Commit**

```bash
git add src/components/ tests/components/
git commit -m "feat: add shared UI components (ProgressBar, StepCard, BulletBuilder, inputs)"
```

---

## Task 5: Home Page

**Files:**
- Modify: `src/pages/Home.jsx`

The home page has the app logo/tagline, two entry cards. Entry 2 is "即将推出" (grayed out, MVP scope excludes it).

- [ ] **Step 1: Implement Home.jsx**

```jsx
// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import HighlightTag from '@/components/HighlightTag'

export default function Home() {
  const navigate = useNavigate()
  const reset = useResumeStore((s) => s.reset)

  const handleStart = () => {
    reset()
    navigate('/template')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[var(--bg)]">
      {/* Logo area */}
      <div className="mb-10 text-center">
        <div className="text-5xl mb-4">📄✨</div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          简历，<HighlightTag color="yellow">轻松</HighlightTag>搞定
        </h1>
        <p className="mt-3 text-gray-500 text-base max-w-xs">
          问答式生成，5 分钟完成一份专属简历
        </p>
      </div>

      {/* Entry cards */}
      <div className="w-full max-w-sm space-y-4">
        {/* Entry 1 */}
        <button
          onClick={handleStart}
          className="w-full bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100
            hover:border-[var(--accent)] hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🚀</span>
            <div>
              <div className="font-semibold text-gray-900 text-base group-hover:text-[var(--accent)] transition-colors">
                从零开始制作简历
              </div>
              <div className="text-sm text-gray-400 mt-1">
                选模板 → 问答填写 → 下载 .docx
              </div>
            </div>
          </div>
        </button>

        {/* Entry 2 — disabled */}
        <div className="w-full bg-gray-50 rounded-2xl p-6 text-left border border-dashed border-gray-200 opacity-60 cursor-not-allowed">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📁</span>
            <div>
              <div className="font-semibold text-gray-400 text-base">
                我已有简历模板
              </div>
              <div className="text-sm text-gray-300 mt-1">
                上传模板智能填充 · 即将推出
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-gray-300 text-center">
        所有数据仅存储在你的浏览器中，不会上传服务器
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Check in browser**

```bash
npm run dev
```
Visit `http://localhost:5173` — verify home page renders, clicking "从零开始" navigates to `/template`

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: implement home page with dual entry"
```

---

## Task 6: Template Picker Page

**Files:**
- Modify: `src/pages/TemplatePicker.jsx`

Shows 3 template cards with mini visual previews. "换一批" re-shuffles. Selecting a card writes `templateId` to store and navigates to `/step/basic`.

- [ ] **Step 1: Implement TemplatePicker.jsx**

```jsx
// src/pages/TemplatePicker.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { TEMPLATES, shuffleTemplates } from '@/constants/templates'

// Mini preview mockup per layout style
function MiniPreview({ layout, accentColor }) {
  const accent = accentColor
  if (layout === 'single') return (
    <div className="w-full h-32 bg-gray-50 rounded-lg p-3 space-y-1.5">
      <div className="w-1/2 h-2.5 rounded-full" style={{ background: accent, opacity: 0.8 }} />
      <div className="w-1/3 h-1.5 bg-gray-200 rounded-full" />
      <div className="h-px bg-gray-200 my-1" />
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
  if (layout === 'sidebar') return (
    <div className="w-full h-32 bg-gray-50 rounded-lg flex overflow-hidden">
      <div className="w-1/4 h-full" style={{ background: accent, opacity: 0.15 }} />
      <div className="flex-1 p-2 space-y-1.5">
        <div className="w-3/4 h-2 rounded-full" style={{ background: accent, opacity: 0.7 }} />
        <div className="h-px bg-gray-200" />
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-gray-200 rounded-full" />
          <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
          <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  )
  // academic
  return (
    <div className="w-full h-32 bg-gray-50 rounded-lg overflow-hidden">
      <div className="h-8 flex items-center px-3" style={{ background: accent, opacity: 0.85 }}>
        <div className="w-1/2 h-2 bg-white rounded-full opacity-80" />
      </div>
      <div className="p-3 space-y-1">
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
        <div className="w-3/5 h-1.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

export default function TemplatePicker() {
  const navigate = useNavigate()
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const [list, setList] = useState(TEMPLATES)
  const [selected, setSelected] = useState(null)

  const handleShuffle = () => setList(shuffleTemplates())

  const handleSelect = (tpl) => {
    setTemplateId(tpl.id)
    navigate('/step/basic')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] px-6 py-10">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-gray-700 mb-6 block transition-colors"
      >
        ← 返回首页
      </button>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">选一个模板</h2>
        <p className="text-gray-400 text-sm mt-1 mb-6">
          先预览一下风格，后续仍可更换
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {list.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelected(tpl.id)}
              className={`
                bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all
                ${selected === tpl.id
                  ? 'border-[var(--accent)] shadow-md'
                  : 'border-transparent shadow-sm hover:border-gray-200'
                }
              `}
            >
              <MiniPreview layout={tpl.previewLayout} accentColor={tpl.accentColor} />
              <div className="mt-3">
                <div className="font-semibold text-gray-900 text-sm">{tpl.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{tpl.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShuffle}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-500
              hover:border-gray-400 transition-colors"
          >
            🔀 换一批
          </button>
          <button
            onClick={() => selected && handleSelect(list.find(t => t.id === selected))}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all
              ${selected
                ? 'bg-[var(--accent)] text-white hover:opacity-90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            选这个 →
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Visit `/template` — 3 cards show, clicking selects (border turns red), "换一批" reorders, "选这个" navigates to `/step/basic`

- [ ] **Step 3: Commit**

```bash
git add src/pages/TemplatePicker.jsx src/constants/templates.js
git commit -m "feat: template picker with mini previews and shuffle"
```

---

## Task 7: Step 1 — Basic Info

**Files:**
- Modify: `src/pages/steps/BasicInfo.jsx`

Fields: 姓名(required), 手机(required), 邮箱(required), 所在城市, 出生年月, 意向岗位, 个人主页链接. Plus a photo tool redirect button.

- [ ] **Step 1: Implement BasicInfo.jsx**

```jsx
// src/pages/steps/BasicInfo.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'

export default function BasicInfo() {
  const navigate = useNavigate()
  const basic = useResumeStore((s) => s.basic)
  const setBasic = useResumeStore((s) => s.setBasic)

  const isValid = basic.name.trim() && basic.phone.trim() && basic.email.trim()

  return (
    <StepCard
      stepIndex={0}
      title="👋 先介绍一下你自己"
      subtitle="带 * 的是必填项，其他可以先跳过"
      onNext={() => navigate('/step/education')}
      isValid={!!isValid}
    >
      <TextInput
        label="姓名" required
        value={basic.name}
        onChange={(v) => setBasic({ name: v })}
        placeholder="请输入你的真实姓名"
      />
      <TextInput
        label="手机号" required type="tel"
        value={basic.phone}
        onChange={(v) => setBasic({ phone: v })}
        placeholder="11 位手机号"
      />
      <TextInput
        label="邮箱" required type="email"
        value={basic.email}
        onChange={(v) => setBasic({ email: v })}
        placeholder="常用邮箱，用于接收 HR 通知"
      />
      <TextInput
        label="所在城市"
        value={basic.city}
        onChange={(v) => setBasic({ city: v })}
        placeholder="如：北京、上海"
      />
      <TextInput
        label="出生年月"
        value={basic.birthdate}
        onChange={(v) => setBasic({ birthdate: v })}
        placeholder="如：2002.08"
      />
      <TextInput
        label="意向岗位"
        value={basic.expectedPosition}
        onChange={(v) => setBasic({ expectedPosition: v })}
        placeholder="如：产品实习生、市场营销"
      />
      <TextInput
        label="个人主页 / GitHub / 作品集"
        value={basic.portfolio}
        onChange={(v) => setBasic({ portfolio: v })}
        placeholder="（选填）粘贴链接"
      />

      {/* Photo tool shortcut */}
      <div className="mt-2 p-4 rounded-xl bg-[var(--accent-soft)] border border-pink-100 flex items-center gap-3">
        <span className="text-2xl">🪪</span>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800">需要处理证件照？</div>
          <div className="text-xs text-gray-500 mt-0.5">用我们的裁剪工具快速搞定</div>
        </div>
        <button
          onClick={() => window.open('about:blank', '_blank')}
          className="text-xs px-3 py-1.5 bg-white border border-pink-200 rounded-lg text-[var(--accent)] font-medium hover:bg-pink-50 transition-colors"
        >
          去裁剪 →
        </button>
      </div>
    </StepCard>
  )
}
```

> **Note:** The `window.open('about:blank', '_blank')` is a placeholder. Replace with the actual URL of the photo cropping tool once available.

- [ ] **Step 2: Verify in browser**

Navigate to `/step/basic` — form renders with all fields, "下一步" is disabled until name/phone/email filled

- [ ] **Step 3: Commit**

```bash
git add src/pages/steps/BasicInfo.jsx
git commit -m "feat: basic info step with photo tool shortcut"
```

---

## Task 8: Step 2 — Education

**Files:**
- Modify: `src/pages/steps/Education.jsx`

- [ ] **Step 1: Implement Education.jsx**

```jsx
// src/pages/steps/Education.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'
import SelectInput from '@/components/SelectInput'

const DEGREE_OPTIONS = ['专科', '本科', '硕士', '博士', '其他']

export default function Education() {
  const navigate = useNavigate()
  const education = useResumeStore((s) => s.education)
  const setEducation = useResumeStore((s) => s.setEducation)

  const isValid = education.school.trim() && education.major.trim()

  return (
    <StepCard
      stepIndex={1}
      title="🎓 教育背景"
      subtitle="填写你的主要学历信息"
      onNext={() => navigate('/step/experience')}
      isValid={!!isValid}
    >
      <TextInput
        label="学校名称" required
        value={education.school}
        onChange={(v) => setEducation({ school: v })}
        placeholder="如：北京大学、复旦大学"
      />
      <TextInput
        label="专业" required
        value={education.major}
        onChange={(v) => setEducation({ major: v })}
        placeholder="如：计算机科学与技术"
      />
      <SelectInput
        label="学历层次"
        value={education.degree}
        onChange={(v) => setEducation({ degree: v })}
        options={DEGREE_OPTIONS}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="入学时间"
          value={education.enrollDate}
          onChange={(v) => setEducation({ enrollDate: v })}
          placeholder="如：2021.09"
        />
        <TextInput
          label="毕业时间"
          value={education.gradDate}
          onChange={(v) => setEducation({ gradDate: v })}
          placeholder="如：2025.06"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="GPA / 绩点"
          value={education.gpa}
          onChange={(v) => setEducation({ gpa: v })}
          hint="选填"
          placeholder="如：3.8 / 4.0"
        />
        <TextInput
          label="专业排名"
          value={education.rank}
          onChange={(v) => setEducation({ rank: v })}
          hint="选填"
          placeholder="如：前 10%"
        />
      </div>
    </StepCard>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/steps/Education.jsx
git commit -m "feat: education background step"
```

---

## Task 9: Step 3 — Experience (Guided Bullet Builder)

**Files:**
- Modify: `src/pages/steps/Experience.jsx`

This step allows adding multiple experience entries. Each entry has basic info + guided BulletBuilder.

- [ ] **Step 1: Implement Experience.jsx**

```jsx
// src/pages/steps/Experience.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'
import BulletBuilder from '@/components/BulletBuilder'

function ExperienceEntry({ entry, onUpdate, onRemove, index }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 space-y-4 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">经历 {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-xs text-gray-300 hover:text-red-400 transition-colors"
        >
          删除
        </button>
      </div>
      <TextInput
        label="经历名称"
        value={entry.name}
        onChange={(v) => onUpdate({ name: v })}
        placeholder="如：字节跳动产品实习 / 学生会副主席"
      />
      <TextInput
        label="机构/公司名称"
        value={entry.organization}
        onChange={(v) => onUpdate({ organization: v })}
        placeholder="如：字节跳动 / XX大学学生会"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="开始时间"
          value={entry.startDate}
          onChange={(v) => onUpdate({ startDate: v })}
          placeholder="2024.06"
        />
        <TextInput
          label="结束时间"
          value={entry.endDate}
          onChange={(v) => onUpdate({ endDate: v })}
          placeholder="2024.09 / 至今"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">你做了什么？取得了什么成果？</p>
        <BulletBuilder
          bullets={entry.bullets}
          onChange={(bullets) => onUpdate({ bullets })}
          prompt="💡 建议分点描述，每条以动词开头，如"负责…""优化…""完成…""
        />
      </div>
    </div>
  )
}

export default function Experience() {
  const navigate = useNavigate()
  const experiences = useResumeStore((s) => s.experiences)
  const addExperience = useResumeStore((s) => s.addExperience)
  const updateExperience = useResumeStore((s) => s.updateExperience)
  const removeExperience = useResumeStore((s) => s.removeExperience)

  return (
    <StepCard
      stepIndex={2}
      title="💼 实习 / 项目 / 活动经历"
      subtitle="可以添加多段经历，建议 2-3 段，重质量"
      onNext={() => navigate('/step/awards')}
      isValid={true}  // optional step
      nextLabel={experiences.length === 0 ? '跳过这步 →' : '下一步 →'}
    >
      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-300">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-sm">还没有添加经历，可以跳过</div>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((entry, i) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            index={i}
            onUpdate={(patch) => updateExperience(entry.id, patch)}
            onRemove={() => removeExperience(entry.id)}
          />
        ))}
      </div>

      <button
        onClick={addExperience}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl
          text-sm text-gray-400 hover:border-[var(--accent)] hover:text-[var(--accent)]
          transition-all"
      >
        + 添加一段经历
      </button>
    </StepCard>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/steps/Experience.jsx
git commit -m "feat: experience step with guided bullet builder"
```

---

## Task 10: Step 4 — Awards

**Files:**
- Modify: `src/pages/steps/Awards.jsx`

- [ ] **Step 1: Implement Awards.jsx**

```jsx
// src/pages/steps/Awards.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'
import SelectInput from '@/components/SelectInput'

const LEVEL_OPTIONS = ['国家级', '省级', '市级', '校级', '院级', '其他']

function AwardEntry({ award, onUpdate, onRemove, index }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 space-y-3 bg-gray-50/50">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">奖项 {index + 1}</span>
        <button onClick={onRemove} className="text-xs text-gray-300 hover:text-red-400 transition-colors">
          删除
        </button>
      </div>
      <TextInput
        label="奖项名称"
        value={award.name}
        onChange={(v) => onUpdate({ name: v })}
        placeholder="如：国家奖学金 / 全国大学生数学建模竞赛一等奖"
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="获奖时间"
          value={award.date}
          onChange={(v) => onUpdate({ date: v })}
          placeholder="如：2023.11"
        />
        <SelectInput
          label="级别"
          value={award.level}
          onChange={(v) => onUpdate({ level: v })}
          options={LEVEL_OPTIONS}
        />
      </div>
      <TextInput
        label="补充说明（选填）"
        value={award.description}
        onChange={(v) => onUpdate({ description: v })}
        placeholder="如：全国 500 强队伍中排名第 3"
      />
    </div>
  )
}

export default function Awards() {
  const navigate = useNavigate()
  const awards = useResumeStore((s) => s.awards)
  const addAward = useResumeStore((s) => s.addAward)
  const updateAward = useResumeStore((s) => s.updateAward)
  const removeAward = useResumeStore((s) => s.removeAward)

  return (
    <StepCard
      stepIndex={3}
      title="🏆 获奖 & 荣誉经历"
      subtitle="奖学金、竞赛、荣誉称号都可以填"
      onNext={() => navigate('/step/skills')}
      isValid={true}
      nextLabel={awards.length === 0 ? '跳过这步 →' : '下一步 →'}
    >
      {awards.length === 0 && (
        <div className="text-center py-8 text-gray-300">
          <div className="text-4xl mb-2">🎖️</div>
          <div className="text-sm">还没有添加奖项，可以跳过</div>
        </div>
      )}

      <div className="space-y-4">
        {awards.map((a, i) => (
          <AwardEntry
            key={a.id}
            award={a}
            index={i}
            onUpdate={(patch) => updateAward(a.id, patch)}
            onRemove={() => removeAward(a.id)}
          />
        ))}
      </div>

      <button
        onClick={addAward}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl
          text-sm text-gray-400 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
      >
        + 添加一个奖项
      </button>
    </StepCard>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/steps/Awards.jsx
git commit -m "feat: awards step"
```

---

## Task 11: Step 5 — Skills & Self-Introduction

**Files:**
- Modify: `src/pages/steps/Skills.jsx`

- [ ] **Step 1: Implement Skills.jsx**

```jsx
// src/pages/steps/Skills.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import StepCard from '@/components/StepCard'
import TextInput from '@/components/TextInput'

export default function Skills() {
  const navigate = useNavigate()
  const skills = useResumeStore((s) => s.skills)
  const setSkills = useResumeStore((s) => s.setSkills)

  return (
    <StepCard
      stepIndex={4}
      title="⚡ 技能 & 自我介绍"
      subtitle="展示你的工具能力和个人亮点"
      onNext={() => navigate('/step/review')}
      isValid={true}
    >
      <TextInput
        label="语言能力"
        value={skills.languages}
        onChange={(v) => setSkills({ languages: v })}
        placeholder="如：英语 CET-6（580 分）、日语 N3"
        hint="多种语言用顿号分隔"
      />
      <TextInput
        label="计算机 / 专业技能"
        value={skills.computerSkills}
        onChange={(v) => setSkills({ computerSkills: v })}
        placeholder="如：Python、Figma、Photoshop、Excel（高级）"
        hint="按熟练度排列，用顿号分隔"
      />
      <TextInput
        label="兴趣爱好（选填）"
        value={skills.hobbies}
        onChange={(v) => setSkills({ hobbies: v })}
        placeholder="如：摄影、跑步、读书"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          自我评价 / 求职信
          <span className="text-gray-400 font-normal ml-1 text-xs">（选填）</span>
        </label>
        <p className="text-xs text-gray-400">简短介绍你的核心优势，2-4 句即可</p>
        <textarea
          value={skills.selfIntro}
          onChange={(e) => setSkills({ selfIntro: e.target.value })}
          placeholder="如：具备扎实的产品思维和数据分析能力，在实习期间独立推动了……"
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
            focus:outline-none focus:border-[var(--accent)] transition-colors bg-white resize-none"
        />
      </div>
    </StepCard>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/steps/Skills.jsx
git commit -m "feat: skills and self-intro step"
```

---

## Task 12: Step 6 — Review Page

**Files:**
- Modify: `src/pages/steps/Review.jsx`

Shows all filled data in a clean summary. Each section has an "编辑" link back to its step. "生成简历" triggers docx generation.

- [ ] **Step 1: Implement Review.jsx**

```jsx
// src/pages/steps/Review.jsx
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import ProgressBar from '@/components/ProgressBar'
import { generateAndDownload } from '@/utils/docxGenerator'
import { useState } from 'react'

const STEPS_LABELS = ['基本信息','教育背景','实习经历','获奖情况','技能特长','确认提交']

function Section({ title, editPath, children }) {
  const navigate = useNavigate()
  return (
    <div className="border border-gray-100 rounded-2xl p-5 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => navigate(editPath)}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          编辑
        </button>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

export default function Review() {
  const navigate = useNavigate()
  const store = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      await generateAndDownload(store)
    } catch (e) {
      setError('生成失败，请检查是否所有必填项均已填写。')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <ProgressBar steps={STEPS_LABELS} currentStep={5} />

      <div className="flex-1 px-4 py-4 pb-32 space-y-4 max-w-xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-bold text-gray-900">✅ 确认你的信息</h2>
          <p className="text-sm text-gray-400 mt-1">检查无误后，点击下方按钮生成简历</p>
        </div>

        <Section title="基本信息" editPath="/step/basic">
          <div className="space-y-1">
            <Row label="姓名" value={store.basic.name} />
            <Row label="手机" value={store.basic.phone} />
            <Row label="邮箱" value={store.basic.email} />
            <Row label="城市" value={store.basic.city} />
            <Row label="意向岗位" value={store.basic.expectedPosition} />
          </div>
        </Section>

        <Section title="教育背景" editPath="/step/education">
          <div className="space-y-1">
            <Row label="学校" value={store.education.school} />
            <Row label="专业" value={store.education.major} />
            <Row label="学历" value={store.education.degree} />
            <Row label="时间" value={store.education.enrollDate && `${store.education.enrollDate} — ${store.education.gradDate || '至今'}`} />
            <Row label="GPA" value={store.education.gpa} />
          </div>
        </Section>

        {store.experiences.length > 0 && (
          <Section title="实习 / 经历" editPath="/step/experience">
            <div className="space-y-3">
              {store.experiences.map((e, i) => (
                <div key={e.id} className="text-sm">
                  <div className="font-medium text-gray-800">{e.name || `经历 ${i+1}`}</div>
                  <div className="text-gray-400 text-xs">{e.organization} · {e.startDate}—{e.endDate}</div>
                  {e.bullets.filter(Boolean).map((b, j) => (
                    <div key={j} className="text-gray-600 text-xs mt-0.5">· {b}</div>
                  ))}
                </div>
              ))}
            </div>
          </Section>
        )}

        {store.awards.length > 0 && (
          <Section title="获奖经历" editPath="/step/awards">
            <div className="space-y-2">
              {store.awards.map((a, i) => (
                <div key={a.id} className="text-sm">
                  <div className="font-medium text-gray-800">{a.name || `奖项 ${i+1}`}</div>
                  <div className="text-gray-400 text-xs">{a.level} · {a.date}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="技能特长" editPath="/step/skills">
          <div className="space-y-1">
            <Row label="语言" value={store.skills.languages} />
            <Row label="技能" value={store.skills.computerSkills} />
            <Row label="爱好" value={store.skills.hobbies} />
          </div>
        </Section>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
        <button
          onClick={() => navigate('/step/skills')}
          className="text-sm text-gray-400 hover:text-gray-700"
        >
          ← 返回
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold text-sm
            hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? '⏳ 生成中...' : '📥 生成并下载简历 (.docx)'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/steps/Review.jsx
git commit -m "feat: review and generate step"
```

---

## Task 13: docxGenerator Utility + Tests

**Files:**
- Create: `src/utils/docxGenerator.js`
- Create: `tests/utils/docxGenerator.test.js`

- [ ] **Step 1: Write failing tests**

```js
// tests/utils/docxGenerator.test.js
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
```

- [ ] **Step 2: Run to verify fail**

```bash
npm test tests/utils/docxGenerator.test.js
```
Expected: FAIL

- [ ] **Step 3: Implement docxGenerator.js**

```js
// src/utils/docxGenerator.js
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

/**
 * Build the flat data object that docxtemplater will use to fill placeholders.
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
```

- [ ] **Step 4: Run tests**

```bash
npm test tests/utils/docxGenerator.test.js
```
Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add src/utils/docxGenerator.js tests/utils/docxGenerator.test.js
git commit -m "feat: docx generator utility with buildTemplateData"
```

---

## Task 14: Create .docx Templates

**Files:**
- Create: `scripts/create-templates.mjs`
- Create: `public/templates/job-general.docx` (generated)
- Create: `public/templates/club-apply.docx` (generated)
- Create: `public/templates/postgrad-apply.docx` (generated)

- [ ] **Step 1: Install docx package (template builder only, dev dep)**

```bash
npm install -D docx
```

- [ ] **Step 2: Create scripts/create-templates.mjs**

```js
// scripts/create-templates.mjs
// Run with: node scripts/create-templates.mjs
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  convertInchesToTwip, TableLayoutType,
} from 'docx'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/templates')
mkdirSync(OUT, { recursive: true })

// ─── shared helpers ────────────────────────────────────────────────────────

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

const bullet = (placeholder) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text: placeholder, size: 20 })],
  })

// ─── Template 1: 求职通用版 (single column, accent #C0392B) ──────────────

async function makeJobGeneral() {
  const ACCENT = 'C0392B'
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: convertInchesToTwip(0.8), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(0.9), right: convertInchesToTwip(0.9) } } },
      children: [
        // Header: Name + contact
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: '{name}', bold: true, size: 52, color: ACCENT })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({ text: '📱 {phone}   |   ✉ {email}   |   📍 {city}', size: 20, color: '555555' }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: '意向岗位：{expectedPosition}', size: 20, color: '555555' })],
        }),
        HR,

        // Education
        sectionTitle('教育背景', ACCENT),
        field('学校', '{school}'),
        field('专业', '{major}（{degree}）'),
        field('时间', '{eduDates}'),
        field('GPA', '{gpa}　排名：{rank}'),
        HR,

        // Experiences loop
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

        // Awards
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

        // Skills
        sectionTitle('技能特长', ACCENT),
        field('语言', '{languages}'),
        field('技能', '{computerSkills}'),
        field('兴趣', '{hobbies}'),

        // Self intro
        sectionTitle('自我评价', ACCENT),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{selfIntro}', size: 20 })] }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  writeFileSync(resolve(OUT, 'job-general.docx'), buffer)
  console.log('✅ job-general.docx created')
}

// ─── Template 2: 社团/部门申请版 (left color bar) ────────────────────────

async function makeClubApply() {
  const ACCENT = '2E7D32'
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: convertInchesToTwip(0.8), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(0.6), right: convertInchesToTwip(0.9) } } },
      children: [
        new Table({
          layout: TableLayoutType.FIXED,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE } },
          rows: [new TableRow({
            children: [
              // Left sidebar
              new TableCell({
                width: { size: 28, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.SOLID, color: 'E8F5E9' },
                children: [
                  new Paragraph({ spacing: { before: 200, after: 120 }, children: [new TextRun({ text: '{name}', bold: true, size: 36, color: ACCENT })] }),
                  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{expectedPosition}', size: 20, color: '555555' })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '📱 {phone}', size: 18, color: '555555' })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '✉ {email}', size: 18, color: '555555' })] }),
                  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '📍 {city}', size: 18, color: '555555' })] }),
                  new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '技能', bold: true, size: 22, color: ACCENT })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{languages}', size: 18 })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{computerSkills}', size: 18 })] }),
                  new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '兴趣爱好', bold: true, size: 22, color: ACCENT })] }),
                  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{hobbies}', size: 18 })] }),
                ],
              }),
              // Right main content
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
                  new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: '{name}  ·  {organization}  {dates}', bold: true, size: 22, color: '333333' })] }),
                  new Paragraph({ children: [new TextRun({ text: '{bulletsText}', size: 20 })] }),
                  new Paragraph({ children: [new TextRun({ text: '{/experiences}', size: 1, color: 'FFFFFF' })] }),
                  sectionTitle('获奖荣誉', ACCENT),
                  new Paragraph({ children: [new TextRun({ text: '{#awards}', size: 1, color: 'FFFFFF' })] }),
                  new Paragraph({ bullet: { level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: '{levelAndName}　{date}', size: 20 })] }),
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

// ─── Template 3: 保研/留学申请版 (academic, top bar) ─────────────────────

async function makePostgradApply() {
  const ACCENT = '1565C0'
  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: convertInchesToTwip(0.7), bottom: convertInchesToTwip(0.8), left: convertInchesToTwip(1), right: convertInchesToTwip(1) } } },
      children: [
        // Top header band
        new Table({
          layout: TableLayoutType.FIXED,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE } },
          rows: [new TableRow({
            children: [new TableCell({
              shading: { type: ShadingType.SOLID, color: '1565C0' },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 160, after: 80 }, children: [new TextRun({ text: '{name}', bold: true, size: 52, color: 'FFFFFF' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: '{phone}   |   {email}   |   {city}   |   {portfolio}', size: 18, color: 'E3F2FD' })] }),
              ],
            })],
          })],
        }),

        // Academic profile
        sectionTitle('学术背景', ACCENT),
        field('学校', '{school}'),
        field('专业', '{major}（{degree}）'),
        field('学习时间', '{eduDates}'),
        field('GPA / 绩点', '{gpa}　专业排名：{rank}'),
        HR,

        // Research/Experience
        sectionTitle('科研 / 项目经历', ACCENT),
        new Paragraph({ children: [new TextRun({ text: '{#experiences}', size: 1, color: 'FFFFFF' })] }),
        new Paragraph({ spacing: { before: 180, after: 60 }, children: [new TextRun({ text: '{name}', bold: true, size: 22, color: '333333' })] }),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: '{organization}　{dates}', size: 20, color: '888888' })] }),
        new Paragraph({ children: [new TextRun({ text: '{bulletsText}', size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '{/experiences}', size: 1, color: 'FFFFFF' })] }),
        HR,

        // Awards
        sectionTitle('奖项与荣誉', ACCENT),
        new Paragraph({ children: [new TextRun({ text: '{#awards}', size: 1, color: 'FFFFFF' })] }),
        new Paragraph({ bullet: { level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: '{levelAndName}　{date}　{description}', size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: '{/awards}', size: 1, color: 'FFFFFF' })] }),
        HR,

        // Skills
        sectionTitle('语言与技能', ACCENT),
        field('语言能力', '{languages}'),
        field('专业技能', '{computerSkills}'),
        HR,

        // Self intro / personal statement
        sectionTitle('个人陈述', ACCENT),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '{selfIntro}', size: 20 })] }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  writeFileSync(resolve(OUT, 'postgrad-apply.docx'), buffer)
  console.log('✅ postgrad-apply.docx created')
}

// Run all
await makeJobGeneral()
await makeClubApply()
await makePostgradApply()
console.log('\n🎉 All templates generated in public/templates/')
```

- [ ] **Step 3: Run the script**

```bash
node scripts/create-templates.mjs
```
Expected output:
```
✅ job-general.docx created
✅ club-apply.docx created
✅ postgrad-apply.docx created

🎉 All templates generated in public/templates/
```

- [ ] **Step 4: Verify files exist**

```bash
ls -lh public/templates/
```
Expected: 3 `.docx` files, each > 5KB

- [ ] **Step 5: Commit**

```bash
git add scripts/create-templates.mjs public/templates/
git commit -m "feat: add docx template generator script and 3 base templates"
```

---

## Task 15: Vercel Deploy Config + Final Polish

**Files:**
- Create: `vercel.json`
- Modify: `vite.config.js` (build output sanity check)

- [ ] **Step 1: Create vercel.json for SPA routing**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Run full test suite**

```bash
npm test
```
Expected: All tests PASS

- [ ] **Step 3: Build to verify no errors**

```bash
npm run build
```
Expected: `dist/` folder created, no TypeScript/lint errors

- [ ] **Step 4: Smoke test the build**

```bash
npm run preview
```
Visit `http://localhost:4173` — verify home page loads, navigate through all steps end-to-end

- [ ] **Step 5: Final commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel SPA routing config"
```

---

## Task 16: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
# Create a GitHub repo named "resume-generator" (do this in GitHub UI first)
git remote add origin https://github.com/<your-username>/resume-generator.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to https://vercel.com/new
2. Import the `resume-generator` GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy**

- [ ] **Step 3: Update photo crop tool URL**

In `src/pages/steps/BasicInfo.jsx`, replace:
```js
window.open('about:blank', '_blank')
```
With the actual URL of the photo cropping tool:
```js
window.open('YOUR_PHOTO_CROP_TOOL_URL', '_blank')
```

- [ ] **Step 4: Commit URL update**

```bash
git add src/pages/steps/BasicInfo.jsx
git commit -m "fix: set actual photo crop tool URL"
git push
```

---

## Self-Review

### Spec Coverage

| Requirement | Implemented in |
|---|---|
| 问答式生成简历 | Tasks 7–11 (6 step pages) |
| 简历用途选择 | TemplatePicker (template selection implies purpose) |
| 3 款简历模板选择 + 换一批 | Task 6 + Task 14 |
| 模板预览 | MiniPreview in TemplatePicker |
| 分模块问答（一页一模块） | StepCard + 6 step pages |
| 基本信息、学校、经历、获奖 | Tasks 7, 8, 9, 10 |
| 鼓励分点作答 | BulletBuilder in Experience + Awards |
| 生成可编辑 .docx | Task 13 + 14 |
| 证件照工具跳转窗口 | BasicInfo photo crop button |
| 静态部署（Vercel） | Task 15 + vercel.json |
| 小红书简约风 + 荧光笔 | index.css tokens + HighlightTag + StepCard styling |
| 填写过程轻松流畅 | Progress bar, animations, skip-able steps |

### Placeholder Scan

No TBD/TODO items in code tasks. Photo crop URL is flagged in Task 16 Step 3 for explicit update.

### Type Consistency

- `buildTemplateData` returns `experiences[].bulletsText` — matched in template `{bulletsText}`
- `buildTemplateData` returns `awards[].levelAndName` — matched in template `{levelAndName}`
- Store `experiences[].bullets` (string[]) → joined to `bulletsText` (string) in generator ✓
- `STEPS_META` in StepCard matches the 6 routes defined in App.jsx ✓
