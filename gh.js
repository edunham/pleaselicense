"use strict";

// yay https://developer.github.com/v3/#cross-origin-resource-sharing

function handleRepoList() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (data.message){
        if (data.message.match(/Not Found/)){
            alert("Invalid user. Please try with a valid GitHub username.");
        }
        if (data.message.match(/API rate limit/i)){
            console.log("rate limit fail");
            document.getElementById("results").style.display = 'none';
            document.getElementById("instructions").style.display = 'block';
            var message = "It looks like you've exceeded the GitHub API's rate"+
            "limit, which is 60 requests per hour. Try again later, or from a "+
            "different IP address.";
            document.getElementById("instructions").innerHTML = message;
        }
    }
    else{
        data.forEach(learnAboutRepo);
    }
}
function learnAboutRepo(repoObj){
    var name = repoObj.name;
    console.log(name);
    var url = repoObj.url + '/contents';
    var html_url = repoObj.html_url;
    console.log(url);
    var repoReq = new XMLHttpRequest();
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    repoReq.onload = digInFiles.bind(repoReq, name, html_url);
    repoReq.open("get", url, true);
    repoReq.send();
}

function digInFiles(name, link){
    console.log(name);
    var repo = JSON.parse(this.responseText);
    var found = repo.reduce(function(p, f){!!(p || f.name.match(/license/i) || f.name.match(/copying/i));}, false);
    console.log(repo);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    repo.reduce(function(old, f){!!(old || f.name.match(/license/i) || f.name.match(/copying/i));});
    var append = "<li>"+"<a href=\""+link+"\">"+name+"</a></li>";
    console.log(found);
    console.log(append);
    if (found){
        _gaq.push(['users._trackEvent', 'licenseFound', link])
        document.getElementById("goodrepos").innerHTML += append;
    }
    else{
        _gaq.push(['users._trackEvent', 'licenseMissing', link])
        document.getElementById("badrepos").innerHTML += append;
    }
}

function getUser(){
    //this function called by clicking the stalk repos button
    //first, clear any old results
    document.getElementById("goodrepos").innerHTML = "";
    document.getElementById("badrepos").innerHTML = "";
    // find the username being searched, and send request
    var user = document.getElementById('ghuser').value;
    // be stalkey, because why not
    _gaq.push(['users._trackEvent', 'userChecked', user])


    var oReq = new XMLHttpRequest();
    oReq.onload = handleRepoList;
    var url = "https://api.github.com/users/" + user + "/repos";
    oReq.open("get", url, true);
    oReq.send();
    console.log("username " + user);
    //make output visible and hide intsructions
    document.getElementById("results").style.display = 'block';
    document.getElementById("instructions").style.display = 'none';
}

var _gaq = _gaq || [];
_gaq.push(['users._setAccount', 'UA-58732341-2']);

