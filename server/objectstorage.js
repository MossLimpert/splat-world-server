const minio = require('minio');
const fs = require('fs');

// const minioClient = new minio.Client({
//   endPoint: process.env.ENDPOINT,
//   port: parseInt(process.env.MINIO_PORT, 10),
//   useSSL: false,
//   accessKey: process.env.ACCESS_KEY,
//   secretKey: process.env.SECRET_KEY,
// });

// names of buckets:
// const crewHeader = 'crew-header';
// const tagImg = 'tag-img';
// const tag = 'tag';
// const userHeader = 'user-header';
const userPfp = 'user-pfp';
// console.log(crewHeader,tagImg,tag,userHeader); // so i dont get lint errors

// file for testing
const file = '../hosted/img/bubbles.png';

// get list of buckets
const getBuckets = async () => {
  try {
    const buckets = await minioClient.listBuckets();
    console.log('Success ', buckets);
  } catch (err) {
    console.log(err.message);
  }
};

// send object to bucket from file path
const sendFromFilePath = async (metadata, bucketName, objectName, filePath) => {
  try {
    // send image to server using filepath
    const result = await minioClient.fPutObject(
      bucketName,
      objectName,
      filePath,
      metadata,
      (err, objInfo) => {
        if (err) {
          console.log(err);
          return { error: err };
        }

        console.log('Success!', objInfo.etag, objInfo.versionId);
        return objInfo;
      },
    );

    console.log(result.etag);
    return result;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// send object to bucket from buffer
const sendFromFileStreamBuffer = async (metadata, bucketName, objectName, filePath) => {
  try {
    // open filestream
    const fileStream = fs.createReadStream(filePath);

    // check make sure file exists, get statistics about it
    const object = fs.stat(
      file,
      async (err, stats) => {
        if (err) {
          console.log(err);
          return { error: err };
        }

        // print file stats
        console.log(stats);

        // send buffer to server
        const result = await minioClient.putObject(
          bucketName,
          objectName,
          fileStream,
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
      },
    );
    console.log(object.etag);
    return object;
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

//     console.log(result.etag);
//     return result;
//   } catch (err) {
//     console.log(err);
//     return { error: err };
//   }
// };

// send test image to user pfp from buffer
// const testSendFromBuffer = async () => {
//     try {
//         const metaData = {
//             test: 'value',
//         };
//         // open filestream
//         let fileStream = fs.createReadStream(file);

//         // check make sure file exists, get statistics about it
//         const object = fs.stat(
//             file,
//             async (err, stats) => {
//                 if (err) {
//                     console.log(err);
//                     return {error: err};
//                 }

//                 // print file stats
//                 console.log(stats);

//                 // send buffer to server
//                 const result = await minioClient.putObject(
//                     userPfp,
//                     'test_from_buffer',
//                     fileStream,
//                     metaData,
//                     (error, objInfo) => {
//                         if (error) {
//                             console.log(error);
//                             return {error: error};
//                         }

//                         console.log('Success!', objInfo.etag, objInfo.versionId);
//                         return objInfo;
//                     });

//                 //console.log(result.etag);
//                 return result;
//             });
//         console.log(object.etag);
//         return object;
//     } catch (err) {
//         console.log(err);
//         return { error: err };
//     }
// };

// get buffer of object from server
const getObjectBuffer = async (bucketName, objectName) => {
  let size = 0;

  try {
    const stream = await minioClient.getObject(bucketName, objectName, async (err, dataStream) => {
      if (err) {
        console.log(err);
        return { error: err };
      }

      // keep track of size of object
      dataStream.on('data', (chunk) => {
        size += chunk.length;
      });
      // optional: report size to console
      dataStream.on('end', () => {
        console.log('End data stream. Total size = ', size);
      });
      // return error message as json
      dataStream.on('error', (error) => {
        console.log(error);
        return { error };
      });

      console.log(stream);
      return stream;
    });

    return stream;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

getObjectBuffer(userPfp, 'test');

// const testGetObjectBuffer = async () => {
//   let size = 0;

//   try {
//     const stream = await minioClient.getObject(userPfp, 'test', async (err, dataStream) => {
//       if (err) {
//         console.log(err);
//         return {error: err};
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
//         return {error: error};
//       });

//       console.log(stream);
//       return stream;
//     });

//     return stream;
//   } catch (err) {
//     console.log(err);
//     return {error: err};
//   }
// };

// const testGetObjectFileDownload = async () => {
//   try {
//     const fileDownload = await minioClient.fGetObject(
//       userPfp,
//       'test',
//       '/hosted/download',
//       (err) => {
//         console.log(err);
//         return {error: err};
//       });

//       console.log(fileDownload);
//       return fileDownload;
//   } catch (err) {
//     console.log(err);
//     return {error: err};
//   }
// }

// testGetObjectFileDownload();

module.exports = {
  minioClient,
  getBuckets,
  sendFromFilePath,
  sendFromFileStreamBuffer,
  sendFromStringBuffer,
  getObjectBuffer,

};
