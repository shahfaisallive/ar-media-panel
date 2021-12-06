import React, { useEffect, useState } from 'react'
import axios from '../axios'
import TargetList from './TargetList';
import Navbar from './Navbar';
import './Dashboard.css'
// import NotFound from './NotFound'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ adminInfo }) => {
    const navigate = useNavigate()
    const [targets, setTargets] = useState([]);
    const [targetsMeta, setTargetsMeta] = useState([]);

    const getTargets = () => {
        axios.get('/targets')
            .then(response => {
                setTargets(response.data.result.results)
                setTargetsMeta(response.data.targets)
                // console.log(response)
            })
    }

    useEffect(() => {
        getTargets()
        // getAllTargetDetails()
        console.log(adminInfo)
        // console.log(targetsMeta)
    }, [])


    return (
        <div>
            {!adminInfo ? navigate('/') : <div>
                <Navbar />
                <div className="container">
                    <div className="pb-5">
                        <h3 className="mt-4">All Active Targets</h3>
                        <div className="mt-3 bg-light targets-div ">
                            {targets.length !== 0 && targetsMeta.length !== 0 ? <TargetList targets={targets} targetsMeta={targetsMeta} /> : null}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )

}

export default Dashboard
