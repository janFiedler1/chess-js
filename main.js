let legalSquares = []
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");
const rand = ['shoes', 'shirt'];

setupBoardSquares();
setUpPieces();

/**
 * Add dragover and drop eventlisteneners to all 64 squares.
 * Set id to board coordinates (eg. b5)
 */
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

/**
 * Add dragstart event listener to all 32 pieces and set draggable attribute to true.
 * Set id to piecename + id of square they are on ()
 */

function setUpPieces() {
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


/**
 * Get color by attribute from piece div
 * If it's the current color's turn, get the piece ID and set the datatransfer object to the id
 * to be retrieved by the drop event function
 * and Get possible moves from the piece and starting position
 */

function drag(ev) {
    const piece = ev.target;
    console.log(piece.parentNode.id);
    const pieceColor = piece.getAttribute("color");
    if((isWhiteTurn && pieceColor=="white" )|| (!isWhiteTurn && pieceColor=="black")) {
        ev.dataTransfer.setData("text", piece.id);  //get the piece id that is getting dragged
        const startingSquareId = piece.parentNode.id;
        getPossibleMoves(startingSquareId, piece);
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
    console.log(destinationSquare.id);
    let destinationSquareId = destinationSquare.id;
    if(isSquareOccupied(destinationSquare)=="blank"  && legalSquares.includes(destinationSquareId)){
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0;
        return;
    }
    if(isSquareOccupied(destinationSquare)!="blank" && legalSquares.includes(destinationSquareId)){
        while(destinationSquare.firstChild) {
            destinationSquare.removeChild(destinationSquare.firstChild);
        }
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
        legalSquares.length = 0;
        return;
    }
}

function getPossibleMoves(startingSquareId, piece) {
    const pieceColor = piece.getAttribute("color");
    if(piece.classList.contains("pawn")){
        getPawnMoves(startingSquareId, pieceColor);
    }
    if(piece.classList.contains("knight")){
        getKnightMoves(startingSquareId, pieceColor);
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

function getPawnMoves(startingSquareId, pieceColor){
    checkPawnDiagonalCaptures(startingSquareId, pieceColor);
    checkPawnForwardMoves(startingSquareId, pieceColor);

}

function checkPawnDiagonalCaptures(startingSquareId, pieceColor){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    const direction = pieceColor=="white" ? 1:-1;

    currentRank += direction;
    for(let i=-1;i<=1;i+=2){
        currentFile=String.fromCharCode(file.charCodeAt(0)+i);
        if(currentFile>="a" && currentFile <= "h"){
            currentSquareId = currentFile+currentRank;
            currentSquare = document.getElementById(currentSquareId);
            squareContent=isSquareOccupied(currentSquare);
            if(squareContent != "blank" && squareContent != pieceColor){
                legalSquares.push(currentSquareId);
            }
        }
    }
}

function checkPawnForwardMoves(startingSquareId, pieceColor){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = document.getElementById(currentSquareId);
    let squareContent = isSquareOccupied(currentSquare);
    const direction = pieceColor=="white" ? 1:-1;
    currentRank += direction;
    currentSquareId = currentFile+currentRank;
    currentSquare = document.getElementById(currentSquareId);
    squareContent=isSquareOccupied(currentSquare);
    if(squareContent != "blank")
        return;
        legalSquares.push(currentSquareId);
        if(rankNumber != 2 && rankNumber != 7)
            return;
            currentRank += direction;
            currentSquareId = currentFile+currentRank;
            currentSquare = document.getElementById(currentSquareId);
            squareContent=isSquareOccupied(currentSquare);
            if(squareContent != "blank") return;
            legalSquares.push(currentSquareId);   
}

function getKnightMoves(startingSquareId, pieceColor){
    const file = startingSquareId.charCodeAt(0)-97;
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let currentFile = file;
    let currentRank = rankNumber;

    const moves = [
        [-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1]
    ];
    moves.forEach((move)=>{
        currentFile = file+move[0];
        currentRank = rankNumber+move[1];
        if(currentFile >= 0 && currentFile <= 7 && currentRank > 0 && currentRank<=8){
            let currentSquareId = String.fromCharCode(currentFile+97)+currentRank;
            let currentSquare = document.getElementById(currentSquareId);
            let squareContent = isSquareOccupied(currentSquare);
            if(squareContent != "blank" && squareContent == pieceColor)
                return;
                legalSquares.push(String.fromCharCode(currentFile+97)+currentRank);
        }

    })
}