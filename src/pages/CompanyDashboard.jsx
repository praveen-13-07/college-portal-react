import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

// =================== CompanyDashboard ===================
// Built to match the existing neo-brutalism design system in
// src/neo_brutalism.css (.job-post-form, .manage-jobs-list,
// .table-container/.data-table, .analytics-card, .bar-row/.bar-fill,
// .settings-card, etc.) and reuses the existing Sidebar component.
//
// Data model (extends what LoginPage.jsx already established):
//   localStorage['companies']    -> array set up by LoginPage.jsx
//   localStorage['jobs']         -> array of jobs posted by companies
//   localStorage['applications'] -> array of applications from students
//
// NOTE: LoginPage.jsx does not currently persist a "logged in" session key
// when a company logs in. To avoid touching LoginPage.jsx, this page falls
// back to the most recently registered company in localStorage when no
// session marker ('currentCompanyName') is present.

function getCurrentCompany() {
    const companies = JSON.parse(localStorage.getItem('companies')) || []
    const currentName = sessionStorage.getItem('currentCompanyName')
    if (currentName) {
        const found = companies.find(c => c.name === currentName)
        if (found) return found
    }
    return companies.length ? companies[companies.length - 1] : null
}

function getJobs() {
    return JSON.parse(localStorage.getItem('jobs')) || []
}

function getApplications() {
    return JSON.parse(localStorage.getItem('applications')) || []
}

function CompanyDashboard() {
    const navigate = useNavigate()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const [company, setCompany] = useState(getCurrentCompany())
    const [jobs, setJobs] = useState(getJobs())
    const [applications, setApplications] = useState(getApplications())

    const [jobForm, setJobForm] = useState({
        title: '', description: '', location: '', salary: '', type: 'Full-time'
    })
    const [jobMsg, setJobMsg] = useState({ text: '', isError: true })

    const [settingsForm, setSettingsForm] = useState({
        name: company?.name || '',
        email: company?.email || ''
    })
    const [settingsMsg, setSettingsMsg] = useState({ text: '', isError: true })

    useEffect(() => {
        setJobs(getJobs())
        setApplications(getApplications())
    }, [activeSection])

    const myJobs = jobs.filter(j => company && j.companyName === company.name)
    const myJobIds = myJobs.map(j => j.id)
    const myApplicants = applications.filter(a => myJobIds.includes(a.jobId))

    function handleLogout() {
        sessionStorage.removeItem('currentCompanyName')
        navigate('/')
    }

    function handlePostJob(e) {
        e.preventDefault()
        if (!company) {
            setJobMsg({ text: 'No company profile found. Please log in again.', isError: true })
            return
        }
        if (!jobForm.title || !jobForm.description) {
            setJobMsg({ text: 'Job title and description are required!', isError: true })
            return
        }
        const allJobs = JSON.parse(localStorage.getItem('jobs')) || []
        const newJob = {
            id: `job_${Date.now()}`,
            companyName: company.name,
            title: jobForm.title,
            description: jobForm.description,
            location: jobForm.location,
            salary: jobForm.salary,
            type: jobForm.type,
            postedDate: new Date().toLocaleDateString()
        }
        allJobs.push(newJob)
        localStorage.setItem('jobs', JSON.stringify(allJobs))
        setJobs(allJobs)
        setJobForm({ title: '', description: '', location: '', salary: '', type: 'Full-time' })
        setJobMsg({ text: 'Job posted successfully!', isError: false })
    }

    function handleDeleteJob(jobId) {
        const allJobs = (JSON.parse(localStorage.getItem('jobs')) || []).filter(j => j.id !== jobId)
        localStorage.setItem('jobs', JSON.stringify(allJobs))
        setJobs(allJobs)
    }

    function handleApplicantStatus(appId, status) {
        const allApps = (JSON.parse(localStorage.getItem('applications')) || []).map(a =>
            a.id === appId ? { ...a, status } : a
        )
        localStorage.setItem('applications', JSON.stringify(allApps))
        setApplications(allApps)
    }

    function handleSettingsSave(e) {
        e.preventDefault()
        if (!company) {
            setSettingsMsg({ text: 'No company profile found.', isError: true })
            return
        }
        const companies = JSON.parse(localStorage.getItem('companies')) || []
        const updated = companies.map(c =>
            c.name === company.name ? { ...c, email: settingsForm.email } : c
        )
        localStorage.setItem('companies', JSON.stringify(updated))
        setCompany(updated.find(c => c.name === company.name))
        setSettingsMsg({ text: 'Settings saved successfully!', isError: false })
    }

    const menuItems = [
        {
            id: 'menu-home',
            label: 'Dashboard',
            icon: 'fa-solid fa-house',
            onClick: () => { setActiveSection('home'); setSidebarOpen(false) }
        },
        {
            id: 'menu-post',
            label: 'Post Job',
            icon: 'fa-solid fa-square-plus',
            onClick: () => { setActiveSection('post'); setSidebarOpen(false) }
        },
        {
            id: 'menu-manage',
            label: 'Manage Jobs',
            icon: 'fa-solid fa-list-check',
            onClick: () => { setActiveSection('manage'); setSidebarOpen(false) }
        },
        {
            id: 'menu-applicants',
            label: 'Applicants',
            icon: 'fa-solid fa-users',
            onClick: () => { setActiveSection('applicants'); setSidebarOpen(false) }
        },
        {
            id: 'menu-analytics',
            label: 'Analytics',
            icon: 'fa-solid fa-chart-simple',
            onClick: () => { setActiveSection('analytics'); setSidebarOpen(false) }
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
        return 'badge badge-orange'
    }

    const maxApplicantsForJob = Math.max(1, ...myJobs.map(j => myApplicants.filter(a => a.jobId === j.id).length))

    return (
        <>
            <Sidebar title="Company Portal" menuItems={menuItems} sidebarOpen={sidebarOpen} />

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
                            <h1>{company?.name || 'Company Dashboard'}</h1>
                            <p>Manage your job postings and applicants</p>
                        </div>
                    </div>

                    <div className="user-actions">
                        <div className="notification-icon">
                            <i className="fa-solid fa-bell"></i>
                            {myApplicants.length > 0 && <span className="dot"></span>}
                        </div>
                        <div className="profile-circle" onClick={() => setProfileOpen(true)}>
                            <i className="fa-solid fa-building" style={{ color: 'var(--yellow)' }}></i>
                        </div>
                    </div>
                </div>

                {activeSection === 'home' && (
                    <div className="dashboard-home">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon blue"><i className="fa-solid fa-briefcase"></i></div>
                                <div className="stat-info">
                                    <h3>{myJobs.length}</h3>
                                    <p>Jobs Posted</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon green"><i className="fa-solid fa-users"></i></div>
                                <div className="stat-info">
                                    <h3>{myApplicants.length}</h3>
                                    <p>Total Applicants</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon orange"><i className="fa-solid fa-hourglass-half"></i></div>
                                <div className="stat-info">
                                    <h3>{myApplicants.filter(a => (a.status || 'Pending') === 'Pending').length}</h3>
                                    <p>Pending Review</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-activity">
                            <h2>Recent Applicants</h2>
                            <div className="activity-list">
                                {myApplicants.length === 0 && (
                                    <div className="activity-item">
                                        <p>No applicants yet.</p>
                                    </div>
                                )}
                                {myApplicants.slice(-5).reverse().map(app => (
                                    <div className="activity-item" key={app.id}>
                                        <p><strong>{app.fullname || app.studentUsername}</strong> applied for {app.jobTitle}</p>
                                        <span>{app.appliedDate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'post' && (
                    <div className="job-post-form">
                        <h3>Post a New Job</h3>
                        {jobMsg.text && (
                            <div className={jobMsg.isError ? 'form-msg msg-error' : 'form-msg msg-success'}>
                                {jobMsg.text}
                            </div>
                        )}
                        <form className="post-job-form" onSubmit={handlePostJob}>
                            <div className="apply-form-grid">
                                <div className="apply-form-group">
                                    <label>Job Title</label>
                                    <input
                                        type="text"
                                        value={jobForm.title}
                                        onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="apply-form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={jobForm.location}
                                        onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                                    />
                                </div>
                                <div className="apply-form-group">
                                    <label>Salary</label>
                                    <input
                                        type="text"
                                        value={jobForm.salary}
                                        onChange={e => setJobForm({ ...jobForm, salary: e.target.value })}
                                    />
                                </div>
                                <div className="apply-form-group">
                                    <label>Job Type</label>
                                    <select
                                        value={jobForm.type}
                                        onChange={e => setJobForm({ ...jobForm, type: e.target.value })}
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                                <div className="apply-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Description</label>
                                    <textarea
                                        value={jobForm.description}
                                        onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <button type="submit" className="apply-submit-btn">Post Job</button>
                        </form>
                    </div>
                )}

                {activeSection === 'manage' && (
                    <>
                        <div className="page-header">
                            <h2>Manage Jobs</h2>
                            <p>Jobs your company has posted</p>
                        </div>
                        <div className="manage-jobs-list table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Posted</th>
                                        <th>Applicants</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myJobs.length === 0 && (
                                        <tr><td colSpan="6">You haven't posted any jobs yet.</td></tr>
                                    )}
                                    {myJobs.map(job => (
                                        <tr key={job.id}>
                                            <td>{job.title}</td>
                                            <td>{job.location || '—'}</td>
                                            <td>{job.type}</td>
                                            <td>{job.postedDate}</td>
                                            <td>{myApplicants.filter(a => a.jobId === job.id).length}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="table-btn"
                                                    onClick={() => handleDeleteJob(job.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeSection === 'applicants' && (
                    <>
                        <div className="page-header">
                            <h2>Applicants</h2>
                            <p>Students who applied to your job postings</p>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Job</th>
                                        <th>Email</th>
                                        <th>Applied On</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myApplicants.length === 0 && (
                                        <tr><td colSpan="6">No applicants yet.</td></tr>
                                    )}
                                    {myApplicants.map(app => (
                                        <tr key={app.id}>
                                            <td>{app.fullname || app.studentUsername}</td>
                                            <td>{app.jobTitle}</td>
                                            <td>{app.email || '—'}</td>
                                            <td>{app.appliedDate}</td>
                                            <td><span className={statusBadgeClass(app.status)}>{app.status || 'Pending'}</span></td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="table-btn"
                                                    onClick={() => handleApplicantStatus(app.id, 'Accepted')}
                                                >
                                                    Accept
                                                </button>
                                                {' '}
                                                <button
                                                    type="button"
                                                    className="table-btn"
                                                    onClick={() => handleApplicantStatus(app.id, 'Rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeSection === 'analytics' && (
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <h3>Applicants per Job</h3>
                            <div className="bar-row-wrap">
                                {myJobs.length === 0 && <p>No jobs posted yet.</p>}
                                {myJobs.map(job => {
                                    const count = myApplicants.filter(a => a.jobId === job.id).length
                                    const pct = Math.round((count / maxApplicantsForJob) * 100)
                                    return (
                                        <div className="bar-row" key={job.id}>
                                            <span className="bar-label">{job.title}</span>
                                            <div className="bar-track">
                                                <div className="bar-fill blue-bar" style={{ width: `${pct}%` }}>{count}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="analytics-card">
                            <h3>Application Status</h3>
                            <div className="bar-row">
                                <span className="bar-label">Pending</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill orange-bar"
                                        style={{ width: myApplicants.length ? `${Math.round((myApplicants.filter(a => (a.status || 'Pending') === 'Pending').length / myApplicants.length) * 100)}%` : '0%' }}
                                    >
                                        {myApplicants.filter(a => (a.status || 'Pending') === 'Pending').length}
                                    </div>
                                </div>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">Accepted</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill green-bar"
                                        style={{ width: myApplicants.length ? `${Math.round((myApplicants.filter(a => a.status === 'Accepted').length / myApplicants.length) * 100)}%` : '0%' }}
                                    >
                                        {myApplicants.filter(a => a.status === 'Accepted').length}
                                    </div>
                                </div>
                            </div>
                            <div className="bar-row">
                                <span className="bar-label">Rejected</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill purple-bar"
                                        style={{ width: myApplicants.length ? `${Math.round((myApplicants.filter(a => a.status === 'Rejected').length / myApplicants.length) * 100)}%` : '0%' }}
                                    >
                                        {myApplicants.filter(a => a.status === 'Rejected').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'settings' && (
                    <div className="settings-grid">
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <i className="fa-solid fa-building"></i>
                                <h3>Company Profile</h3>
                            </div>
                            {settingsMsg.text && (
                                <div className={settingsMsg.isError ? 'form-msg msg-error' : 'form-msg msg-success'}>
                                    {settingsMsg.text}
                                </div>
                            )}
                            <form className="settings-form" onSubmit={handleSettingsSave}>
                                <label>Company Name</label>
                                <input type="text" value={settingsForm.name} disabled />

                                <label>Email</label>
                                <input
                                    type="email"
                                    value={settingsForm.email}
                                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                />

                                <button type="submit" className="settings-save-btn">Save Changes</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className={profileOpen ? 'panel-backdrop open' : 'panel-backdrop'} onClick={() => setProfileOpen(false)}></div>
            <div className={profileOpen ? 'profile-panel open' : 'profile-panel'}>
                <div className="profile-panel-header">
                    <h3>Company Profile</h3>
                    <button type="button" className="panel-close-btn" onClick={() => setProfileOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="panel-photo-wrap">
                    <div className="panel-photo">
                        <i className="fa-solid fa-building panel-photo-icon"></i>
                    </div>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Name</span>
                    <span className="panel-info-value">{company?.name || '—'}</span>
                </div>
                <div className="panel-info-row">
                    <span className="panel-info-label">Email</span>
                    <span className="panel-info-value">{company?.email || '—'}</span>
                </div>
            </div>
        </>
    )
}

export default CompanyDashboard