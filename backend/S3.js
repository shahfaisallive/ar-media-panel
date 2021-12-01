// require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = 'cherry-pix-bucket'
const region = 'eu-west-2'
const accessKeyId = 'AKIA5ZCBRGJV3TS2KVN6 '
const secretAccessKey = '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'


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
function uploadFile(file, fileName) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileName,
    ACL: 'public-read'
  }

  return s3.upload(uploadParams).promise()
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