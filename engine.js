var imgUrl = 'https://s3-eu-west-1.amazonaws.com/wagawin-ad-platform/media/testmode/banner-landscape.jpg';
document.getElementById("puzzle-img").src = imgUrl;
var numCols = 4, numRows = 3,
widthOfPiece = 1280 / numCols, // should not be fixed 1280!
heightOfPiece = 720 / numRows;


var c = document.createElement('canvas');
var ctx = c.getContext("2d");
var img = new Image();


function cutImageUp() {
    
    var imagePieces = [];
    for(var x = 0; x < numCols; ++x) {
        for(var y = 0; y < numRows; ++y) {
            var canvas = document.createElement('canvas');
            canvas.width = widthOfPiece;
            canvas.height = heightOfPiece;
            var context = canvas.getContext('2d');
            context.drawImage(img, x * widthOfPiece, y * heightOfPiece, widthOfPiece, heightOfPiece, 0, 0, canvas.width, canvas.height);
            imagePieces.push(canvas);
        }
    }
    
    shuffle(imagePieces);
    var puzzle = document.getElementById("puzzle");
    
    document.getElementById('puzzle-img').style.display = 'none';
    var i = 0;
    for(var x = 0; x < numCols; ++x) {
        for(var y = 0; y < numRows; ++y) {
            puzzle.appendChild(imagePieces[i++]);
        }
    }
    
}

var initText = document.getElementById("init-timer-text");
var count=3;
var counter=setInterval(timer, 1000);

function timer()
{
    if (count == 0)
    {
        clearInterval(counter);
        initText.innerHTML = '';
        startGame();
        return;
    }
    initText.innerHTML = count;
    count--;
}

function startGame() {
    img.onload = cutImageUp;
    img.src = imgUrl;
    document.getElementById('puzzle-container').style.display = 'block';
    moveTimer();
}

function stopGame() {
    
}

function moveTimer() {
    var elem = document.getElementById("puzzle-timer-color");   
    var pos = 0;
    var pos2 = 630;
    var move = setInterval(frame, 30); //630:30 = 21(seconds)
    function frame() {
        if (pos == 630) {
            clearInterval(move);
            stopGame();
        } else {
            pos++;
            pos2--;
            elem.style.top = pos + 'px';
            elem.style.height = pos2 + 'px';
        }
    }
}

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    
    return array;
}