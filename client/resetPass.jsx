// Author: Moss Limpert

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// manages form input validation for changing a user's password
// const handleChangePass = (e) => {
//     e.preventDefault();
//     helper.hideError();

//     const oldPass = e.target.querySelector('#pass').value;
//     const pass2 = e.target.querySelector('#pass2').value;
//     const pass3 = e.target.querySelector('#pass3').value;

//     if ( !oldPass || !pass2 || !pass3 ) {
//         helper.handleError('All fields are required!');
//         return false;
//     }

//     if ( oldPass === pass2 || oldPass === pass3) {
//         helper.handleError('New password must be different from old password!');
//         return false;
//     }

//     if ( pass2 !== pass3 ) {
//         helper.handleError('New password fields do not match!');
//         return false;
//     }

//     helper.sendPost(e.target.action, {oldPass, pass2, pass3});

//     return false;
// };
// react component for change password form
// const ChangePassWindow = (props) => {
//     return (
//         <form id="changePassForm"
//             name="changePassForm"
//             onSubmit={handleChangePass}
//             action="/changePassword"
//             method="POST"
//             className="mainForm"
//         >
//             <label htmlFor="pass">Current Password: </label>
//             <input id="pass" type="password" name="pass" placeholder="old password" />
//             <label htmlFor="pass2">New Password: </label>
//             <input id="pass2" type="password" name="pass2" placeholder="new password" />
//             <label htmlFor="pass3">Retype New Password: </label>
//             <input id="pass3" type="password" name="pass3" placeholder="new password" />
//             <input className="formSubmit" type="submit" value="Change password" />
//         </form>
//     )
// }

//
// helpers
//

// puts stuff in result box
const displayInfo = (res) => {
    hideAllResultBoxes();

    if (res.error) helper.handleError(res.error);
    else {
        // make results sectino visible
        document.querySelector('#result').classList.remove('hidden');
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
const getImage = (e) => {
    e.preventDefault();
    helper.hideError();

    console.log(e.target);
    //const file = e.target.querySelector
};

const init = () => {
    // ReactDOM.render(<ChangePassWindow />, 
    //     document.getElementById('content'));
    const uploadPfpForm = document.querySelector('image-upload');

    uploadPfpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getImage(e);
    });
};

window.onload = init;