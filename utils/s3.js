import dotenv from 'dotenv';
dotenv.config()
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const s3 = new S3({ region, accessKeyId, secretAccessKey });
const expirationtime = 10 * 365 * 24 * 60 * 60; 

async function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    const response = s3.upload(uploadParams).promise();
    return response;
}

async function uploadFiles(files) {
    return await Promise.all(files.map(async (file) => await uploadFile(file)));
}

function getpublicurl(fileKey) {
    const publicUrl = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileKey,
        Expires: expirationtime
    });
    return publicUrl;
}

function getFiles(fileKeys) {
    let files=[];
    for (let fileKey of fileKeys) {
        const downloadParams = {
            Key: fileKey,
            Bucket: bucketName
        }
        files.push(s3.getObject(downloadParams).promise());
    }
    return Promise.all(files);
}

function getFile(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream();
}

function deleteFile(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams).promise();
}

function deleteFiles(fileKeys) {
    let files=[];
    for (let fileKey of fileKeys) {
        const deleteParams = {
            Key: fileKey,
            Bucket: bucketName
        }
        files.push(s3.deleteObject(deleteParams).promise());
    }
    return Promise.all(files);
}

export { uploadFile, getFile,getFiles,uploadFiles };