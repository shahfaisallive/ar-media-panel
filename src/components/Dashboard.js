import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as fs from "fs";
import * as AWS from "aws-sdk";

const Dashboard = () => {

    const [image, setImage] = useState(null);
    const [targetList, setTargetList] = useState();
    const [uploading, setUploading] = useState(false);


    // Base64 CONVERTER
    const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => setImage(reader.result);
        reader.onerror = error => { console.log(error) };
    }

    // ON IMAGE CHANGE FUNCTION TO CREATE BUFFER
    const onImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            // await setImage(URL.createObjectURL(e.target.files[0]))
            getBase64(e.target.files[0])
        }
    }


    // SUBMIT HANDLER TO ADD IMAGE
    const submitHandler = (e) => {
        e.preventDefault()
        setUploading(true)
        const imgObj = { name: `Image${targetList.results.length}`, imagePath: image }
        axios.post('http://localhost:5000/api/targets/addtarget', imgObj)
            .then(res => {
                console.log(res.data)
                alert('Uploaded Successfully')
                setUploading(false)
            })
            .catch(err => {
                console.log(err)
                alert('Uploading Failed')
                setUploading(false)
            })
    }

    useEffect(() => {
        axios.get('http://localhost:5000/api/targets')
            .then(res => {
                console.log(res.data)
                setTargetList(res.data)
            })

        // console.log(image)
    }, [image])

    // RENDER THE LIST OF ALL TARGETS FUNCTION
    const renderTargets = () => {
        return targetList.results.map(res => <p key={res}>{res}</p>)
    }

    return (
        <div className="pt-3" style={{ backgroundColor: 'yellow' }}>
            <h3 className="display-4 text-center mb-3 ">Dashboard</h3>
            <div>
                <section className="vh-100" style={{ backgroundColor: 'red' }}>
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                                    <div className="card-body p-5 text-center">
                                        <div className="form-outline mb-4">
                                            <h5>Choose an Image to Upload:</h5>
                                            <input type="file" id="typeEmailX-2" className="form-control form-control-lg"
                                                onChange={onImageChange} />
                                        </div>
                                        <div className="mb-3">
                                            {image ? <img src={image} width={200} alt='football' /> : null}
                                        </div>
                                        {uploading ? <button className="btn btn-primary btn-lg btn-block" type="submit"><div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div></button> :
                                            <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={submitHandler}>Send</button>}

                                    </div>
                                </div>
                            </div>
                            {/* LIST TARGETS */}
                        </div>
                        <div className="pb-5">
                            <h4 className="display-4 text-center mt-2">List of all targets</h4>
                            <div className="mt-3 bg-light p-2 border border-dark">
                                {targetList ? renderTargets() :
                                    <div className="spinner-border text-success d-flex justify-content" role="status">
                                        <span className="sr-only text-center">Loading...</span>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Dashboard
