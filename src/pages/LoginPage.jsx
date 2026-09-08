import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// =================== LoginPage ===================
// Converted from index.html
// All class names, IDs, localStorage keys, and logic preserved exactly.
// activeView replaces hideForms() / style.display show-one pattern.

function LoginPage() {

    const navigate = useNavigate()

    // Controls which panel is shown — mirrors the original hideForms() + show-one logic
    const [activeView, setActiveView] = useState('loginoptions')

    // Form field states — replace document.getElementById().value reads
    const [studentLoginUsername, setStudentLoginUsername] = useState('')
    const [studentLoginPassword, setStudentLoginPassword] = useState('')

    const [companyLoginName, setCompanyLoginName] = useState('')
    const [companyLoginPassword, setCompanyLoginPassword] = useState('')

    const [studentRegFullname, setStudentRegFullname] = useState('')
    const [studentRegDepartment, setStudentRegDepartment] = useState('')
    const [studentRegPhone, setStudentRegPhone] = useState('')
    const [studentRegUsername, setStudentRegUsername] = useState('')
    const [studentRegEmail, setStudentRegEmail] = useState('')
    const [studentRegPassword, setStudentRegPassword] = useState('')

    const [companyRegName, setCompanyRegName] = useState('')
    const [companyRegEmail, setCompanyRegEmail] = useState('')
    const [companyRegPassword, setCompanyRegPassword] = useState('')

    // Message states — replace showMsg() direct DOM manipulation
    const [studentLoginMsg, setStudentLoginMsg] = useState({ text: '', isError: true })
    const [companyLoginMsg, setCompanyLoginMsg] = useState({ text: '', isError: true })
    const [studentRegMsg, setStudentRegMsg] = useState({ text: '', isError: true })
    const [companyRegMsg, setCompanyRegMsg] = useState({ text: '', isError: true })


    // =================== Show Forms ===================
    function showStudentLogin() {
        setStudentLoginMsg({ text: '', isError: true })
        setActiveView('studentlogin')
    }

    function showCompanyLogin() {
        setCompanyLoginMsg({ text: '', isError: true })
        setActiveView('companylogin')
    }

    function showStudentRegister() {
        setStudentRegMsg({ text: '', isError: true })
        setActiveView('studentregister')
    }

    function showCompanyRegister() {
        setCompanyRegMsg({ text: '', isError: true })
        setActiveView('companyregister')
    }

    function showOptions() {
        // Clear all fields when going back to options — same as original
        setStudentLoginUsername('')
        setStudentLoginPassword('')
        setCompanyLoginName('')
        setCompanyLoginPassword('')
        setStudentRegFullname('')
        setStudentRegDepartment('')
        setStudentRegPhone('')
        setStudentRegUsername('')
        setStudentRegEmail('')
        setStudentRegPassword('')
        setCompanyRegName('')
        setCompanyRegEmail('')
        setCompanyRegPassword('')
        setActiveView('loginoptions')
    }


    // =================== Message Helper ===================
    function showMsg(setter, text, isError = true) {
        setter({ text, isError })
    }


    // =================== Student Registration ===================
    function studentRegister() {
        if (!studentRegUsername || !studentRegPassword) {
            showMsg(setStudentRegMsg, 'Username and password are required!')
            return
        }

        let students = JSON.parse(localStorage.getItem('students')) || []

        if (students.find(s => s.username === studentRegUsername)) {
            showMsg(setStudentRegMsg, 'Username already exists!')
            return
        }

        students.push({
            fullname: studentRegFullname,
            department: studentRegDepartment,
            phone: studentRegPhone,
            email: studentRegEmail,
            username: studentRegUsername,
            password: studentRegPassword
        })
        localStorage.setItem('students', JSON.stringify(students))

        showMsg(setStudentRegMsg, 'Account created! Redirecting to login...', false)

        setTimeout(() => {
            showStudentLogin()
        }, 1500)
    }


    // =================== Student Login ===================
    function studentLogin() {
        let students = JSON.parse(localStorage.getItem('students')) || []
        let found = students.find(s => s.username === studentLoginUsername && s.password === studentLoginPassword)

        if (found) {
            showMsg(setStudentLoginMsg, 'Login successful! Welcome.', false)
            setTimeout(() => {
                navigate('/student')
            }, 1000)
        } else {
            showMsg(setStudentLoginMsg, 'Invalid username or password!')
        }
    }


    // =================== Company Registration ===================
    function companyRegister() {
        if (!companyRegName || !companyRegPassword) {
            showMsg(setCompanyRegMsg, 'Company name and password are required!')
            return
        }

        let companies = JSON.parse(localStorage.getItem('companies')) || []

        if (companies.find(c => c.name === companyRegName)) {
            showMsg(setCompanyRegMsg, 'Company already exists!')
            return
        }

        companies.push({ name: companyRegName, email: companyRegEmail, password: companyRegPassword })
        localStorage.setItem('companies', JSON.stringify(companies))

        showMsg(setCompanyRegMsg, 'Company registered successfully!', false)

        setTimeout(() => {
            showCompanyLogin()
        }, 1500)
    }


    // =================== Company Login ===================
    function companyLogin() {
        let companies = JSON.parse(localStorage.getItem('companies')) || []
        let found = companies.find(c => c.name === companyLoginName && c.password === companyLoginPassword)

        if (found) {
            showMsg(setCompanyLoginMsg, 'Login successful!', false)
            setTimeout(() => {
                navigate('/company')
            }, 1000)
        } else {
            showMsg(setCompanyLoginMsg, 'Invalid company name or password!')
        }
    }


    // =================== Message Renderer ===================
    function MsgBox({ msg }) {
        if (!msg.text) return null
        return (
            <div className={msg.isError ? 'form-msg msg-error' : 'form-msg msg-success'}>
                {msg.text}
            </div>
        )
    }


    return (
        <div id="loginpage">

            {/* ===== Login Options ===== */}
            {activeView === 'loginoptions' && (
                <div className="loginoptions" id="loginoptions">
                    <h2>College Portal</h2>
                    <button type="button" className="studentbtn" onClick={showStudentLogin}>Student</button>
                    <button type="button" className="companybtn" onClick={showCompanyLogin}>Company</button>
                </div>
            )}

            {/* ===== Student Login ===== */}
            {activeView === 'studentlogin' && (
                <div className="studentlogin" id="studentlogin">
                    <h2>Student Login</h2>
                    <MsgBox msg={studentLoginMsg} />

                    <label>Username :</label>
                    <input
                        type="text"
                        id="student_login_username"
                        placeholder="Username"
                        value={studentLoginUsername}
                        onChange={e => setStudentLoginUsername(e.target.value)}
                    />

                    <label>Password :</label>
                    <input
                        type="password"
                        id="student_login_password"
                        placeholder="Password"
                        value={studentLoginPassword}
                        onChange={e => setStudentLoginPassword(e.target.value)}
                    />

                    <button type="button" className="loginbtn" onClick={studentLogin}>Login</button>
                    <button type="button" className="backbtn" onClick={showOptions}>Back</button>

                    <p>
                        Don't have an account?<br />
                        <a href="#" className="registerherebtn" onClick={e => { e.preventDefault(); showStudentRegister() }}> Register here</a>
                    </p>
                </div>
            )}

            {/* ===== Company Login ===== */}
            {activeView === 'companylogin' && (
                <div className="companylogin" id="companylogin">
                    <h2>Company Login</h2>
                    <MsgBox msg={companyLoginMsg} />

                    <label>Company Name :</label>
                    <input
                        type="text"
                        id="company_login_name"
                        placeholder="Company Name"
                        value={companyLoginName}
                        onChange={e => setCompanyLoginName(e.target.value)}
                    />

                    <label>Password :</label>
                    <input
                        type="password"
                        id="company_login_password"
                        placeholder="Password"
                        value={companyLoginPassword}
                        onChange={e => setCompanyLoginPassword(e.target.value)}
                    />

                    <button type="button" className="loginbtn" onClick={companyLogin}>Login</button>
                    <button type="button" className="backbtn" onClick={showOptions}>Back</button>

                    <p>
                        Don't have an account?<br />
                        <a href="#" className="registerherebtn" onClick={e => { e.preventDefault(); showCompanyRegister() }}>Register here</a>
                    </p>
                </div>
            )}

            {/* ===== Student Register ===== */}
            {activeView === 'studentregister' && (
                <div className="studentregister" id="studentregister">
                    <h2>Student Registration</h2>
                    <MsgBox msg={studentRegMsg} />

                    <label>Full Name :</label>
                    <input
                        type="text"
                        id="student_reg_fullname"
                        placeholder="Full Name"
                        value={studentRegFullname}
                        onChange={e => setStudentRegFullname(e.target.value)}
                    />

                    <label>Department :</label>
                    <input
                        type="text"
                        id="student_reg_department"
                        placeholder="Department"
                        value={studentRegDepartment}
                        onChange={e => setStudentRegDepartment(e.target.value)}
                    />

                    <label>Phone Number :</label>
                    <input
                        type="number"
                        id="student_reg_phone"
                        placeholder="Phone Number"
                        value={studentRegPhone}
                        onChange={e => setStudentRegPhone(e.target.value)}
                    />

                    <label>Username :</label>
                    <input
                        type="text"
                        id="student_reg_username"
                        placeholder="Username"
                        value={studentRegUsername}
                        onChange={e => setStudentRegUsername(e.target.value)}
                    />

                    <label>Email :</label>
                    <input
                        type="email"
                        id="student_reg_email"
                        placeholder="Email"
                        value={studentRegEmail}
                        onChange={e => setStudentRegEmail(e.target.value)}
                    />

                    <label>Password :</label>
                    <input
                        type="password"
                        id="student_reg_password"
                        placeholder="Password"
                        value={studentRegPassword}
                        onChange={e => setStudentRegPassword(e.target.value)}
                    />

                    <button type="button" className="registerbtn" onClick={studentRegister}>Create Student Account</button>
                    <button type="button" className="backbtn" onClick={showOptions}>Back</button>

                    <p>
                        Already have an account?<br />
                        <a href="#" className="loginherebtn" onClick={e => { e.preventDefault(); showStudentLogin() }}>Login here</a>
                    </p>
                </div>
            )}

            {/* ===== Company Register ===== */}
            {activeView === 'companyregister' && (
                <div className="companyregister" id="companyregister">
                    <h2>Company Registration</h2>
                    <MsgBox msg={companyRegMsg} />

                    <label>Company Name :</label>
                    <input
                        type="text"
                        id="company_reg_name"
                        placeholder="Company Name"
                        value={companyRegName}
                        onChange={e => setCompanyRegName(e.target.value)}
                    />

                    <label>Email :</label>
                    <input
                        type="email"
                        id="company_reg_email"
                        placeholder="Email"
                        value={companyRegEmail}
                        onChange={e => setCompanyRegEmail(e.target.value)}
                    />

                    <label>Password :</label>
                    <input
                        type="password"
                        id="company_reg_password"
                        placeholder="Password"
                        value={companyRegPassword}
                        onChange={e => setCompanyRegPassword(e.target.value)}
                    />

                    <button type="button" className="registerbtn" onClick={companyRegister}>
                        Register Company <i className="fa-solid fa-arrow-right"></i>
                    </button>
                    <button type="button" className="backbtn" onClick={showOptions}>Back</button>

                    <p>
                        Already have an account? <br />
                        <a href="#" className="loginherebtn" onClick={e => { e.preventDefault(); showCompanyLogin() }}>Login here</a>
                    </p>
                </div>
            )}

        </div>
    )
}

export default LoginPage
