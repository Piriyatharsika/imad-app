console.log('Loaded!');

//change the content of html with id "main-text" in div

var element = document.getElementById('main-text');
element.innerHTML = 'New Value';


//move image graduate every 50 ms to the right

var image = document.getElementById('madi');
var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 5;
    image.style.marginLeft = marginLeft + 'px';
}
image.onclick = function(){
    var interval = setInterval(moveRight, 50);
};
