// Sidebar.jsx
// Converted from the sidebar markup shared by student_main.html and company_main.html.
// Props: title (string), menuItems (array), sidebarOpen (bool)
// All class names and IDs preserved exactly.

function Sidebar({ title, menuItems, sidebarOpen }) {
    return (
        <div className={sidebarOpen ? 'sidebar active' : 'sidebar'} id="sidebar">

            <div className="sidebar-header">
                <h2>{title}</h2>
                <hr style={{ marginBottom: '20px' }} />
            </div>

            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li key={item.id} id={item.id} onClick={item.onClick}>
                        <i className={item.icon}></i> {item.label}
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default Sidebar
