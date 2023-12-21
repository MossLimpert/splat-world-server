// Author: Moss Limpert

const minio = require('minio');
const fs = require('fs');
const path = require('path');
// const db = require('./database.js');

let ssl = false;
if (process.env.HOST !== "localhost") ssl = true;
else ssl = false;

const minioClient = new minio.Client({
  endPoint: process.env.ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: ssl,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  
});

// get list of buckets
const getBuckets = async () => {
  try {
    const buckets = await minioClient.listBuckets();
    console.log('Success ', buckets);
  } catch (err) {
    console.log(err.message);
  }
};

//
// UPLOADING
//

// send object to bucket from file path
const sendFromFilePath = (metadata, bucketName, objectName, filePath) => {
  try {
    // send image to server using filepath
    const result = minioClient.fPutObject(
      bucketName,
      objectName,
      filePath,
      metadata,
      (err, objInfo) => {
        if (err) {
          console.log(err);
          return { error: err };
        }

        // console.log('Success!', objInfo.etag, objInfo.versionId);
        return objInfo;
      },
    );

    // console.log(result.etag);
    return result;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// send object to bucket from buffer
const sendFromFileStreamBuffer = (metadata, bucketName, objectName, filePath, callback) => {
  try {

    console.log(objectName);
    // open filestream
    const fileStream = fs.createReadStream(filePath);

    // check make sure file exists, get statistics about it
    fs.stat(
      filePath,
      (err, stats) => {
        if (err) {
          console.log(err);
          return { error: err };
        }

        // print file stats
        // console.log(stats);

        // send buffer to server
        return minioClient.putObject(
          bucketName,
          objectName,
          fileStream,
          stats.size,
          metadata,
          (error, objInfo) => {
            if (error) {
              console.log(error);
              throw error;
            }

            // console.log('Success!', objInfo);
            // console.log(objInfo.etag);

            if (objInfo) callback(null, objInfo.etag);
            else callback(error, null);
          },
        );
      },
    );

    return false;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// send object to bucket from string buffer
const sendFromStringBuffer = async (metadata, bucketName, objectName, buffer) => {
  try {
    // send buffer to server
    const result = await minioClient.putObject(
      bucketName,
      objectName,
      buffer,
      metadata,
      (error, objInfo) => {
        if (error) {
          console.log(error);
          return { error };
        }

        console.log('Success!', objInfo.etag, objInfo.versionId);
        return objInfo;
      },
    );

    // console.log(result.etag);
    return result;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// get object and download it locally
const getObjectFileDownload = async (bucketName, objectName) => {
  try {
    return await minioClient.fGetObject(
      bucketName,
      objectName + ".jpg",
      path.resolve('hosted/downloads/pfp.jpg'),
    );
  } catch (err) {
    console.log("cmldsmal;kdjfl;kj;lkajf;asaldkj", err);
    return { error: err };
  }
};

// get a temporary download link, returns a promise
const getPresignedUrl = (bucketName, objectName, expiry) => {
  try {
    return minioClient.presignedGetObject(bucketName, objectName, expiry, (err, result) => {
      if (err) {
        console.log(err);
        return { error: err };
      }

      console.log(result);
      return result;
    });
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// removes an object from the minio object storage
const removeObject = async (bucketName, objectName) => {
  try {
    console.log("in remove object method - object storage js");
    return await minioClient.removeObject(bucketName, objectName);
  } catch (err) {
    console.log(err);
    return {error: err};
  }
}

module.exports = {
  minioClient,
  getBuckets,
  sendFromFilePath,
  sendFromFileStreamBuffer,
  sendFromStringBuffer,
  getPresignedUrl,
  getObjectFileDownload,
  removeObject,

};
