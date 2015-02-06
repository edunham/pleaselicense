//http://aboutcode.net/2010/11/11/list-github-projects-using-javascript.html
$( document ).ready(function() {
jQuery.githubUser = function(username, callback) {
  //jQuery.getJSON("http://github.com/api/v1/json/" + username + "?callback=?", callback);
    jQuery.getJSON("https://api.github.com/users/"+username+"/repos?callback=?", callback);
}

jQuery.fn.loadRepositories = function(username) {
  this.html("<span>Querying GitHub for repositories...</span>");
  var target = this; 
  $.githubUser(username, function(data) {
    console.log(data.data);
    $( data.data ).each(function(){
        console.log(this.full_name)
        $.repoFiles(this.full_name, function(data){
            console.log("IN THE CALLBACK");
            console.log(data);
            if (data.data.name.slice(0,6).toLowerCase() == "license"){
                console.log("found a license file");
                console.log(data.data);
            }
        });


    });


/*
    var list = $('<dl/>');
    target.empty().append(list);
    $(repos).each(function() {
      list.append('<dt><a href="'+ this.url +'">' + this.name + '</a></dt>');
      list.append('<dd>' + this.description + '</dd>');
    }); */
  });

jQuery.repoFiles = function(fullname, callback) {
        jQuery.getJSON("https://api.github.com/repos/"+fullname+"/contents?callback=?", callback);
    }
/*
  function sortByNumberOfWatchers(repos) {
    repos.sort(function(a,b) {
      return b.watchers - a.watchers;
    });
  }*/
};

});
