// Author: Moss Limpert

const helper = require('./helper.js');

//
// helpers
//

// puts stuff in result box
const displayInfo = (res) => {
    hideAllResultBoxes();

    if (res.error) helper.handleError(res.error);
    else {
        // make results sectino visible
        document.querySelector('output').classList.remove('hidden');
        // put info in
        document.querySelector('#result p').innerHTML = JSON.stringify(JSON.stringify(res));
    }
};

//
// response handlers
// 



//
// event handlers
//
// downloads an image from minio from server
const getImage = (e) => {
    e.preventDefault();
    helper.hideError();

    //const form = new FormData();
    const imgName = e.target.querySelector('#download-name').value;

    if (!imgName) {
        helper.handleError('No image name specified!');
    }

    helper.sendGet(
        e.target.action, 
        { name: imgName,},
        displayInfo
    );
};

// uploads an image to minio from server
// const sendImage = (e) => {
//     e.preventDefault();
//     helper.hideError();

    
// }

const uploadImage = (e) => {
    e.preventDefault();
    helper.hideError();

    const uid = e.target.querySelector('#user-id');
    const name = e.target.querySelector('#pfpname');

    if (!uid | !name) helper.handleError('No User ID or profile pic name specified');

    helper.sendPost(
        e.target.action,
        {
            id: uid,
            pfpname: pfpname,
        },
        displayInfo
    );
};

const init = () => {
    // ReactDOM.render(<ChangePassWindow />, 
    //     document.getElementById('content'));
    //const uploadPfpForm = document.querySelector('image-upload');
    const downloadPfpForm = document.querySelector('image-download');

    downloadPfpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getImage(e);
    });
    // uploadPfpForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     uploadImage(e);
    // })

    displayInfo({wow: 'wow'});
};

window.onload = init;