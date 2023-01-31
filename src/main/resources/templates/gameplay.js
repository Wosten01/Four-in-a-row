let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const canvasH = canvas.height
const canvasW = canvas.width

// Прописать зависимость от выбранного варианта
const row = 6;
const col = 7;

const squareSide = canvasW / col;
const radius = squareSide / 2.5;
const squareSideHalf = squareSide / 2;
const diameter = 2 * radius;
const leftRectIndent = squareSideHalf - radius;
const rightRectIndent = leftRectIndent + diameter;

//Поменять
let limit = 7;
//
const indent = (canvasH - row * squareSide) / 2;

const playerColor1 = "rgba(245,245,245,1)";
const playerColor2 = "rgb(249,205,205)";
const fieldColor = "rgba(244,172,100,0.8)";
let lineColor = "rgba(256,0,100,0.4)";

let currentArea = false;

//Разобраться как работает
function clearCircle(ctx, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI, true);
    ctx.clip();
    ctx.clearRect(x-radius,y-radius,radius*2,radius*2);
    ctx.restore();
}

function drawCircle(x, y, squareSideHalf, squareSide, color){
    //Возможно имеет смысл поменять
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + squareSide , y + squareSide / 2)
    ctx.arc(x + squareSide / 2, y + squareSide / 2, radius,
            0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

// Сделать закругления у боковых элементов
function drawRectWithHole(x, y, squareSide, squareSideHalf, fieldColor) {
    ctx.fillStyle = fieldColor;
    ctx.fillRect(x, y, squareSide, squareSide);
    ctx.strokeRect(x, y, squareSide, squareSide);
    clearCircle(ctx, x + squareSideHalf, y + squareSideHalf, radius);
}

function drawTable(ctx, radius,  squareSide, squareSideHalf, fieldColor, lineColor) {

    let arrayRect = [];

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = lineColor;

    let x = 0;
    let y = indent;

    for(let i = 0; i < row; i++){
        arrayRect.push([]);
        for (let j = 0; j < col; j++){
            drawRectWithHole(x, y, squareSide, squareSideHalf, fieldColor);
            arrayRect[i].push({x1: x + leftRectIndent,x2: x + rightRectIndent,
                               y1: y + leftRectIndent, y2 : y + rightRectIndent, busy: 0})
            x += squareSide;
        }
        x = 0;
        y += squareSide;
    }
    // lineColor = curPlayer.color;
    ctx.strokeStyle = lineColor;
    return arrayRect;
}

// drawTable(ctx, radius, squareSide, squareSideHalf, playerColor1, playerColor2, fieldColor, lineColor);

function between(elem, x, y) {
    return elem.busy === 0 && elem.x1 < x && x < elem.x2 && elem.y1 < y && y < elem.y2;

}

function betweenWithChip(elem, x, y, chip) {
    return elem.busy === chip && elem.x1 < x && x < elem.x2
           && elem.y1 < y && y < elem.y2 ;
}

//Переписать с функцией в качестве аргумента

function findArea(arrayRect, x, y){
    for(let i = 0; i < row; i++){
        for (let  j = 0; j < col; j++){
            let elem = arrayRect[i][j];
            if (between(elem, x, y)) {
                return elem;
            }
        }
    }
    return false;
}

function findAreaWithPlayersChip(arrayRect, x, y, chip, pos){
    let elem = arrayRect[pos.i][pos.j];
    if (betweenWithChip(elem, x, y, chip)){
        return elem;
    }
    return false;
}


function runCircle(area, x, y) {
    // Подумать как сделать что-бы при направлении на закрашенный участок не нужно было заново отрисовывать

    if (between(area, x, y)){
        drawCircle(area.x1, area.y1, radius, diameter, game.player.color);
    }
    else {
       clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);
       currentArea = false;
    }
}

function findInDoubleArr(arr, el) {
    for (let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            if (arr[i][j] === el){
                return {i: i, j: j} ;
            }
        }
    }
    return null;
}

function drawAndFallChip(arr, playerNum, area, color){
    let pair = findInDoubleArr(arr, area);
    let n = pair.i;
    let m = pair.j;
    let i = n;
    let pace = 150;
    setTimeout(() => {clearCircle(ctx,arr[n][m].x1 + radius, arr[n][m].y1 + radius, radius);}, pace)
    while (i < row - 1 && arr[i][m].busy === 0) {
        i++;

    }
    if (arr[i][m].busy !== 0){
        i--;
    }

    game.rectArr[i][m].busy = playerNum;
    game.player.lastPos = {i: i, j: m};
    currentArea = false;

    for (let k = n + 1; k < i; k++){
        setTimeout(() => {drawCircle(arr[k][m].x1, arr[k][m].y1, radius, diameter, color);},  -100 + pace);
        setTimeout(() => {clearCircle(ctx,arr[k][m].x1 + radius, arr[k][m].y1 + radius, radius);}, 50 + pace);
        pace += 150;
    }
    setTimeout(() => {drawCircle(arr[i][m].x1, arr[i][m].y1, radius, diameter, color);}, pace)
}

canvas.onmousemove = function (e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    if (currentArea === false){
        currentArea = findArea(game.rectArr, x, y);
        runCircle(currentArea, x, y);
    }
    else {
        runCircle(currentArea, x, y);
    }
}

canvas.onmousedown = function () {
    if (game.player.numOfMoves < limit && currentArea !== false){
        drawAndFallChip(game.rectArr, game.player.chip, currentArea, game.player.color);
        game.player.numOfMoves++;
    }
    // нужно ли прописать при отсутствии зоны
}
    //Переписать чтобы он 2 раза одно и тоже не искал
canvas.ondblclick = function (e){
    clearSelection();
    if (game.player.lastPos.i !== -1 && game.player.lastPos.j !== -1 ) {

        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;

        // console.log(game);

        let area = findAreaWithPlayersChip(game.rectArr, x, y, game.player.chip, game.player.lastPos);

        if (area !== false) {

            let n = findInDoubleArr(game.rectArr, area);
            clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);

            if (game.rectArr[n.i][n.j].busy !== 0) {
                game.player.numOfMoves--;
            }
            game.rectArr[n.i][n.j].busy = 0;
            currentArea = area;

            // console.log("chips= ", curChips);
        }
    }
}

//Кринж, но лучше чем ничего
function clearSelection() {
    if(window.getSelection) {
        let sel = window.getSelection();
        sel.removeAllRanges();
    }
}

function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function() {
    let oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};

class Player {
    constructor(name, chip, color) {
        this.name = name;
        this.chip = chip;
        this.color = color;
        this.lastPos = {i: -1, j: -1};
        this.numOfMoves = 0;
        this.flag = false;
    }
}

function fromRectToNum(arr) {
    let num = [];
    for (let i = 0; i < row; i++){
        num.push([]);
        for(let j = 0; j < col; j++){
            num[i].push(arr[i][j].busy);
        }
    }
    return num;
}

class Game {
    constructor(id, field) {
        this.id = id;
        this.playersQueue = new Queue();
        //Правильно обработать или убрать
        this.limit = 0;
        this.player = undefined;
        // Переделать чтобы он сначала заполнять num, а потом Rect
        this.rectArr = field;
        //Поменять
        this.numArr = fromRectToNum(field);
    }

    setupGame(){
        this.player = new Player("Иван", 1, playerColor1);
        this.playersQueue.enqueue(new Player("Денис", 2, playerColor2));
        this.limit = limit;
    }

    changePlayers(){
        this.numArr= fromRectToNum(this.rectArr);
        console.log(this.rectArr);
        console.log(this.numArr);

        //Здесь отсылать на сервер, если нет ошибок,
        // продолжить смену игроков и игру,
        // иначе вывести баннер победителя, засчитать очко
        // убрать поле и предложить сыграть снова
        // this.num = returned num;

        this.player.numOfMoves = 0;
        this.player.lastPos = {i: -1, j: -1};
        this.playersQueue.enqueue(this.player);
        this.player = this.playersQueue.dequeue();
        // console.log(this.player);
    }

    checkWinner(){

    }

}

function clearCanvas(ctx, rect, num) {
    for (let i = 0; i < row; i++){
        for (let j = 0; j < col; j++){
            if (num[i][j] !== 0) {
                clearCircle(ctx,rect[i][j].x1 + radius, rect[i][j].y1 + radius, radius)
                rect[i][j].busy = 0;
                num[i][j].busy = 0;
            }
        }
    }
}


function startGame() {
    game = new Game(123, field);
    game.setupGame();
}

function restartGame(){
    clearCanvas(ctx, game.rectArr, game.numArr);
    startGame(game);
}

let game;
let field;
field = drawTable(ctx, radius,  squareSide, squareSideHalf, fieldColor, lineColor);
// startGame(game);
startGame(game);
// game = new Game(123);
// game.setupGame()
// console.log(game);
//Переписать чтобы была видна game в canvas и чтобы её не приходилось перерисовывать


//Обработать так, чтобы при падении фишки не потерять фишку,
// которую можно поставить ниже, правда имеет смысл только при
// добавлении нескольких фишек за раз

