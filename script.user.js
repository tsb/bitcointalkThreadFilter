// ==UserScript==
// @name        Bitcointalk thread filter
// @namespace   kazuki.t
// @include     https://bitcointalk.org/index.php?*
// @version     1.00
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_deleteValue
// @grant    GM_listValues
// @grant    GM_addStyle
// @grant    GM_openInTab
// @grant    GM_xmlhttpRequest
// ==/UserScript==

// Initialize
const page = location.protocol + "//" + location.host + location.pathname + location.search;
var spanNodes=[], nodesNum=0;

// Hide threads
const allSpan = document.querySelectorAll("span");
for(let span in allSpan){
    if(allSpan[span].id && allSpan[span].id.match(/msg.*/)){
        spanNodes[nodesNum] = allSpan[span].id;
        const url = allSpan[span].innerHTML.match(/\"https.*\.0\"/)[0].replace(/\"/g, "");
        console.log(url + ": " + GM_getValue(url));

        // Hide unnecessary thread
        if(GM_getValue(url) > 0){
            allSpan[span].parentNode.parentNode.parentNode.style.display="none";
            console.log("Deleted " + url);
        }

        // Create button
        allSpan[span].innerHTML = allSpan[span].innerHTML.replace(/<a /, "<input value=DEL type=button id=btn" + nodesNum + " title=" + url + "> <a ");
        document.getElementById("btn"+nodesNum).onclick=(function(){
            //alert("test");
            GM_setValue(this.title, Date.now());
            this.parentNode.parentNode.parentNode.parentNode.style.display="none";
        });
        nodesNum++;
    }
}

// Add recovery button
let recoveryParent = document.querySelector("#toppages");
recoveryParent.innerHTML = recoveryParent.innerHTML + " " + "<input value=SHOWALL type=button id=recv>";
document.getElementById("recv").onclick = function(){
  const allSpan = document.querySelectorAll("span");
  for(let span in allSpan){
    if(allSpan[span].id && allSpan[span].id.match(/msg.*/)){
        const url = allSpan[span].innerHTML.match(/href=\"https.*\.0\"/)[0].replace(/\"/g, "").replace(/href=/, "");
        allSpan[span].parentNode.parentNode.parentNode.style.display="";
        GM_deleteValue(url);
    }
  }
};
