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
/**var counterElement = document.getElementById('counter');
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
};**/


//Submit login

var submit = document.getElementById('submit_login_btn');
submit.onclick = function(){
    //Make request to the server and send the name
    //Create a request object
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
        // Take some action
        if (request.status === 200) {
           console.log('user logged in');
           alert('Logged in successfully');
        } else if (request.status === 403) {
            alert('Username/password is invalid');
        } else if (request.status === 500) {
            alert('Something went wrong');
        }
        
    }
    //Not done jet ==> ignore
    };
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    
    //Configuration for a POST request
    request.open('POST', 'http://piriya3012.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
    
};


/**var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    //Make request to the server and send the name
    //Create a request object
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
        // Take some action
        if(request.status === 200){
            //Capture a number of name and render all as a list
            var names = request.responseText;
            names = JSON.parse(names);
            var list = '';
            for(var i = 0; i < names.length; i++){
                list += '<li>' + names[i] + '</li>';
            }
            var ul = document.getElementById('namelist');
            ul.innerHTML = list;
        }
        
    }
    //Not done jet ==> ignore
    };
    request.open('GET', 'http://piriya3012.imad.hasura-app.io/submit-name?name=' +name, true);
    request.send(null);
    
};**/