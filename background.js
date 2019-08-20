chrome.runtime.onMessage.addListener(function(request, sender, callback){
    let xhttp = new XMLHttpRequest()
    
    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+request.url, true)
   
    xhttp.send()
    
    xhttp.onload = function() {
        callback(xhttp.responseText)
    }
    return true;
 })