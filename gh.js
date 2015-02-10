"use strict";

// yay https://developer.github.com/v3/#cross-origin-resource-sharing

function handleRepoList() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (data.message && data.message.match(/Not Found/)){
        alert("Invalid user.");
    }
    else{
        data.forEach(learnAboutRepo);
    }
}
function learnAboutRepo(repoObj){
    var name = repoObj.name;
    console.log(name);
    var url = repoObj.url + '/contents';
    console.log(url);
    var repoReq = new XMLHttpRequest();
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    repoReq.onload = digInFiles.bind(repoReq, name);
    repoReq.open("get", url, true);
    repoReq.send();
}

function digInFiles(name){
    console.log(name);
    var repo = JSON.parse(this.responseText)
    var found = false;
    console.log(repo);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    repo.reduce(function(old, f, idx, array){
        // !! casts to a boolean. the /i on match makes it case insensitive.
        found = !!(found || f.name.match(/license/i) || f.name.match(/copying/i));
    });
    console.log(found);
}

function getUser(){
    //this function called by clicking the stalk repos button
    var user = document.getElementById('ghuser').value;
    var oReq = new XMLHttpRequest();
    oReq.onload = handleRepoList;
    var url = "https://api.github.com/users/" + user + "/repos";
    oReq.open("get", url, true);
    oReq.send();
    console.log("username " + user);
}
