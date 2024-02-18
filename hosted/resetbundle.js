/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

// Authors: Austin Willoughby, Moss Limpert

/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = message => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('message').classList.remove('hidden');
};

// puts stuff in result box
const displayInfo = res => {
  if (res.error) helper.handleError(res.error);else {
    // make results sectino visible
    document.querySelector('#result').classList.remove('hidden');
    // put info in
    //console.log(res);
    document.querySelector('#result p').innerHTML = JSON.stringify(res);
  }
};

/* Sends post requests to the server using fetch. Will look for various
    entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  let body = JSON.stringify(data);
  //console.log(body);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });
  //console.log("test");
  const result = await response.json();
  document.getElementById('message').classList.add('hidden');
  if (result.redirect) {
    window.location = result.redirect;
  }
  if (result.error) {
    handleError(result.error);
  }
  if (handler) {
    console.log(result);
    handler(result);
  }
};

// sends a get request
const sendGet = async (url, data, handler) => {
  //let params = new URLSearchParams(JSON.parse(data));
  let params = new URLSearchParams(data);
  let fullUrl = url + '?' + params;
  const response = await fetch(fullUrl + params, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const result = await response.json();
  hideError();
  if (result.redirect) {
    window.location = result.redirect;
  }
  if (result.error) {
    handleError(result.error);
  }
  if (handler) {
    //console.log(result);
    handler(result);
  }
};

// hides error message
const hideError = () => {
  document.getElementById('message').classList.add('hidden');
};

// https://stackoverflow.com/questions/30970648/changing-hex-codes-to-rgb-values-with-javascript
const convertHexRGB = hex => {
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
  displayInfo
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// Author: Moss Limpert

const helper = __webpack_require__(1);

//
// helpers
//

// puts stuff in result box
const displayInfo = res => {
  hideAllResultBoxes();
  if (res.error) helper.handleError(res.error);else {
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
const getImage = e => {
  e.preventDefault();
  helper.hideError();

  //const form = new FormData();
  const imgName = e.target.querySelector('#download-name').value;
  if (!imgName) {
    helper.handleError('No image name specified!');
  }
  helper.sendGet(e.target.action, {
    name: imgName
  }, displayInfo);
};

// uploads an image to the minio server
const uploadImage = e => {
  e.preventDefault();
  helper.hideError();
  const uid = e.target.querySelector('#user-id');
  const name = e.target.querySelector('#pfpname');
  if (!uid | !name) helper.handleError('No User ID or profile pic name specified');
  helper.sendPost(e.target.action, {
    id: uid,
    pfpname: pfpname
  }, displayInfo);
};

// connect event listeners
const init = () => {
  const downloadPfpForm = document.querySelector('image-download');
  downloadPfpForm.addEventListener('submit', e => {
    e.preventDefault();
    getImage(e);
  });
  // uploadPfpForm.addEventListener('submit', (e) => {
  //     e.preventDefault();
  //     uploadImage(e);
  // })

  displayInfo({
    wow: 'wow'
  });
};
window.onload = init;
})();

/******/ })()
;