import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar'
import axios from '../axios'
import Jimp from 'jimp';
import { useEffect } from 'react';
import './AddTarget.css'
import crypto from 'crypto'
import { Progress } from "reactstrap";
import { useNavigate } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
// import NotFound from './NotFound'
// import { toast } from 'react-toastify';


const AddTarget = ({ adminInfo }) => {
    const [name, setName] = useState("");
    const [targets, setTargets] = useState([]);
    const [image, setImage] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [videoUploading, setVideoUploading] = useState(false);
    const [imageMsg, setImageMsg] = useState(null)
    const [videoMsg, setVideoeMsg] = useState(null)
    const [imageUploadSuccess, setImageUploadSuccess] = useState(false)
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [showProgressBar, setProgressBarVisibility] = useState(false);
    const [imageProcessLoad, setImageProcessLoad] = useState(false)
    const [videoUploadProcess, setVideoUploadProcess] = useState(false)



    let navigate = useNavigate()

    // Base64 CONVERTER and IMAGE PROCESSING
    const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            setImageProcessLoad(true)
            const newImage = await Jimp.read(reader.result)
            newImage.quality(70)
            newImage.resize(600, Jimp.AUTO)
            newImage.greyscale()
            console.log(newImage)
            newImage.getBase64Async(Jimp.MIME_JPEG)
                .then(res => {
                    setImageProcessLoad(false)
                    setImage(res)
                })
        }
        reader.onerror = error => { console.log(error) };
    }

    // ON NAME CHANGE
    const onNameChange = (e) => {
        setName(e.target.value)
    }

    // ON IMAGE CHANGE FUNCTION TO CREATE BUFFER
    const onImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            // console.log(e.target.files[0].size)
            if (file.name.split('.').pop() === 'jpeg' || file.name.split('.').pop() === 'png' || file.name.split('.').pop() === 'jpg') {
                getBase64(file)
                console.log(file)
            } else {
                setImageMsg('Please choose jpeg or png format to upload')
            }
        }
    }

    // ON VIDEO CHANGE FUNCTION TO CREATE BUFFER
    const onVideoChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.name.split('.').pop() === 'mp4') {
                setVideoFile(file)
                console.log(file)
            } else {
                setVideoeMsg('Please choose .mp4 format to upload')
            }

        }
    }

    // VIDEO UPLOAD FUNCTION
    const postVideo = async (videoFile, fileName) => {
        const formData = new FormData();
        formData.append("video", videoFile)

        setProgressBarVisibility(true);
        // const result = await axios.post(`/targets/addVideo/:${fileName}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
        // return result.data
        const result = axios({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "POST",
            data: formData,
            url: `/targets/addVideo/${fileName}.mp4`, // route name
            // baseURL: "http://localhost:5000/api/upload", //local url
            onUploadProgress: progress => {
                const { total, loaded } = progress;
                const totalSizeInMB = total / 1000000;
                const loadedSizeInMB = loaded / 1000000;
                const uploadPercentage = (loadedSizeInMB / totalSizeInMB) * 100;
                setUploadPercentage(uploadPercentage.toFixed(2));
                console.log("total size in MB ==> ", totalSizeInMB);
                console.log("uploaded size in MB ==> ", loadedSizeInMB);
            },
            encType: "multipart/form-data",
        });
        setVideoUploadProcess(true)
        return result
    }

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


    // SUBMIT HANDLER TO ADD IMAGE
    const submitHandler = async (e) => {
        if (image && videoFile) {
            // console.log(targets.length)
            const fileName = crypto.randomBytes(6).toString("hex")
            e.preventDefault()
            setImageUploading(true)
            const imgObj = { targetName: fileName, imagePath: image, imageName: name }
            axios.post('/targets/addtarget', imgObj)
                .then(async res => {
                    console.log(res.data)
                    setImageUploadSuccess(true)
                    // alert('Image Uploaded Successfully')
                    // toast.success("Image Uplaoded Successfully", {
                    //     position: toast.POSITION.TOP_CENTER
                    // })

                    if (res.data.result_code === "TargetCreated") {
                        setImageUploading(false)
                        setVideoUploading(true)
                        const result = await postVideo(videoFile, fileName)
                        console.log(result)
                        setVideoUploading(false)
                        setVideoUploadProcess(false)
                        confirmAlert({
                            title: 'Success',
                            message: 'Image and Video Uploaded Successfully',
                            buttons: [
                                {
                                    label: 'Ok',
                                    onClick: () => {
                                        window.location.reload();
                                    }
                                }
                            ]
                        })
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

    // const submitHandler = async (e) => {
    //     e.preventDefault()
    //     const fileName = crypto.randomBytes(6).toString("hex")
    //     const result = await postVideo(videoFile, fileName)
    //     console.log(result)
    // }

    return (
        <div>
            {!adminInfo ? navigate('/') :
                <div>
                    <Navbar />
                    <div className="container justify-content-center">
                        <h3 className="mt-4 text-center d-block">List New Target</h3>
                        <div className="row justify-content-center d-flex">
                            <div className="add-target-form col-md-6 mt-3 pb-2 mb-5">
                                <label htmlFor="nameField" className="form-label mt-3 d-block"><b>File name</b></label>
                                <input className="form-control text-left" type="text" id="nameField" onChange={onNameChange} value={name} />

                                <label htmlFor="formFile" className="form-label mt-3 d-block"><b>Select an Image File to Upload</b></label>
                                <input className="form-control-sm" type="file" id="formFile" onChange={onImageChange} accept=".jpeg, .jpg, .png" />
                                {imageMsg ? <p className="text-danger mt-2 ml-2">{imageMsg}</p> : null}
                                {image && !imageProcessLoad ? <img src={image} width={200} alt='football' className="mt-1 border border-round" /> :
                                    imageProcessLoad && !image ? <div className="spinner-border text-primary ml-5" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div> : null}

                                {imageUploadSuccess ? <div className="alert alert-success mt-2" role="alert">
                                    Image Uploaded Successfully
                                </div> : null}
                                <hr />

                                <label htmlFor="formFile" className="form-label mt-2 d-block"><b>Select a Video File to Upload</b></label>
                                <input className="form-control-sm mb-3" type="file" id="formFile" onChange={onVideoChange} accept=".mp4" />
                                {videoMsg ? <p className="text-danger mt-2">{videoMsg}</p> : null}

                                {showProgressBar ? <Progress
                                    animated={parseInt(uploadPercentage) !== 100}
                                    color="success"
                                    value={uploadPercentage}
                                /> : null}

                                {videoUploadProcess ? <div className="alert alert-primary mt-2" role="alert">
                                    Video processing...Please wait!
                                </div> : null}

                                <hr />

                                {imageUploading ? <button className="btn btn-secondary btn-lg btn-block">Uploading Image...</button> :
                                    videoUploading ? <button className="btn btn-success btn-lg btn-block">Uploading Video...</button> :
                                        <button className="btn btn-primary mb-2    btn-lg btn-block" type="submit" onClick={submitHandler}>Upload</button>}
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default AddTarget
