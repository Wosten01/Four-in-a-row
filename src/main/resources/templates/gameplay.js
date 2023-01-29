let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const canvasH = canvas.height
const canvasW = canvas.width

// Прописать зависимость от выбранного варинта
const row = 6;
const col = 7;

const squareSide = canvasW / col;
const radius = squareSide / 2.5;
const squareSideHalf = squareSide / 2;
const diameter = 2 * radius;
const leftRectIndent = squareSideHalf - radius;
const rightRectIndent = leftRectIndent + diameter;

//Поменять
let limit = 1;
//
const indent = (canvasH - row * squareSide) / 2;

const playerColor1 = "rgba(256, 256, 256, 1)";
const playerColor2 = "rgb(249,205,205)";
const fieldColor = "rgba(244,172,100,0.8)";
let lineColor = "rgba(256,0,100,0.4)";

// let currentPlayerColor = playerColor1;

let arrayRect = [];

let currentArea = false;
// let game_table = new Path2D();

//Разобраться как работает
function clearCircle(ctx, x,y,radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI, true);
    ctx.clip();
    ctx.clearRect(x-radius,y-radius,radius*2,radius*2);
    ctx.restore();
}

function drawCircle(x, y, squareSideHalf, squareSide, color){
    //Возсожно имеет смысл поменять
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

function drawTable(ctx, radius,  squareSide, squareSideHalf, playerColor1, playerColor2, fieldColor, lineColor) {

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
}

drawTable(ctx, radius, squareSide, squareSideHalf, playerColor1, playerColor2, fieldColor, lineColor);

function between(elem, x, y) {
    return elem.busy < 1 && elem.x1 < x && x < elem.x2 && elem.y1 < y && y < elem.y2;

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


let exist = false;

function runCircle(area, x, y) {
    if (between(area, x, y)){
        if (!exist){
            drawCircle(area.x1, area.y1, radius, diameter, curPlayer.color);
            exist = true;
            // console.log("x= " + x + ", y = " + y);
            // console.log(area);
        }
    }
    else {
       clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);
       currentArea = false;
       exist = false;
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



canvas.onmousemove = function (e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    if (currentArea === false){
        currentArea = findArea(arrayRect,x,y);
        runCircle(currentArea, x, y);
    }
    else {
        runCircle(currentArea, x, y);
    }
}

canvas.onmousedown = function () {
    if (curChips < limit && currentArea !== false){
        drawAndFallChip(arrayRect, curPlayer.chip, currentArea);
        curChips++;
    }
    // нужно ли прописать при отсутвии зоны
}
    //Переписать чтобы он 2 раза одно и тоже не искал
canvas.ondblclick = function (e){
    clearSelection();
    if (curPlayer.lastPos.i !== -1 && curPlayer.lastPos.j !== -1 ) {

        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;

        let area = findAreaWithPlayersChip(arrayRect, x, y, curPlayer.chip, curPlayer.lastPos);

        if (area !== false) {
            let n = findInDoubleArr(arrayRect, area);
            clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);
            if (arrayRect[n.i][n.j].busy !== 0) {
                curChips--;
            }
            arrayRect[n.i][n.j].busy = 0;
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
        this.flag = false;
    }
}

player1 = new Player("Иван", 1, playerColor1);
player2 = new Player("Денис", 2, playerColor2);

let playerQueue = new Queue();

//Аккуратно обработать в классе игры
playerQueue.enqueue(player2);
playerQueue.enqueue(player1);


let curChips = 0;

//Не забыть что эта строчка нужна лишь при отсутствии класса игры
let curPlayer = player1;

function changePlayer() {
    let num = fromRectToNum(arrayRect);
    console.log(num);
    console.log(arrayRect);
    curChips = 0;
    curPlayer.lastPos = {i: -1, j: -1};
    curPlayer = playerQueue.dequeue();
    playerQueue.enqueue(curPlayer);
    // console.log(curPlayer);
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

function drawAndFallChip(arr, playerNum, area){
    let pair = findInDoubleArr(arr, area);
    let n = pair.i;
    let m = pair.j;
    let i = n;
    clearCircle(ctx,arr[n][m].x1 + radius, arr[n][m].y1 + radius, radius);
    while (i < row - 1 && arr[i][m].busy === 0) {
        i++;
        // drawCircle()
    }
    if (arr[i][m].busy !== 0){
        i--;
    }
    arrayRect[i][m].busy = playerNum;
    drawCircle(arr[i][m].x1, arr[i][m].y1, radius, diameter, curPlayer.color);
    curPlayer.lastPos = {i: i, j: m};
    currentArea = false;
}

// function drawAndSaveCircle(array, area, playerNum) {
//
//     // fall(array, n.i, n.j, playerNum);
//     // console.log("i = " + n.i + " j = "+ n.j);
//     // clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);
//     // drawCircle(area.x1, area.y1, radius, diameter, curPlayer.color);
//     // arrayRect[n.i][n.j].busy = playerNum;
//
// }
