import React, { useEffect, useState } from 'react'
import axios from '../axios'
import Jimp from 'jimp';
import TargetList from './TargetList';

const Dashboard = () => {

    const [image, setImage] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [videoUploading, setVideoUploading] = useState(false);
    const [targets, setTargets] = useState([]);

    // Base64 CONVERTER and IMAGE PROCESSING
    const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const newImage = await Jimp.read(reader.result)
            newImage.greyscale()
            newImage.getBase64Async(Jimp.MIME_JPEG)
                .then(res => {
                    setImage(res)
                })
        }
        reader.onerror = error => { console.log(error) };
    }

    // ON IMAGE CHANGE FUNCTION TO CREATE BUFFER
    const onImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            getBase64(e.target.files[0])
        }
    }

    // ON VIDEO CHANGE FUNCTION TO CREATE BUFFER
    const onVideoChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setVideoFile(file)
            console.log(file)
        }
    }

    // VIDEO UPLOAD FUNCTION
    const postVideo = async (videoFile, fileName) => {
        const formData = new FormData();
        formData.append("video", videoFile)

        const result = await axios.post(`/addVideo/:${fileName}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        return result.data
    }


    // SUBMIT HANDLER TO ADD IMAGE
    const submitHandler = async (e) => {
        if (image && videoFile) {
            const fileName = `Image${targets.length}`
            e.preventDefault()
            setImageUploading(true)
            const imgObj = { name: fileName, imagePath: image }
            axios.post('/addtarget', imgObj)
                .then(async res => {
                    console.log(res.data)
                    alert('Image Uploaded Successfully')
                    if (res.data.result_code === "TargetCreated") {
                        setImageUploading(false)
                        setVideoUploading(true)
                        const result = await postVideo(videoFile, fileName)
                        console.log(result)
                        setVideoUploading(false)
                    } else {
                        alert('Target name already exists')
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert('Image Uploading Failed')
                    setImageUploading(false)
                })
        } else {
            alert('Something is missing in the form, select both files')
        }
    }


    // FUNCTION FOR GETTING OBJECTS OF ALL TARGETS
    // const getAllTargetDetails = () => {
    //     let targetsAray = []
    //     axios.get('/')
    //         .then(response => {
    //             response.data.results.map(res => axios.get(`/${res}`)
    //                 .then(r => {
    //                     targetsAray.push(r)
    //                     setTargetList(targetsAray)
    //                     console.log(r)
    //                 })
    //             )
    //         })
    // }

    // Get all target IDS


    const getTargets = () => {
        axios.get('/')
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
                                            <input type="file" id="typeEmailX-2" className="form-control form-control-lg mb-3"
                                                onChange={onImageChange} />

                                            <div className="mb-3">
                                                {image ? <img src={image} width={200} alt='football' /> : null}
                                            </div>

                                            <h5>Choose a video to Upload:</h5>
                                            <input type="file" id="typeEmailX-2" className="form-control form-control-lg"
                                                onChange={onVideoChange} />
                                        </div>

                                        {imageUploading ? <button className="btn btn-primary btn-lg btn-block">Uploading Image...</button> :
                                            videoUploading ? <button className="btn btn-primary btn-lg btn-block">Uploading Video...</button> :
                                                <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={submitHandler}>Send</button>}
                                    </div>
                                </div>
                            </div>
                            {/* LIST TARGETS */}
                        </div>
                        <div className="pb-5">
                            <h4 className="display-4 text-center mt-2">List of all targets</h4>
                            <div className="mt-3 bg-light p-2 border border-dark">
                                {targets.length !== 0 ? <TargetList targets={targets} /> : null}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Dashboard
