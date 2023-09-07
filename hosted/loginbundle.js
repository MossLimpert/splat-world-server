(()=>{var e={603:e=>{const r=e=>{document.getElementById("errorMessage").textContent=e,document.getElementById("message").classList.remove("hidden")};e.exports={handleError:r,sendPost:async(e,t,o)=>{const n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),a=await n.json();document.getElementById("message").classList.add("hidden"),a.redirect&&(window.location=a.redirect),a.error&&r(a.error),o&&o(a)},hideError:()=>{document.getElementById("message").classList.add("hidden")},convertHexRGB:e=>{let r=e.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);return{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}}}}},r={};function t(o){var n=r[o];if(void 0!==n)return n.exports;var a=r[o]={exports:{}};return e[o](a,a.exports,t),a.exports}(()=>{const e=t(603);window.onload=()=>{const r=document.getElementById("add-user-form"),t=document.getElementById("add-crew-form"),o=document.getElementById("add-tag-form");r.addEventListener("submit",(r=>{r.preventDefault(),(r=>{r.preventDefault(),e.hideError();const t=r.target.querySelector("#user").value,o=r.target.querySelector("#userpass").value;if(!t||!o)return e.handleError("Username or password is empty!"),!1;e.sendPost(r.target.action,{username:t,pass:o})})(r)})),t.addEventListener("submit",(r=>{r.preventDefault(),(r=>{r.preventDefault(),e.hideError();const t=r.target.querySelector(".crewname").value,o=r.target.querySelector("#crewpass").value;let n=r.target.querySelector("#color").value;const a=r.target.querySelector("#owner").value,s=e.convertHexRGB(n);if(!t||!o||!a)return e.handleError("Crew name, password, or owner ID missing!"),!1;const d={name:t,pass:o,owner:a,color_r:s.r,color_g:s.g,color_b:s.b};console.log(d),e.sendPost(r.target.action,d)})(r)})),o.addEventListener("submit",(r=>{r.preventDefault(),(r=>{r.preventDefault(),e.hideError();const t=r.target.querySelector("#title").value,o=r.target.querySelector("#userid").value,n=r.target.querySelector("#crewid").value;if(!o||!n||!t)return e.handleError("Title, User ID, or Crew ID field is empty!"),!1;e.sendPost(r.target.action,{author_ref:parseInt(o),crew:parseInt(n),title:t})})(r)}))}})()})();