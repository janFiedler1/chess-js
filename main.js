let legalSquares = []
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");
const rand = ['shoes', 'shirt'];

setupBoardSquares();
setUpPieces();

function setupBoardSquares() {
    for(let i=0; i<boardSquares.length; i++) {  //add an event listener for dragging pieces over squares and dropping them
        boardSquares[i].addEventListener("dragover", allowDrop);
        boardSquares[i].addEventListener("drop", drop);
        let row = 8-Math.floor(i/8);
        let column = String.fromCharCode(97+(i%8));   //a-h
        let square = boardSquares[i];
        square.id = column+row;
    }
}

function setUpPieces() {
    console.log(pieces);
    for (let i=0; i<pieces.length; i++){
        pieces[i].addEventListener("dragstart", drag);
        pieces[i].setAttribute("draggable", true);
        pieces[i].id = pieces[i].className.split(" ")[1]+pieces[i].parentElement.id;
    }
    for (let i=0; i<piecesImages.length; i++){
        piecesImages[i].setAttribute("draggable", false);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}


/* 
 * fgkdfgdfgdf
 */

function drag(ev) {
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");
    if((isWhiteTurn && pieceColor=="white" )|| (!isWhiteTurn && pieceColor=="black")) {
        ev.dataTransfer.setData("text", piece.id);  //get the piece id that is getting dragged
    }
}

/*
 * gets the piece ID from the drag function
 * retrieve the piece from the html file
 * 
 */

function drop(ev){
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = ev.currentTarget;
    let destinationSquareId = destinationSquare.id;
    if(isSquareOccupied(destinationSquare)=="blank"){
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        return;
    }
    if(isSquareOccupied(destinationSquare)!="blank"){
        while(destinationSquare.firstChild()) {
            destinationSquare.remove(destinationSquare.firstChild);
            isWhiteTurn = !isWhiteTurn;
            return;
        }
    }
}

function isSquareOccupied(square) {
    if(square.querySelector(".piece")) {
        const color = square.querySelector(".piece").getAttribute("color");
        return color;
    } else {
        return "blank";
    }
}