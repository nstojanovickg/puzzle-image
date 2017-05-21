var imgUrl = 'https://s3-eu-west-1.amazonaws.com/wagawin-ad-platform/media/testmode/banner-landscape.jpg';
document.getElementById("puzzle-img").src = imgUrl;
var numCols = 4, numRows = 3,
widthOfPiece = 1280 / numCols, // should not be fixed 1280!
heightOfPiece = 720 / numRows;

var initText = document.getElementById("init-timer-text");
var count=3;
var counter=setInterval(initialTimer, 1000);

function initialTimer() {
    //initText.style.fontSize = 1 + "px";
    //clearInterval(timer);
    if (count == 0)
    {
        clearInterval(counter);
        initText.innerHTML = '';
        startGame();
        return;
    }
    initText.innerHTML = count;
    count--;
    /*
    var timer = setInterval(function(){
        var size = parseInt(initText.style.fontSize);
        initText.style.fontSize = (size+1) + "px";
    },10);
    */
}

var img = new Image();
function startGame() {
    img.onload = cutImageUp;
    img.src = imgUrl;
    document.getElementById('puzzle-container').style.display = 'block';
    moveTimer();
}
var success = false;
function stopGame() {
    var message = success ? 'Game solved' : 'Game lost';
    alert(message);
    location.reload();
}

var shuffledArray = [], originalOrder = [];
var imagePieces = [];
var dragIndex, dropIndex, dragId, dropId;
function cutImageUp() {
    for(var x = 0; x < numRows; ++x) {
        for(var y = 0; y < numCols; ++y) {
            var canvas = document.createElement('canvas');
            canvas.width = widthOfPiece;
            canvas.height = heightOfPiece;
            var context = canvas.getContext('2d');
            context.drawImage(img, y * widthOfPiece, x * heightOfPiece, widthOfPiece, heightOfPiece, 0, 0, canvas.width, canvas.height);
            canvas.setAttribute('id', x+''+y);
            canvas.setAttribute('draggable', true);
            
            // drag&drop events
            canvas.addEventListener("drag", dragDiv, false);
            canvas.addEventListener("dragstart", dragHandle, false);
            canvas.addEventListener("dragover", function( event ) {
                event.preventDefault();
            }, false);
            canvas.addEventListener("drop", dropHandle, false);
            
            imagePieces.push(canvas);
        }
    }
    originalOrder = imagePieces.slice(0);
    shuffledArray = shuffle(imagePieces);
    console.log(originalOrder);
    var puzzle = document.getElementById("puzzle");
    
    document.getElementById('puzzle-img').style.display = 'none';
    
    var i = 0;
    for(var x = 0; x < numRows; ++x) {
        for(var y = 0; y < numCols; ++y) {
            shuffledArray[i].style.left = y * widthOfPiece + 'px';
            shuffledArray[i].style.top = x * heightOfPiece + 'px';
            puzzle.appendChild(shuffledArray[i]);
            i++;
        }
    }
}
var moveEl;
function dragHandle(event) {
    dragId = event.target.id;
    for(var key in shuffledArray) {
        if(dragId == shuffledArray[key].id) {
            dragIndex = key;
            break;
        }
    }
    
    /*
    var canvas = document.createElement('canvas');
    canvas.width = widthOfPiece;
    canvas.height = heightOfPiece;
    var context = canvas.getContext('2d');
    
    moveEl = shuffledArray[dragIndex];
    var tmpdiv = document.getElementById('tmpdiv');
    tmpdiv.appendChild(moveEl);
    //shuffledArray[dragIndex] = canvas;
    console.log(dragIndex);
    puzzle.replaceChild(canvas, puzzle.childNodes[dragIndex]);
    
    //for(var i = 0; i < numCols * numRows; i++) {
    //    puzzle.appendChild(shuffledArray[i]);
    //}
    
    startDrag(event);
    */
}

function dropHandle(event) {
    event.preventDefault();
    /*
    //var tmpdiv = document.getElementById('tmpdiv');
    puzzle.replaceChild(moveEl, puzzle.childNodes[dragIndex]);
    
    moveEl.style.position = 'inherit';
    */
    dropId = event.target.id;
    for(var key in shuffledArray) {
        if (dropId == shuffledArray[key].id) {
            dropIndex = key;
            break;
        }
    }
    //puzzle.removeChild(puzzle.childNodes[parseInt(dragIndex)]);
    
    switchPositions();
    success = checkIfSolved();
}

function switchPositions() {
    var tmp = shuffledArray[dragIndex];
    shuffledArray[dragIndex] = shuffledArray[dropIndex];
    shuffledArray[dropIndex] = tmp; //moveEl
    for(var i = 0; i < numCols * numRows; i++) {
        puzzle.appendChild(shuffledArray[i]);
    }
}

function checkIfSolved() {
    for(var i = 0; i < originalOrder.length; i++) {
        console.log(originalOrder[i].id);
        console.log(shuffledArray[i].id);
        if (originalOrder[i].id !== shuffledArray[i].id) {
            console.log('prc');
            return false;
        }
    }
    return true;
}

function moveTimer() {
    var puzzleColor = document.getElementById("puzzle-timer-color");
    var puzzleTime = document.getElementById("puzzle-timer-time");
    var time = 20, pos = 0, pos2 = 630;
    var move = setInterval(frame, 33.33); // 630*33.33 = 21(seconds)
    var moveTime = setInterval(frameTime, 1000);
    
    function frame() {
        if (pos == 630 || success) {
            clearInterval(move);
            stopGame();
        } else {
            pos++;
            pos2--;
            puzzleColor.style.top = pos + 'px';
            puzzleColor.style.height = pos2 + 'px';
        }
    }
    
    function frameTime() {
        if (time === 0 || success) {
            clearInterval(moveTime);
            stopGame();
        }
        puzzleTime.innerHTML = time;
        time--;
    }
}

var offsetX, offsetY, coordX, coordY;
function startDrag(e) {
    var target = e.target ? e.target : e.srcElement;
    offsetX = e.clientX;
    offsetY = e.clientY;
    coordX = parseInt(target.style.left);
    coordY = parseInt(target.style.top);
    target.style.position = 'absolute';
}
function dragDiv(e) {
    var target=e.target?e.target:e.srcElement;
    // move div element
    target.style.left=coordX+e.clientX-offsetX+'px';
    target.style.top=coordY+e.clientY-offsetY+'px';
}

function shuffle(initArray) {
    var array = initArray.slice(0);
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