import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.png'

const Navbar = () => {
    let navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('adminInfo')
        navigate('/')
        window.location.reload()
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <img src={Logo} alt="Logo Icon" className="logo navbar-brand" />
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <NavLink to="/dashboard" className="nav-link">
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/addtarget" className="nav-link">
                            Add Target
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/" onClick={logout} className="nav-link">
                            <i className="fa fa-sign-out fa-2x ml-2" style={{marginTop: '-2px'}} aria-hidden="true"></i>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
