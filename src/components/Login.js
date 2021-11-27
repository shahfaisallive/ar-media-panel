import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    let navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = () => {
        if (email === 'test@email.com' && password === '1234') {
            navigate('/dashboard')
        } else {
            alert('Wrong passwod or email janii!!!')
        }
    }

    return (
        <div>
            <section className="vh-100" style={{ backgroundColor: 'darkblue' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                <div className="card-body p-5 text-center">

                                    <h3 className="mb-5">Sign in</h3>

                                    <div className="form-outline mb-4">
                                        <input type="email" id="typeEmailX-2" className="form-control form-control-lg"
                                            value={email} onChange={e => setEmail(e.target.value)} />
                                        <label className="form-label" htmlFor="typeEmailX-2">Email</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input type="password" id="typePasswordX-2" className="form-control form-control-lg"
                                            value={password} onChange={e => setPassword(e.target.value)} />
                                        <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                                    </div>

                                    <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={submitHandler}>Login</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
