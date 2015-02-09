// yay https://developer.github.com/v3/#cross-origin-resource-sharing

function foo(response) {                                                        
    var meta = response.meta;                                                   
    var data = response.data;                                                   
    console.log(meta);                                                          
    console.log(data);   
    data.forEach(checkForLicense);
}                                                                               
function checkForLicense(){
    console.log(this);
    name = this.name;
    console.log(name);
    url = this.html_url;
    console.log(url);

}

var script = document.createElement('script');                                  
script.src = 'https://api.github.com/users/edunham/repos?callback=foo';                             
                                                                                
document.getElementsByTagName('head')[0].appendChild(script);  
