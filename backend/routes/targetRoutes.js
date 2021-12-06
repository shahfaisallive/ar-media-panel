const express = require('express');
const router = express.Router();
const Target = require('../models/Target')
const vuforia = require('vuforia-api')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
var ffmpeg = require("ffmpeg");

// const {protectAdmin} = require('../middleware/auth')

const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const { uploadFile } = require('../S3')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${ext}`)
    }
})

const upload = multer({
    storage: multerStorage,
})


// VUFORIAL CLIENT SETUP
var client = vuforia.client({
    'serverAccessKey': process.env.SERVER_ACCESS_KEY,
    'serverSecretKey': process.env.SERVER_SECRET_KEY,

    'clientAccessKey': process.env.CLIENT_ACCESS_KEY,
    'clientSecretKey': process.env.CLIENT_SECRET_KEY
})

// test keys
// var client = vuforia.client({
//     'serverAccessKey': '72c7cee0b5006f897bf5957d98bb791b7fb4506d',
//     'serverSecretKey': '59344b0d061a6b1ce7fadf249c3506107f3c350e',

//     'clientAccessKey': '1bf8c5e723322ebfff04ee2e3fc866a757fbc435',
//     'clientSecretKey': 'dde1b8fd7e379018b518a4dc63dde91eabc4601e'
// })

// util for base64 encoding and decoding
var vuforia_util = vuforia.util();


// Add new Target
router.post('/addtarget', async (req, res, next) => {
    const { targetName, imagePath, imageName } = req.body
    const imgPath = imagePath.slice(23)

    const createdTarget = new Target({
        imageName,
        targetName
    });

    try {
        await createdTarget.save();
    } catch (err) {
        const error = new Error('Creating target failed, please try again.', 500);
        return next(error);
    }

    console.log(createdTarget)


    var target = {
        'name': targetName,
        'width': 500,
        'image': imgPath,
        'active_flag': true,
        'application_metadata': vuforia_util.encodeBase64(imageName),
    };

    client.addTarget(target, function (error, result) {

        if (error) {
            console.error(result);
        } else {
            console.log(result);
            res.send(result)
        }
    });


})


router.post('/addVideo/:filename', upload.single('video'), async (req, res) => {
    const file = req.file
    console.log(file.path)
    var name = req.params.filename

    // conversion
    var process = new ffmpeg(file.path);
    await process.then(async function (video) {
        console.log("File is ready to be processed");
        video.setVideoFormat("mp4").setVideoCodec("h264")
        await video.save("./uploads/" + name);
        console.log("Converted Video file");
    })

    var fileName = "./uploads/" + name;

    const result = await uploadFile(fileName, name)

    res.send(result)
    console.log(result)

    await unlinkFile(file.path)
    await unlinkFile(fileName)

})



// Get all targets 
router.get('/', async (req, res) => {
    let targets = await Target.find()
    client.listTargets(function (error, result) {
        if (error) {
            // console.error(result);
            res.send(result)
        } else {
            // console.log(result);
            res.send({result: result, targets: targets})
            // res.send(result)
        }
    });
})

// Get one target
router.get('/:id', async (req, res, next) => {
    client.retrieveTarget(req.params.id, async function (error, result) {
        if (error) {
            console.error(result);
            res.send(result)
        } else {
            res.send(result)
            // console.log(result.target_record);
            // let targetMeta
            // try {
            //     targetMeta = await Target.findOne({ targetName: result.target_record.name })

            // } catch (err) {
            //     console.log(err)
            // }
            
            // if(targetMeta){
            //     console.log({target: result.target_record, targetMeta: targetMeta})
            // } else {
            //     console.log({target: result.target_record, targetMeta: {}})
            // }

        }
    });
})


// Delete one target
router.delete('/:id', async (req, res) => {
    client.deleteTarget(req.params.id, function (error, result) {
        if (error) {
            console.error(result);
            res.send(result)
        } else {
            console.log(result);
            res.send(result)
        }
    });
})


module.exports = router;