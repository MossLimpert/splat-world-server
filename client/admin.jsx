// Author: Thomas Martinez
const helper = require('./helper.js');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    // get inputs
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    // ensure all fields are filled
    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
    }

    // login
    helper.sendPost(e.target.action, {username, pass});

    return false;
}

const handleNewAdmin = (e) => {
    e.preventDefault();
    helper.hideError();

    // get inputs
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // ensure all fields are filled
    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
    }

    // ensure new password inputs match
    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    // send create account POST
    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

// set up event listeners
const init = () => {
    // form references
    const addUserForm = document.getElementById('add-user-form');

    // assigning event listeners
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(e);
    });
};

window.onload = init;