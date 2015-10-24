(function() {
"use strict";
function rateMessage(){
    console.log("rate limit fail");
    document.getElementById("licenseresults").style.display = 'none';
    document.getElementById("readmeresults").style.display = 'none';
    document.getElementById("instructions").style.display = 'block';
    var message = "It looks like you've exceeded the GitHub API's rate"+
    "limit, which is 60 requests per hour. Try again later, or from a "+
    'different IP address. Alternately, enter a token (as found <a href="https://github.com/settings/tokens">here</a>"';
    document.getElementById("instructions").innerHTML = message;
}
// yay https://developer.github.com/v3/#cross-origin-resource-sharing

function handleRepoList() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (data.message){
        if (data.message.match(/Not Found/)){
            alert("Invalid user. Please try with a valid GitHub username.");
        }
        else if (data.message.match(/API rate limit/i)){
            rateMessage();
        }
        else {
            // make sure an unknown error doesn't get lost in the aether
            var row = document.createElement("li");
            row.appendChild(document.createTextNode(data.message));
            document.getElementById("messages").appendChild(row);
        }
        // TODO, handle 'Bad credentials' more gracefully
    }
    else{
        data.forEach(learnAboutRepo);
    }
}
function learnAboutRepo(repoObj){
    var token = document.getElementById("ghtoken").value;
    var name = repoObj.name;
    console.log(name);
    var url = repoObj.url + '/contents';
    var html_url = repoObj.html_url;
    console.log(url);
    var repoReq = new XMLHttpRequest();
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    repoReq.onload = digInFiles.bind(repoReq, name, html_url);
    repoReq.open("get", url, true);
    if(token.length > 0) {
        repoReq.setRequestHeader("Authorization", "token " + token);
    }
    repoReq.send();
}

function digInFiles(name, link){
    console.log(name);
    var repo = JSON.parse(this.responseText);
    var licensefound = false;
    var readmefound = false;
    repo.forEach(function(repo){
        licensefound = !!(licensefound || repo.name.match(/license/i) || repo.name.match(/copying/i));
        readmefound = !!(readmefound || repo.name.match(/readme/i));
    });
    console.log(repo);
    var append = "";
    if (repo.message){
        // If we got back a message, that means we hit an error of some kind. Add it to the 'messages' thingy just so the user sees *something*
        if (repo.message.match(/API rate limit/i)){
            rateMessage();
        }
        else{
            append = "<li>"+"<a href=\""+link+"\">"+name+"</a>"+repo.message+"</li>";
            document.getElementById("messages").innerHTML += append;
        }
    }
    else{
        // try to do analytics with gaq
        var _gaq = _gaq || [];
        append = "<li>"+"<a href=\""+link+"\">"+name+"</a></li>";
        if (licensefound){
            _gaq.push(['users._trackEvent', 'licenseFound', link])
            document.getElementById("haslicense").innerHTML += append;
        }
        else{
            _gaq.push(['users._trackEvent', 'licenseMissing', link])
            document.getElementById("lackslicense").innerHTML += append;
        }
        if (readmefound){
            _gaq.push(['users._trackEvent', 'readmeFound', link])
            document.getElementById("hasreadme").innerHTML += append;
        }
        else{
            _gaq.push(['users._trackEvent', 'readmeMissing', link])
            document.getElementById("lacksreadme").innerHTML += append;
        }
    }
}

function getUser(){
    //this function called by clicking the stalk repos button
    //first, clear any old licenseresults
    document.getElementById("haslicense").innerHTML = "";
    document.getElementById("lackslicense").innerHTML = "";
    var user = document.getElementById('ghuser').value;
    var token = document.getElementById("ghtoken").value;

    // be stalkey, because why not
    var _gaq = _gaq || [];
    _gaq.push(['users._setAccount', 'UA-58732341-2']);
    _gaq.push(['users._trackEvent', 'userChecked', user])

    var oReq = new XMLHttpRequest();
    oReq.onload = handleRepoList;
    var url = "https://api.github.com/users/" + user + "/repos";
    oReq.open("get", url, true);
    if(token.length > 0) {
        oReq.setRequestHeader("Authorization", "token " + token);
    }
    oReq.send();
    console.log("username " + user);
    //make output visible and hide intsructions
    document.getElementById("licenseresults").style.display = 'block';
    document.getElementById("readmeresults").style.display = 'block';
    document.getElementById("instructions").style.display = 'none';
}
document.querySelector('#ghform').addEventListener('submit', function(ev){
    ev.preventDefault();
    getUser();
    return false;
});

})();
