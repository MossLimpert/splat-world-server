const minio = require('minio');

const minioClient = new minio.Client({
    endPoint: process.env.ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

// names of buckets:
let crewHeader = 'crew-header';
let tagImg = 'tag-img';
let tag = 'tag';
let userHeader = 'user-header';
let userPfp = 'user-pfp';

let file = '../hosted/img/bubbles.png';

// get list of buckets
const getBuckets = async () => {
    try {
        const buckets = await minioClient.listBuckets();
        console.log('Success ', buckets);
    } catch (err) {
        console.log(err.message);
    }
};

// send test image to user pfp
const testSendImage = async () => {
    try {
        let metaData = {
            test: 'value',
        };
        const result = await minioClient.fPutObject(userPfp, 'test', file, metaData, (err, result) => {
            if (err) {
                console.log(err);
                return {error: err};
            }
            console.log('Success!', result.etag, result.versionId);
        });
        console.log(result.etag);
    } catch (err) {
        console.log(err);
        return {error: err};
    }
};

testSendImage();

module.exports = {
    minioClient,
    getBuckets,
    testSendImage,

};