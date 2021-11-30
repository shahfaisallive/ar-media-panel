import React, { useEffect, useState } from 'react'
import axios from '../axios'
import TargetList from './TargetList';
import Navbar from './Navbar';
import './Dashboard.css'
// import NotFound from './NotFound'

const Dashboard = ({ adminInfo }) => {
    const [targets, setTargets] = useState([]);

    const getTargets = () => {
        axios.get('/targets')
            .then(response => {
                setTargets(response.data.results)
                // console.log(response.data.results)
            })
    }

    useEffect(() => {
        getTargets()
        // getAllTargetDetails()
    }, [])


    return (
        < div >
            <Navbar />
            <div className="container">
                <div className="pb-5">
                    <h3 className="mt-4">All Active Targets</h3>
                    <div className="mt-3 bg-light targets-div ">
                        {targets.length !== 0 ? <TargetList targets={targets} /> : null}
                    </div>
                </div>
            </div>
        </div >
    )

}

export default Dashboard
