// Author: Moss Limpert

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//
// event handlers
//

// sends a join bubble request from a user
const handleJoinBubble = (e) => {
    e.preventDefault();
    helper.hideError();

    const bubbleName = e.target.querySelector('#bubbleName').value;
    const pass = e.target.querySelector('#bubblePassword').value;

    if(!bubbleName || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {bubbleName, pass});

    return false;
};

// sends a create bubble request from user
const handleCreateBubble = (e) => {
    e.preventDefault();
    helper.hideError();

    const bubbleName = e.target.querySelector('#bubbleName').value;
    const pass = e.target.querySelector('#bubblePassword').value;
    const pass2 = e.target.querySelector('#retypePassword').value;

    if (!bubbleName || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {
        name: bubbleName, 
        pass, 
        pass2
    });

    return false;
};

//
// react components
//

// join bubble form
const JoinBubbleWindow = (props) => {
    return (
        <form id="joinBubbleForm"
            name="joinBubbleForm"
            onSubmit={handleJoinBubble}
            action="/join-bubble"
            method="POST"
            className="mainForm"
        >
            <h3>Join Bubble</h3>
            <span><label htmlFor="bubbleName">Bubble Name: </label>
            <input id="bubbleName" type="text" name="bubbleName" placeholder="bubble name" /></span>
            <br />
            <span><label htmlFor="bubblePassword">Bubble Password: </label>
            <input id="bubblePassword" type="password" name="bubblePassword" placeholder="password" /></span>
            <br />
            <input className="formSubmit" type="submit" value="Join Bubble" />
        </form>
    )
};

// create bubble form
const CreateBubbleWindow = (props) => {
    return (
        <form id="createBubbleForm"
            name="createBubbleForm"
            onSubmit={handleCreateBubble}
            action="/create-bubble"
            method="POST"
            className="mainForm"
        >
            <h3>Create Bubble</h3>
            <span><label htmlFor="bubbleName">Bubble Name: </label>
            <input id="bubbleName" name="bubbleName" type="text" placeholder="bubble name" /></span>
            <span><label htmlFor="bubblePassword">Bubble Password: </label>
            <input id="bubblePassword" name="bubblePassword" type="password" placeholder="password" /></span>
            <span><label htmlFor="retypePassword">Retype Password: </label>
            <input id="retypePassword" name="retypePassword" type="password" placeholder="retype password" /></span>
            <input className="formSubmit" type="submit" value="Create Bubble" />
        </form>
    )
};



const init = () => {
    const joinButton = document.getElementById('joinButton');
    const createButton = document.getElementById('createButton');

    joinButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<JoinBubbleWindow />,
            document.getElementById('content'));
        return false;
    });

    createButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<CreateBubbleWindow />,
            document.getElementById('content'));
        return false;
    });

    if (location.pathname == '/create-bubble') {
        ReactDOM.render(<CreateBubbleWindow />,
            document.getElementById('content'));
    } else {
        ReactDOM.render(<JoinBubbleWindow />,
            document.getElementById('content'));
    }
    
};

window.onload = init;