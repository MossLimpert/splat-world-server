// Authors: Austin Willoughby, Moss Limpert

/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('message').classList.remove('hidden');
};
  
/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('message').classList.add('hidden');

    if(result.redirect) {
        window.location = result.redirect;
    }

    if(result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

// sends a get request
const sendGet = async (url, data, handler) => {
    //console.log(url);
    //let dir = '/tag';
    let params = new URLSearchParams(JSON.parse(data));
    console.log(params)
    let fullUrl = url + '?'
    //console.log(fullUrl + params);

    const response = await fetch (fullUrl + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const result = await response.json();
    console.log(result);
    // hideError();

    if (result.redirect) {
        window.location = result.redirect;
    }
    if (result.error) {
        handleError(result.error);
    }
    if (handler) {
        handler(result);
    }
}

// hides error message
const hideError = () => {
    document.getElementById('message').classList.add('hidden');
}

// https://stackoverflow.com/questions/30970648/changing-hex-codes-to-rgb-values-with-javascript
const convertHexRGB = (hex) => {
    let m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
};

module.exports = {
    handleError,
    sendPost,
    hideError,
    convertHexRGB,
    sendGet,
};