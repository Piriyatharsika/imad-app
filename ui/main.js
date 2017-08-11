console.log('Loaded!');

//change the content of html with id "main-text" in div

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


//Counter
var counterElement = document.getElementById('counter');
var counter = 0;
counterElement.onclick = function(){
    //Make a request to the counter endpoint
    
    
    //Capture the response and store it in a variable
    
    
    //Render the variable in the correct span
    counter = counter +1;
    var count = document.getElementById('count');
    count.innerHTML = counter.toString();
    
};