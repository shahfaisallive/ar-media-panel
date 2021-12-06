import React, { useEffect, useState } from 'react'
import myaxios from '../axios';
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import StarRatings from 'react-star-ratings';


const TargetList = ({ targets, targetsMeta }) => {
    const [targetList, setTargetList] = useState([]);

    useEffect(() => {
        axios.all(targets.map((target) => myaxios.get(`/targets/${target}`))).then(
            (data) => {
                setTargetList(data.sort((y,x) => (x.data.target_record.tracking_rating - y.data.target_record.tracking_rating )));
                // setTargetList(data)
                console.log(data)
            },
        );
        console.log(targetsMeta)
    }, [targets])


    const deleteTarget = (id) => {
        confirmAlert({
            title: 'Delete',
            message: 'Are you sure to delete this target?.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        myaxios.delete(`/targets/${id}`)
                            .then(res => {
                                if (res.data.result_code === 'Success') {
                                    // alert('Target Deleted Successfully')
                                    window.location.reload()
                                }
                                console.log(res)
                            })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { console.log('closed') }
                }
            ]
        });
    }

    const renderImageName = (image) => {
        return (
            <>
                {targetsMeta.map((tm) => {
                    if (tm.targetName === image) {
                        return <p>{tm.imageName}</p>
                    }
                })}
            </>
        )
    }

    const renderDate = (image) => {
        return (
            <>
                {targetsMeta.map((tm) => {
                    if (tm.targetName === image) {
                        return <p>{tm.date}</p>
                    }
                })}
            </>
        )
    }

    return (
        <div className="d-flex justify-content-center">
            <table className="table table-hover text-center bg-white" style={{ borderRadius: 30 }}>
                <thead>
                    <tr>
                        <th className="pl-5" scope="col">Image Name</th>
                        <th className="pl-5" scope="col">Target Name</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Added on</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {targetList.length !== 0 ? targetList.map(target => (
                        <tr key={target.data.target_record.target_id}>
                            <td className="pl-5">{renderImageName(target.data.target_record.name)}</td>

                            <td className="pl-5">{target.data.target_record.name}</td>

                            <td><StarRatings rating={target.data.target_record.tracking_rating} numberOfStars={5} starSpacing='2px' starDimension='25px' /></td>

                            <td className="pl-5">{renderDate(target.data.target_record.name)}</td>

                            <td><i className='btn fa fa-trash' onClick={e => { deleteTarget(target.data.target_record.target_id) }} style={{ cursor: 'pointer', color: 'grey' }}></i></td>
                        </tr>
                    )) :
                        <div className="d-flex justify-content-center text-center" >
                            <div className="spinner-border text-primary mt-3 mb-4" role="status" style={{ marginLeft: 500 }}></div>
                        </div>}
                </tbody>
            </table>
        </div>
    )
}

export default TargetList
