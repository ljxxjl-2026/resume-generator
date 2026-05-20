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
