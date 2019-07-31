chrome.runtime.onMessage.addListener(function(request, sender, callback){
    //console.log("I GOT THE MESSAGE")
    console.log(request)
    
    let xhttp = new XMLHttpRequest()
    
    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/"+request.url, true)
   
    xhttp.send()
    
    xhttp.onload = function() {
        console.log(xhttp.responseText)
        callback(xhttp.responseText)
    }

    return true;

 })