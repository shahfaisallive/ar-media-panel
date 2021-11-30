import React, { useState } from 'react'
import axios from '../axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Logo from './Logo.png'
// import { toast } from 'react-toastify';


const Login = () => {
    let navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null)

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!username || !password) {
            setMsg('Please login with correct credentials')
        } else {
            const { data } = await axios.post('/admin/login', { username, password }, { headers: { 'Content-Type': 'application/json' } })
            console.log(data)
            if (data.token) {
                localStorage.setItem('adminInfo', JSON.stringify(data))
                navigate('/dashboard')
                window.location.reload()
            } else {
                setMsg(data.msg)
            }
        }
    }

    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <h2 className="text1"> Sign In here</h2>

                <div className="fadeIn first">
                    <img src={Logo} alt="User Icon" className="logo" />
                </div>

                <form onSubmit={submitHandler}>
                    <input type="text" id="login" className="fadeIn second" name="login" placeholder="username"
                        value={username} onChange={e => setUsername(e.target.value)} />
                    <input type="password" id="password" className="fadeIn third" name="login" placeholder="password"
                        value={password} onChange={e => setPassword(e.target.value)} />
                    <input type="submit" className="fadeIn fourth" value="Log In" />
                    {msg ? <p className="text-danger">{msg}</p> : null}
                </form>

                <div id="formFooter">
                    <p className="text-muted">Please login to continue</p>
                </div>

            </div>
        </div>
    )
}

export default Login
