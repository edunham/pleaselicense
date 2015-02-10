// yay https://developer.github.com/v3/#cross-origin-resource-sharing

function handleRepoList() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    data.forEach(learnAboutRepo);
}
function learnAboutRepo(repoObj){
    var name = repoObj.name;
    console.log(name);
    var url = repoObj.url + '/contents';
    console.log(url);
    var repoReq = new XMLHttpRequest();
    repoReq.onload = digInFiles;
    repoReq.open("get", url, true);
    repoReq.send();
}

function digInFiles(){
    var repo = JSON.parse(this.responseText)
    var found = false;
    console.log(repo);
    repo.reduce(function(old, f, idx, array){
        found = !!(found || f.name.match(/license/i) || f.name.match(/copying/i));
    });
    console.log(found);
}

console.log("don't worry, it's working");
var oReq = new XMLHttpRequest();
oReq.onload = handleRepoList;
oReq.open("get", "https://api.github.com/users/marajade/repos", true);
oReq.send();

