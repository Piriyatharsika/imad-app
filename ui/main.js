console.log('Loaded!');




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