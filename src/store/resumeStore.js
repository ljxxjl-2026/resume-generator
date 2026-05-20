import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  templateId: '',
  basic: {
    name: '', phone: '', email: '', city: '',
    birthdate: '', expectedPosition: '', portfolio: '',
    politicalStatus: '共青团员',
    photoDataUrl: '',           // base64 data URL from photo tool
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

export const useResumeStore = create(
  persist(
    (set) => ({
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

      reset: () => {
        _nextId = 1
        set({ ...initialState, experiences: [], awards: [] })
      },
    }),
    {
      name: 'resume-generator-v1',   // localStorage key
      // Only persist data fields, not transient UI state
      partialize: (state) => ({
        templateId: state.templateId,
        basic: state.basic,
        education: state.education,
        experiences: state.experiences,
        awards: state.awards,
        skills: state.skills,
      }),
      // Restore _nextId counter from persisted experience/award ids
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const ids = [
          ...state.experiences.map((e) => e.id),
          ...state.awards.map((a) => a.id),
        ]
        if (ids.length) _nextId = Math.max(...ids) + 1
      },
    }
  )
)
