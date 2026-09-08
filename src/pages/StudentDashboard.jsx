import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

// =================== StudentDashboard ===================
// Built to match the existing neo-brutalism design system in
// src/neo_brutalism.css (.dashboard-home, .stat-card, .dashboard-jobs,
// .job-card, .table-container/.data-table, .profile-panel, .settings-card,
// .student-info-form, etc.) and reuses the existing Sidebar component.
//
// Data model (extends what LoginPage.jsx already established):
//   localStorage['students']     -> array set up by LoginPage.jsx
//   localStorage['jobs']         -> array of jobs posted by companies
//   localStorage['applications'] -> array of applications submitted by students
//
// NOTE: LoginPage.jsx does not currently persist a "logged in" session key
// when a student logs in. To avoid touching LoginPage.jsx, this page falls
// back to the most recently registered student in localStorage when no
// session marker ('currentStudentUsername') is present.

function getCurrentStudent() {
    const students = JSON.parse(localStorage.getItem('students')) || []
    const currentUsername = sessionStorage.getItem('currentStudentUsername')
    if (currentUsername) {
        const found = students.find(s => s.username === currentUsername)
        if (found) return found
    }
    return students.length ? students[students.length - 1] : null
}

function getJobs() {
    return JSON.parse(localStorage.getItem('jobs')) || []
}

function getApplications() {
    return JSON.parse(localStorage.getItem('applications')) || []
}

function StudentDashboard() {
    const navigate = useNavigate()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const [student, setStudent] = useState(getCurrentStudent())
    const [jobs, setJobs] = useState(getJobs())
    const [applications, setApplications] = useState(getApplications())
    const [searchTerm, setSearchTerm] = useState('')

    const [profileForm, setProfileForm] = useState({
        fullname: student?.fullname || '',
        department: student?.department || '',
        phone: student?.phone || '',
        email: student?.email || ''
    })
    const [profileMsg, setProfileMsg] = useState({ text: '', isError: true })

    useEffect(() => {
        setJobs(getJobs())
        setApplications(getApplications())
    }, [activeSection])

    const myApplications = applications.filter(
        a => student && a.studentUsername === student.username
    )

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function handleLogout() {
        sessionStorage.removeItem('currentStudentUsername')
        navigate('/')
    }

    function handleApply(jobId) {
        navigate(`/apply?jobId=${encodeURIComponent(jobId)}`)
    }

    function handleProfileSave(e) {
        e.preventDefault()
        if (!student) {
            setProfileMsg({ text: 'No student profile found.', isError: true })
            return
        }
        const students = JSON.parse(localStorage.getItem('students')) || []
        const updated = students.map(s =>
            s.username === student.username ? { ...s, ...profileForm } : s
        )
        localStorage.setItem('students', JSON.stringify(updated))
        const newCurrent = updated.find(s => s.username === student.username)
        setStudent(newCurrent)
        setProfileMsg({ text: 'Profile updated successfully!', isError: false })
    }

    const menuItems = [
        {
            id: 'menu-home',
            label: 'Dashboard',
            icon: 'fa-solid fa-house',
            onClick: () => { setActiveSection('home'); setSidebarOpen(false) }
        },
        {
            id: 'menu-jobs',
            label: 'Browse Jobs',
            icon: 'fa-solid fa-briefcase',
            onClick: () => { setActiveSection('jobs'); setSidebarOpen(false) }
        },
        {
            id: 'menu-applications',
            label: 'My Applications',
            icon: 'fa-solid fa-file-lines',
            onClick: () => { setActiveSection('applications'); setSidebarOpen(false) }
        },
        {
            id: 'menu-settings',
            label: 'Settings',
            icon: 'fa-solid fa-gear',
            onClick: () => { setActiveSection('settings'); setSidebarOpen(false) }
        },
        {
            id: 'menu-logout',
            label: 'Logout',
            icon: 'fa-solid fa-right-from-bracket',
            onClick: handleLogout
        }
    ]

    function statusBadgeClass(status) {
        if (status === 'Accepted') return 'badge badge-green'
        if (status === 'Rejected') return 'badge badge-orange'
        return 'badge badge-orange'
    }

    return (
        <>
            <Sidebar title="Student Portal" menuItems={menuItems} sidebarOpen={sidebarOpen} />

            <div className={sidebarOpen ? 'main-content sidebar-active-shift' : 'main-content'}>
                <div className="top-navbar">
                    <div className="welcome-section">
                        <button
                            type="button"
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div>
                            <h1>Welcome{student?.fullname ? `, ${student.fullname}` : ''}</h1>
                            <p>{student?.department || 'Student Dashboard'}</p>
                        </div>
                    </div>

                    <div className="search-container">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="user-actions">
                        <div className="notification-icon">
                            <i className="fa-solid fa-bell"></i>
                            {myApplications.length > 0 && <span className="dot"></span>}
                        </div>
                        <div className="profile-circle" onClick={() => setProfileOpen(true)}>
                            <i className="fa-solid fa-user" style={{ color: 'var(--yellow)' }}></i>
                        </div>
                    </div>
                </div>

                {activeSection === 'home' && (
                    <div className="dashboard-home">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon blue"><i className="fa-solid fa-briefcase"></i></div>
                                <div className="stat-info">
                                    <h3>{jobs.length}</h3>
                                    <p>Jobs Available</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon green"><i className="fa-solid fa-file-lines"></i></div>
                                <div className="stat-info">
                                    <h3>{myApplications.length}</h3>
                                    <p>Applications Sent</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon orange"><i className="fa-solid fa-clock"></i></div>
                                <div className="stat-info">
                                    <h3>{myApplications.filter(a => a.status === 'Pending').length}</h3>
                                    <p>Pending</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-activity">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                {myApplications.length === 0 && (
                                    <div className="activity-item">
                                        <p>No applications yet. Browse jobs to get started!</p>
                                    </div>
                                )}
                                {myApplications.slice(-5).reverse().map(app => (
                                    <div className="activity-item" key={app.id}>
                                        <p>Applied to <strong>{app.jobTitle}</strong> at {app.companyName}</p>
                                        <span>{app.appliedDate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'jobs' && (
                    <>
                        <div className="page-header">
                            <h2>Browse Jobs</h2>
                            <p>Find and apply to open positions</p>
                        </div>
                        <div className="dashboard-jobs">
                            {filteredJobs.length === 0 && (
                                <p style={{ padding: '0 4px' }}>No jobs posted yet. Check back soon!</p>
                            )}
                            {filteredJobs.map(job => (
                                <div className="job-card" key={job.id}>
                                    <div className="job-details">
                                        <h3 className="job-title">{job.title}</h3>
                                        <p><i className="fa-solid fa-building"></i> {job.companyName}</p>
                                        <p><i className="fa-solid fa-location-dot"></i> {job.location || 'Not specified'}</p>
                                        <p><i className="fa-solid fa-sack-dollar"></i> {job.salary || 'Not disclosed'}</p>
                                        <p>{job.description}</p>
                                        <button
                                            type="button"
                                            className="apply-btn"
                                            onClick={() => handleApply(job.id)}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeSection === 'applications' && (
                    <>
                        <div className="page-header">
                            <h2>My Applications</h2>
                            <p>Track the status of your job applications</p>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Applied On</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myApplications.length === 0 && (
                                        <tr><td colSpan="4">You haven't applied to any jobs yet.</td></tr>
                                    )}
                                    {myApplications.map(app => (
                                        <tr key={app.id}>
                                            <td>{app.jobTitle}</td>
                                            <td>{app.companyName}</td>
                                            <td>{app.appliedDate}</td>
                                            <td><span className={statusBadgeClass(app.status)}>{app.status || 'Pending'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeSection === 'settings' && (
                    <div className="student-info-form">
                        <h3>Edit Profile</h3>
                        {profileMsg.text && (
                            <div className={profileMsg.isError ? 'form-msg msg-error' : 'form-msg msg-success'}>
                                {profileMsg.text}
                            </div>
                        )}
                        <form onSubmit={handleProfileSave}>
                            <div className="si-form-grid">
                                <div className="si-form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.fullname}
                                        onChange={e => setProfileForm({ ...profileForm, fullname: e.target.value })}
                                    />
                                </div>
                                <div className="si-form-group">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        value={profileForm.department}
                                        onChange={e => setProfileForm({ ...profileForm, department: e.target.value })}
                                    />
                                </div>
                                <div className="si-form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        value={profileForm.phone}
                                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    />
                                </div>
                                <div className="si-form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="si-submit-btn">Save Changes</button>
                        </form>
                    </div>
                )}
            </div>

            <div className={profileOpen ? 'panel-backdrop open' : 'panel-backdrop'} onClick={() => setProfileOpen(false)}></div>
            <div className={profileOpen ? 'profile-panel open' : 'profile-panel'}>
                <div className="profile-panel-header">
                    <h3>Profile</h3>
                    <button type="button" className="panel-close-btn" onClick={() => setProfileOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="panel-photo-wrap">
                    <div className="panel-photo">
                        <i className="fa-solid fa-user panel-photo-icon"></i>
                    </div>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Name</span>
                    <span className="panel-info-value">{student?.fullname || '—'}</span>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Dept</span>
                    <span className="panel-info-value">{student?.department || '—'}</span>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Phone</span>
                    <span className="panel-info-value">{student?.phone || '—'}</span>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Email</span>
                    <span className="panel-info-value">{student?.email || '—'}</span>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Username</span>
                    <span className="panel-info-value">{student?.username || '—'}</span>
                </div>
            </div>
        </>
    )
}

export default StudentDashboard