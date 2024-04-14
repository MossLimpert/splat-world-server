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
  console.log(body);
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
  console.log(fullUrl);
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
// event handlers
//

// add user
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
    username: username,
    pass: pass
  });
};

// add crew
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

  //console.log(body);

  helper.sendPost(e.target.action, body, helper.displayInfo);
};

// add tag
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

// flag a tag for objectionable content
const flagTag = e => {
  e.preventDefault();
  helper.hideError();
  let uID = null;
  let tID = null;
  uID = e.target.querySelector('#userid').value;
  tID = e.target.querySelector('#tagid').value;
  if (!uID || !tID) {
    helper.handleError('User ID or Tag ID field is empty!');
    return false;
  }
  helper.sendPost(e.target.action, {
    uid: parseInt(uID),
    tid: parseInt(tID)
  });
};

// add location to tag
const addLocation = e => {
  e.preventDefault();
  helper.hideError();
  let tID = null;
  let latitude = null;
  let longitude = null;
  tID = e.target.querySelector('#tagid').value;
  latitude = e.target.querySelector('#latitude').value;
  longitude = e.target.querySelector('#longitude').value;
  console.log(tID, latitude, longitude);
  if (tID === null || latitude === null || longitude === null) {
    helper.handleError('Tag ID or latitude or longitude field is empty!');
    return false;
  }
  helper.sendPost(e.target.action, {
    tid: parseInt(tID),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  });
};
const signup = e => {
  e.preventDefault();
  helper.hideError();
  let username = null;
  let pass1 = null;
  let pass2 = null;
  username = e.target.querySelector('#username').value;
  pass1 = e.target.querySelector('#pass1').value;
  pass2 = e.target.querySelector('#pass2').value;
  if (!username || !pass1 || !pass2) {
    helper.handleError('one or more fields are empty!');
    return false;
  }
  helper.sendPost(e.target.action, {
    username: username,
    pass: pass1,
    pass2: pass2
  });
};

// set up event listeners
const init = () => {
  // form references
  const addUserForm = document.getElementById('add-user-form');
  const addCrewForm = document.getElementById('add-crew-form');
  const addTagForm = document.getElementById('add-tag-form');
  const flagTagForm = document.getElementById('flag-tag-form');
  const addLocationForm = document.getElementById('add-location-form');
  const signupForm = document.getElementById('signup-form');

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
  flagTagForm.addEventListener('submit', e => {
    e.preventDefault();
    flagTag(e);
  });
  addLocationForm.addEventListener('submit', e => {
    e.preventDefault();
    addLocation(e);
  });
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    signup(e);
  });
};
window.onload = init;
})();

/******/ })()
;