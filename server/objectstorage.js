const minio = require('minio');
//console.log(process.env.ENDPOINT);
const minioClient = new minio.Client({
    endPoint: process.env.ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

//let file = '../hosted/img/bubbles.png';

const tryGetBuckets = async () => {
    try {
        const buckets = await minioClient.listBuckets();
        console.log('Success ', buckets);
    } catch (err) {
        console.log(err.message);
    }
};

tryGetBuckets();

module.exports = minioClient;