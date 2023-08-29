// Author: Moss Limpert

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//
// event handlers
//

// sends login request from login form
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});

    return false;
};

// sends signup request from signup form
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
};

//
// react components
//

// login form
const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <span><label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" /></span>
            <br />
            <span><label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" /></span>
            <br />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    )
};

// signup form
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <span><label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" /></span>
            <span><label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" /></span>
            <span><label htmlFor="pass2">Retype Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" /></span>
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    )
};


const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow />,
            document.getElementById('content'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow />,
            document.getElementById('content'));
        return false;
    });

    ReactDOM.render(<LoginWindow />,
        document.getElementById('content'));
};

window.onload = init;