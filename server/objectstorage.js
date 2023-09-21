const minio = require('minio');

const minioClient = new minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'mosslimpert',
    secretKey: 'Monster-Salad4'
});

//let file = '../hosted/img/bubbles.png';

// const tryGetBuckets = async () => {
//     try {
//         const buckets = await minioClient.listBuckets();
//         console.log('Success ', buckets);
//     } catch (err) {
//         console.log(err.message);
//     }
// };

// tryGetBuckets();

module.exports = minioClient;