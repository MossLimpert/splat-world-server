const minio = require('minio');
const fs = require('fs');
const path = require('path');
// const db = require('./database.js');

const minioClient = new minio.Client({
  endPoint: process.env.ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});

// names of buckets:
// const crewHeader = 'crew-header';
// const tagImg = 'tag-img';
// const tag = 'tag';
// const userHeader = 'user-header';
const userPfp = 'user-pfp';
// console.log(crewHeader,tagImg,tag,userHeader); // so i dont get lint errors

// file for testing
const file = path.resolve('hosted/img/splat.png');

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
    // open filestream
    const fileStream = fs.createReadStream(filePath);

    // check make sure file exists, get statistics about it
    fs.stat(
      file,
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

// send test image to user pfp from file location
// const testSendFromFilePath = async () => {
//    try {
//     const metaData = {
//       test: 'value',
//     };

//     // send image to server using filepath
//     const result = await minioClient.fPutObject(
// userPfp,
// 'test',
// file,
// metaData,
// (err, objInfo) => {
//       if (err) {
//         console.log(err);
//         return { error: err };
//       }

//       console.log('Success!', objInfo.etag, objInfo.versionId);
//       return objInfo;
//     });

//     console.log(result);
//     return result;
//   } catch (err) {
//     console.log(err);
//     return { error: err };
//   }
// };

//
// DOWNLOADING
//

// get buffer of object from server
// referencing https://www.tabnine.com/code/javascript/functions/minio/Client/getObject
// const getObjectBuffer = async (bucketName, objectName) => {

//   try {
//     return {
//       createStream: () => {
//         return new Promise((resolve, reject) => {
//           return minioClient.getObject(
//             bucketName,
//             objectName,
//             (err, dataStream) => {
//               if (err) {
//                 console.log(err);
//                 return reject(err);
//               }
//               //dataStream.read()
//               return resolve(dataStream);
//             }
//           );
//         });
//       }
//       ,
//       headers: async () => {
//         const stat = await new Promise((resolve, reject) => {
//           return minioClient.statObject(
//             bucketName,
//             objectName,
//             (err, stat) => {
//               if (err) {
//                 console.log(err);
//                 return reject(err);
//               }
//               return resolve(stat);
//             }
//           );
//         });
//         return {
//           "Content-Type": stat.metaData["content-type"],
//           "Content-Encoding": stat.metaData["content-encoding"],
//           "Cache-Control": stat.metaData["cache-control"],
//           "Content-Length": stat.size,
//           "Record-ID": stat.metaData["record-id"]
//         };
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     return { error: err };
//   }
// };

// // get buffer of object from server
// const getObjectBuffer = async (bucketName, objectName) => {
//   let size = 0;

//   try {
//     const stream = minioClient.getObject(bucketName, objectName, async (err, dataStream) => {
//       if (err) {
//         console.log(err);
//         return { error: err };
//       }

//       // keep track of size of object
//       dataStream.on('data', (chunk) => {
//         size += chunk.length;
//       });
//       // optional: report size to console
//       dataStream.on('end', () => {
//         console.log('End data stream. Total size = ', size);
//       });
//       // return error message as json
//       dataStream.on('error', (error) => {
//         console.log(error);
//         return { error };
//       });

//       //console.log(dataStream);

//       return dataStream;
//     })
//     //   .then(() => {

//     //   });

//     // fs.createWriteStream(path.resolve('hosted/img'))
//     //     .pipe(stream);
//     return stream;
//   } catch (err) {
//     console.log(err);
//     return { error: err };
//   }
// };

const testGetObjectFileDownload = async () => {
  try {
    return minioClient.fGetObject(
      userPfp,
      'pfptest',
      '/hosted/img/testDownload.png',
      (err) => {
        console.log(err);
        return { error: err };
      },
    );
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const getObjectFileDownload = async (bucketName, objectName) => {
  try {
    return minioClient.fGetObject(
      bucketName,
      objectName,
      'splat-world-server/hosted/downloads/pfp.png',
      (err) => {
        console.log(err);
        return { error: err };
      },
    );
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// const prommy = getObjectBuffer(userPfp, 'test');
// prommy.then((stream) => {
//   const writer = fs.createWriteStream(path.resolve('hosted/img'));

//   const pump = () => stream.read()
//     .then((value) => {
//       writer.write(value);

//       return writer.then(pump);
//     });

//   pump.then(() => {
//     console.log('Closed stream, done writing');
//   });
// });
// testGetObjectFileDownload();
// testSendFromFilePath();

//
// presigned operations
//

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

// getPresignedUrl(userPfp, 'test', 24 * 60 * 60)
testGetObjectFileDownload();

module.exports = {
  minioClient,
  getBuckets,
  sendFromFilePath,
  sendFromFileStreamBuffer,
  sendFromStringBuffer,
  getPresignedUrl,
  testGetObjectFileDownload,
  getObjectFileDownload,

};
