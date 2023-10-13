const minio = require('minio');
const fs = require('fs');

const minioClient = new minio.Client({
  endPoint: process.env.ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});

// names of buckets:
const crewHeader = 'crew-header';
const tagImg = 'tag-img';
const tag = 'tag';
const userHeader = 'user-header';
const userPfp = 'user-pfp';
console.log(crewHeader,tagImg,tag,userHeader); // so i dont get lint errors

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

// send test image to user pfp from file location
const testSendFromFilePath = async () => {
  try {
    const metaData = {
      test: 'value',
    };

    // send image to server using filepath
    const result = await minioClient.fPutObject(userPfp, 'test', file, metaData, (err, objInfo) => {
      if (err) {
        console.log(err);
        return { error: err };
      }

      console.log('Success!', objInfo.etag, objInfo.versionId);
      return objInfo;
    });

    console.log(result.etag);
    return result;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

// send test image to user pfp from buffer
const testSendFromBuffer = async () => {
    try {
        const metaData = {
            test: 'value',
        };
        // open filestream
        let fileStream = fs.createReadStream(file);

        // check make sure file exists, get statistics about it
        const object = fs.stat(
            file,
            async (err, stats) => {
                if (err) {
                    console.log(err);
                    return {error: err};
                }
                
                // print file stats
                console.log(stats);

                // send buffer to server
                const result = await minioClient.putObject(
                    userPfp,
                    fileStream,
                    'test_from_buffer',
                    metaData,
                    (error, objInfo) => {
                        if (error) {
                            console.log(error);
                            return {error: error};
                        }

                        console.log('Success!', objInfo.etag, objInfo.versionId);
                        return objInfo;
                    });

                console.log(result.etag);
                return result.etag;
            });
        return object;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

testSendFromBuffer();

module.exports = {
    minioClient,
    getBuckets,
    testSendFromFilePath,
    testSendFromBuffer,

};
