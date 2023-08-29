// Author: Moss Limpert

const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

//
// react components
//

// react form for users to buy premium version of app
const BuyForm = (props) => {
    return (
        <form id="buyForm"
            action="/buy-premium"
            name="buyForm"
            method="POST"
            className="buyForm"
        >
            <h3>Buy Premium to create and join as many bubbles as you want!</h3>
            <input className="buyPremiumSubmit" type="submit" value="Buy Premium $5" />
        </form>
    )
};

const init = () => {
    ReactDOM.render(<BuyForm />,
    document.getElementById('content'));
}

window.onload = init;