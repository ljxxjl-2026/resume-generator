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
