import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// =================== ApplyJobPage ===================
// Built to match the existing .apply-page / .apply-header / .apply-form-card
// / .apply-form-grid / .apply-form-group / .apply-submit-btn /
// .apply-success-msg / .apply-error-msg classes already defined in
// src/neo_brutalism.css.
//
// Reached via /apply?jobId=<id> (StudentDashboard's "Apply Now" button
// navigates here with the job id in the query string, since the /apply
// route in App.jsx does not take a path param).
//
// Data model: reads the job from localStorage['jobs'] and, on submit,
// appends a record to localStorage['applications'] (see StudentDashboard.jsx
// / CompanyDashboard.jsx for the read side of this same array).

function getCurrentStudent() {
    const students = JSON.parse(localStorage.getItem('students')) || []
    const currentUsername = sessionStorage.getItem('currentStudentUsername')
    if (currentUsername) {
        const found = students.find(s => s.username === currentUsername)
        if (found) return found
    }
    return students.length ? students[students.length - 1] : null
}

function ApplyJobPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get('jobId')

    const jobs = JSON.parse(localStorage.getItem('jobs')) || []
    const job = jobs.find(j => j.id === jobId)
    const student = getCurrentStudent()

    const [form, setForm] = useState({
        fullname: student?.fullname || '',
        department: student?.department || '',
        phone: student?.phone || '',
        email: student?.email || '',
        coverletter: ''
    })
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')

        if (!job) {
            setErrorMsg('This job could not be found. It may have been removed.')
            return
        }
        if (!form.fullname || !form.email || !form.phone) {
            setErrorMsg('Please fill in your name, email, and phone number.')
            return
        }

        const applications = JSON.parse(localStorage.getItem('applications')) || []
        applications.push({
            id: `app_${Date.now()}`,
            jobId: job.id,
            jobTitle: job.title,
            companyName: job.companyName,
            studentUsername: student?.username || '',
            fullname: form.fullname,
            department: form.department,
            phone: form.phone,
            email: form.email,
            coverletter: form.coverletter,
            appliedDate: new Date().toLocaleDateString(),
            status: 'Pending'
        })
        localStorage.setItem('applications', JSON.stringify(applications))

        setSuccessMsg('Application submitted successfully!')
        setTimeout(() => {
            navigate('/student')
        }, 1500)
    }

    return (
        <div className="apply-page">
            <div className="apply-header">
                <button type="button" className="apply-back-btn" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>
                {job?.companyName && (
                    <img className="apply-company-logo" src="" alt="" />
                )}
                <div>
                    <h2 className="apply-job-title">{job ? job.title : 'Job Not Found'}</h2>
                    <p className="apply-company-name">{job ? job.companyName : 'This job may have been removed'}</p>
                </div>
            </div>

            <div className="apply-form-card">
                <h2>Application Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="apply-form-grid">
                        <div className="apply-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={form.fullname}
                                onChange={e => setForm({ ...form, fullname: e.target.value })}
                            />
                        </div>
                        <div className="apply-form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={form.department}
                                onChange={e => setForm({ ...form, department: e.target.value })}
                            />
                        </div>
                        <div className="apply-form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                        <div className="apply-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div className="apply-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Cover Letter</label>
                            <textarea
                                value={form.coverletter}
                                onChange={e => setForm({ ...form, coverletter: e.target.value })}
                                placeholder="Tell the company why you're a good fit..."
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="apply-submit-btn">Submit Application</button>

                    {successMsg && <div className="apply-success-msg" style={{ display: 'block' }}>{successMsg}</div>}
                    {errorMsg && <div className="apply-error-msg" style={{ display: 'block' }}>{errorMsg}</div>}
                </form>
            </div>
        </div>
    )
}

export default ApplyJobPage