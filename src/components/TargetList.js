import React, { useEffect, useState } from 'react'
import axios from '../axios';

const TargetList = ({ targets }) => {
    const [targetList, setTargetList] = useState([]);

    // FUCNTION TO GET DETAILS OF ALL TARGETS
    const getAllTargetsDetails = async () => {
        var dataArray = []
        await targets.map(tid => axios.get(`/${tid}`)
        .then(res => {
            dataArray.push(res)
            setTargetList([...targetList, res])
            // console.log(res)
        }))
        // setTargetList(dataArray)
        console.log(targetList)
    }


    // RENDER ALL TARGET DETAILS
    const renderTargets = () => {
        return targetList.map(target => (
            <div key={target.data.target_record.target_id}>
                <p>{target.data.target_record.name}</p>
            </div>
        ))
    }

    useEffect(() => {
        if(targets.length !== 0){
            getAllTargetsDetails()
        } 
        console.log(targetList)
    }, [targets])

    
    return (
        <div>
            {/* {targetList.length !== 0 ? renderTargets() :
                                    <div className="spinner-border text-success d-flex justify-content" role="status">
                                        <span className="sr-only text-center">Loading...</span>
                                    </div>} */}
            {/* {targetList.length !== 0 ? targetList.map(t => <p>lalaal</p>) : null} */}
            {/* {targetList.map(target => (
                <div>
                    <p>lalalalal</p>
                </div>
            ))} */}
            {/* {renderTargets()} */}
            {targetList.length !==0 ? <p>sadasd</p> : <p>nulllllllllllllll</p>}
        </div>
    )
}

export default TargetList
