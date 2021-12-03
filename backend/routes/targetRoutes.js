const express = require('express');
const router = express.Router();
const vuforia = require('vuforia-api')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
var ffmpeg = require("ffmpeg");
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
// var ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);

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
// var client = vuforia.client({
//     'serverAccessKey': process.env.SERVER_ACCESS_KEY,
//     'serverSecretKey': process.env.SERVER_SECRET_KEY,

//     'clientAccessKey': process.env.CLIENT_ACCESS_KEY,
//     'clientSecretKey': process.env.CLIENT_SECRET_KEY
// })

// test keys
var client = vuforia.client({
    'serverAccessKey': '72c7cee0b5006f897bf5957d98bb791b7fb4506d',
    'serverSecretKey': '59344b0d061a6b1ce7fadf249c3506107f3c350e',

    'clientAccessKey': '1bf8c5e723322ebfff04ee2e3fc866a757fbc435',
    'clientSecretKey': 'dde1b8fd7e379018b518a4dc63dde91eabc4601e'
})

// util for base64 encoding and decoding
var vuforia_util = vuforia.util();


// Add new Target
router.post('/addtarget', async (req, res) => {
    const { name, imagePath } = req.body
    const imgPath = imagePath.slice(23)

    var target = {
        'name': name,
        'width': 250,
        'image': imgPath,
        'active_flag': true,
        'application_metadata': vuforia_util.encodeBase64('metadataaaa')
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

// Add video to S3
// router.post('/addVideo/:filename',upload.single('video'), async (req, res) => {
//     const file = req.file
//     console.log(file.filename)

//     const result = await uploadFile(file, req.params.filename)

//     await unlinkFile(file.path)
//     console.log(result)
//     res.send(result)
// })

router.post('/addVideo/:filename', upload.single('video'), async (req, res) => {
    const file = req.file
    console.log(file.path)

    // conversion
    var process = new ffmpeg(file.path);
    await process.then(async function (video) {
        console.log("File is ready to be processed");

        video.setVideoFormat("mp4").setVideoCodec("h264")
        console.log('here1')
        await video.save("./uploads/" + file.originalname + "_new.mp4");
        console.log('here2')

        console.log("Converted Video file: ");
    })


    const result = await uploadFile(`./uploads/${file.originalname}_new.mp4`, req.params.filename)
    console.log('here3')

    res.send(result)
    console.log(result)


    // try {
    //     new ffmpeg(file.path, async function (err, video) {
    //         if (!err) {
    //             console.log('The video is ready to be processed');
    //             video.setVideoFormat("mp4")
    //             video.setVideoCodec("h264")
    //             console.log(video)
    //             await video.save("/uploads/" + file.originalname + "_new.mp4")
    //             console.log('video: ' + video)
    //         } else {
    //             console.log('Error1111: ' + err);
    //         }
    //     });
    // } catch (e) {
    //     console.log('errorThis' + e.code);
    //     console.log('lol' + e.msg);  
    // }

    // var command = ffmpeg(fs.createReadStream(file.path))
    // command.format("mp4").videoCodec("mpeg4")
    // command.save('./uploads/' + req.params.filename)
    // console.log('here1')


    // const result = await uploadFile(file, req.params.filename)
    //     res.send(result)
    //     console.log(result)


    // await unlinkFile(file.path)
})



// Get all targets 
router.get('/', async (req, res) => {
    client.listTargets(function (error, result) {
        if (error) {
            // console.error(result);
            res.send(result)
        } else {
            // console.log(result);
            res.send(result)
        }
    });
})

// Get one target
router.get('/:id', async (req, res) => {
    client.retrieveTarget(req.params.id, function (error, result) {
        if (error) {
            console.error(result);
            res.send(result)
        } else {
            console.log(result);
            res.send(result)
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