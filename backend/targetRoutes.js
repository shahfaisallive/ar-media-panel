const express = require('express');
const router = express.Router();
const vuforia = require('vuforia-api')
// const sharp = require('sharp')
const Jimp = require('jimp');



// IMAGE PROCESSING
// async function resizeImage(imagePath) {
//     try {
//         await sharp(imagePath)
//             .greyscale()
//             .toFile("sampleeee");
//     } catch (error) {
//         console.log(error);
//     }
// }


// VUFORIAL CLIENT SETUP
// var client = vuforia.client({
//     'serverAccessKey': '8f680f148bca31d391c4afa5f69c289bf8848227',
//     'serverSecretKey': 'a67d4b8754dbb10c0fa1be14bad8367a17097955',

//     'clientAccessKey': 'b463d0f2c42612529aaf1ffc2c16f3ee77bc07ab',
//     'clientSecretKey': '92984ef75652e52f6e7ec4ffa45426c9914017d0'
// })

// test
var client = vuforia.client({
    'serverAccessKey': '72c7cee0b5006f897bf5957d98bb791b7fb4506d',
    'serverSecretKey': '59344b0d061a6b1ce7fadf249c3506107f3c350e',

    'clientAccessKey': '1bf8c5e723322ebfff04ee2e3fc866a757fbc435',
    'clientSecretKey': 'dde1b8fd7e379018b518a4dc63dde91eabc4601e'
})

// util for base64 encoding and decoding
var util = vuforia.util();


// Add new Target
router.post('/addtarget', async (req, res) => {
    const { name, imagePath } = req.body
    // var pathArray = imagePath.slice(23)
    // var pathBuffer = await sharp(pathArray).greyscale().toBuffer()
    // Jimp.read(imagePath, (err, img) => {
    //     if(err) throw err;
    //     img.greyscale().write('eazyyyy'); 
    // })
    // res.send(imagePath)

    const newImage = await Jimp.read(imagePath)
    newImage.greyscale()
    newImage.write('rara.jpg')       

        // console.log(newImage)

    // var target = {
    //     'name': name,
    //     'width': 32.0,
    //     // 'image': pathArray,
    //     'image': util.encodeFileBase64('./newImage.jpg'),
    //     'active_flag': true,
    //     'application_metadata': util.encodeBase64('metadataaaa')
    // };

    // client.addTarget(target, function (error, result) {

    //     if (error) {
    //         console.error(result);
    //     } else {
    //         console.log(result);
    //         res.send(result)
    //     }
    // });
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




module.exports = router;