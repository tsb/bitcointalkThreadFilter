// ==UserScript==
// @name        Bitcointalk thread filter
// @namespace   kazuki.t
// @include     https://bitcointalk.org/index.php?*
// @version     1.01
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
const allSpan = document.querySelectorAll("span");
var spanNodes=[], nodesNum=0;

// Add buttons
document.querySelector("#toppages").innerHTML += " <input value=RECOVER type=button id=recv> <input id=flt type=text><input value=DeleteThem type=button id=alldel>";


// Hide threads
for(let span in allSpan){
    if(allSpan[span].id && allSpan[span].id.match(/msg.*/)){
        spanNodes[nodesNum] = allSpan[span].id;
        let url = allSpan[span].innerHTML.match(/\"https.*\.0\"/)[0].replace(/\"/g, "");
        //console.log(url + ": " + GM_getValue(url));

        // Hide unnecessary thread
        if(GM_getValue(url) > 0){
            specifyParentTrNodeState(allSpan[span], "none");
            console.log("Deleted " + url);
        }

        // Create button
        allSpan[span].innerHTML = allSpan[span].innerHTML.replace(/<a /, "<input value=DEL type=button id=btn" + nodesNum + " title=" + url + "> <a ");
        document.getElementById("btn"+nodesNum).onclick=(function(){
            hideThread(this.title, this.parentNode);
        });
        nodesNum++;
    }
}


// Add filter&delete feature
document.getElementById("alldel").onclick = function(){
    const fltText = document.getElementById("flt").value;

    if(fltText.length < 3){
        alert("Too short! Filter strings must longer than 3.");
        return;
    }

    for(let i=0;i<nodesNum;i++){
        const btni = document.getElementById("btn"+i);
        const url = btni.title;
        if(GM_getValue(url) == null && btni.parentNode.innerHTML.indexOf(fltText) >= 0){
            hideThread(url, btni.parentNode);
        }
    }
};
document.getElementById("flt").onchange = function(){
    const fltText = document.getElementById("flt").value;
    for(let i=0;i<nodesNum;i++){
        const btni = document.getElementById("btn"+i);
        const url = btni.title;
        if(GM_getValue(url) == null){
            if(fltText.length < 3 || btni.parentNode.innerHTML.indexOf(fltText) >= 0){
                specifyParentTrNodeState(btni.parentNode, "");
            }else{
                specifyParentTrNodeState(btni.parentNode, "none");
            }
        }
    }
};

// Add recovery feature(coming back deleted threads in showing page)
document.getElementById("recv").onclick = function(){
    for(let i=0;i<nodesNum;i++){
        const btni = document.getElementById("btn"+i);
        specifyParentTrNodeState(btni, "");
        GM_deleteValue(btni.title);
    }
};

function specifyParentTrNodeState(child, state){console.log(child);
  if(child.parentNode.className)
    child.parentNode.parentNode.style.display=state;
  else if(child.parentNode.parentNode.className)
    child.parentNode.parentNode.parentNode.style.display=state;
  else if(child.parentNode.parentNode.parentNode.className)
    child.parentNode.parentNode.parentNode.parentNode.style.display=state;
}

function hideThread(url, node){
    GM_setValue(url, Date.now());
    specifyParentTrNodeState(node, "none");
}

