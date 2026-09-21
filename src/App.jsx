import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import ApplyJobPage from './pages/ApplyJobPage'

function App() {
  return (
    <BrowserRouter basename="/college-portal-react">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/apply" element={<ApplyJobPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App