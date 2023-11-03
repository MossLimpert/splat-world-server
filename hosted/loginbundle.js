/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = message => {
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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  document.getElementById('message').classList.add('hidden');
  if (result.redirect) {
    window.location = result.redirect;
  }
  if (result.error) {
    handleError(result.error);
  }
  if (handler) {
    handler(result);
  }
};
const sendGet = async (url, data, handler) => {
  //console.log(url);
  //let dir = '/tag';
  let params = new URLSearchParams(JSON.parse(data));
  //console.log(params)
  let fullUrl = url + '?';
  //console.log(fullUrl);

  const response = await fetch(fullUrl + params, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const result = await response.json();
  console.log(result);
  // hideError();

  // if (result.redirect) {
  //     window.location = result.redirect;
  // }
  // if (result.error) {
  //     handleError(result.error);
  // }
  // if (handler) {
  //     handler(result);
  // }
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
  sendGet
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
// event handlers
//

// add test user
const addUser = e => {
  e.preventDefault();
  helper.hideError();
  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#userpass').value;
  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }
  helper.sendPost(e.target.action, {
    username,
    pass
  });
};

// add test crew
const addCrew = e => {
  e.preventDefault();
  helper.hideError();
  const name = e.target.querySelector('.crewname').value;
  const pass = e.target.querySelector('#crewpass').value;
  let hexColor = e.target.querySelector('#color').value;
  const ownerID = e.target.querySelector('#owner').value;
  const color = helper.convertHexRGB(hexColor);
  if (!name || !pass || !ownerID) {
    helper.handleError('Crew name, password, or owner ID missing!');
    return false;
  }
  const body = {
    name: name,
    pass: pass,
    owner: ownerID,
    color_r: color.r,
    color_g: color.g,
    color_b: color.b
  };
  console.log(body);
  helper.sendPost(e.target.action, body);
};

// add test tag
const addTag = e => {
  e.preventDefault();
  helper.hideError();
  const title = e.target.querySelector('#title').value;
  const uID = e.target.querySelector('#userid').value;
  const cID = e.target.querySelector('#crewid').value;
  if (!uID || !cID || !title) {
    helper.handleError('Title, User ID, or Crew ID field is empty!');
    return false;
  }
  helper.sendPost(e.target.action, {
    author_ref: parseInt(uID),
    crew: parseInt(cID),
    title: title
  });
};
const init = () => {
  // form references
  const addUserForm = document.getElementById('add-user-form');
  const addCrewForm = document.getElementById('add-crew-form');
  const addTagForm = document.getElementById('add-tag-form');

  // assigning event listeners
  addUserForm.addEventListener('submit', e => {
    e.preventDefault();
    addUser(e);
  });
  addCrewForm.addEventListener('submit', e => {
    e.preventDefault();
    addCrew(e);
  });
  addTagForm.addEventListener('submit', e => {
    e.preventDefault();
    addTag(e);
  });
};
window.onload = init;
})();

/******/ })()
;