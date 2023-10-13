const minio = require('minio');

const minioClient = new minio.Client({
  endPoint: process.env.ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
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
const testSendImage = async () => {
  try {
    const metaData = {
      test: 'value',
    };
    const result = await minioClient.fPutObject(userPfp, 'test', file, metaData, (err, result) => {
      if (err) {
        console.log(err);
        return { error: err };
      }
      console.log('Success!', result.etag, result.versionId);
    });
    console.log(result.etag);
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports = {
  minioClient,
  getBuckets,
  testSendImage,

};
