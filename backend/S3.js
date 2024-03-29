// require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = 'cherry-pix-bucket'
const region = 'eu-west-2'
const accessKeyId = process.env.IAM_ACCESS_KEY
const secretAccessKey = process.env.IAM_SECRET_KEY


// Test
// const bucketName = 'faisal-test'
// const region = 'ap-south-1'
// const accessKeyId = 'AKIA5BHIMUUY67D3OXE5'
// const secretAccessKey = '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'

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(fileName, ffupfront) {
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    const params = {
        Bucket: bucketName, // pass your bucket name
        Key: ffupfront,
        Body: data,
        ACL: 'public-read',
        ContentType: 'video/mp4'
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
        return data.Location
    });
 });
}
exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream


// Upload through multer s3
// var uploadFile = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: bucketName,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString()+'.mp4')
//     },
//     acl: 'public-read'
//   })
// })

exports.uploadFile = uploadFile
