//http://aboutcode.net/2010/11/11/list-github-projects-using-javascript.html

//var token = "35c265914b8629e34017d7dbf9092e29e956c2a6";
var token="65fb1514e7d0c4f4f3cf347f094190f5289516ab";
// $ curl https://api.github.com/?access_token=OAUTH-TOKEN
$( document ).ready(function() {
jQuery.githubUser = function(username, callback) {
  //jQuery.getJSON("http://github.com/api/v1/json/" + username + "?callback=?", callback);
    //var url = "https://api.github.com/users/"+username+"/repos?access_token="+token+"?callback=?";
    var url = "https://api.github.com/users/"+username+"/repos?callback=?";
    console.log(url);
    //jQuery.getJSON(url, callback);

    $.ajax({
          url: "https://api.github.com/users/"+username+"/repos?callback=?",
          type: 'GET',
          dataType: 'json',
          success: function(data,foo,bar) { console.log(data); },
          error: function() { alert('boo!'); },
          beforeSend: setHeader,
        });

      function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'token '+ token);
      }
}


jQuery.fn.loadRepositories = function(username) {
  this.html("<span>Querying GitHub for repositories...</span>");
  var target = this; 
  $.githubUser(username, function(data) {
    console.log(data.data);
    $( data.data ).each(function(){
        console.log(this.full_name)
        $.repoFiles(this.full_name, function(data){
            console.log(data);
            $(data).each(function(){
                console.log("I GOT ME A DATA");
                console.log(data);
                if (this.name.slice(0,6).toLowerCase() == "license"){
                    console.log("found a license file");
                    console.log(data.data);
                }
            });
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
