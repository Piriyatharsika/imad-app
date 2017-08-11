console.log('Loaded!');

//change the content of html with id "main-text" in div
/**
var element = document.getElementById('main-text');
element.innerHTML = 'New Value';


//move image graduate every 50 ms to the right

var image = document.getElementById('madi');
var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 1;
    image.style.marginLeft = marginLeft + 'px';
}
image.onclick = function(){
    var interval = setInterval(moveRight, 50);
};
**/


//Counter
var counterElement = document.getElementById('counter');
var counter = 0;
counterElement.onclick = function(){
    //Create a request object
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
        // Take some action
        if(request.status === 200){
            var counter = request.responseText;
            var count = document.getElementById('count');
            count.innerHTML = counter.toString();
        }
        
    }
    //Not done jet ==> ignore
    };
   //Make a request to the counter endpoint
    request.open('GET', 'http://piriya3012.imad.hasura-app.io/counter', true);
    request.send(null);
};