let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//Скорее всего бесполезен в моём случае, так что просто убрать
// let ctx = canvas.getContext("2d",{ willReadFrequently: true });


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
const indent = (canvasH - row * squareSide) / 2;

//Поменять
let limit = 7;

const playerColor1 = "rgba(245,245,245,1)";
const playerColor2 = "rgb(249,205,205)";
const fieldColor = "rgba(244,172,100,0.8)";
let lineColor = "rgba(256,0,100,0.4)";
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
    let num = [];

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = lineColor;

    let x = 0;
    let y = indent;

    for(let i = 0; i < row; i++){
        arrayRect.push([]);
        num.push([]);
        for (let j = 0; j < col; j++){
            drawRectWithHole(x, y, squareSide, squareSideHalf, fieldColor);
            arrayRect[i].push({x1: x + leftRectIndent,x2: x + rightRectIndent,
                               y1: y + leftRectIndent, y2 : y + rightRectIndent, busy : 0})
            x += squareSide;
            num[i].push(0);
        }
        x = 0;
        y += squareSide;
    }
    // lineColor = curPlayer.color;
    ctx.strokeStyle = lineColor;
    return [arrayRect, num];
}

function inArea(elem, x, y) {
    // console.log(elem);
    return elem.x1 < x && x < elem.x2
        && elem.y1 < y && y < elem.y2 ;
}

function inAreaAndEmpty(area, x, y) {
    return area.busy === 0 && area.x1 < x && x < area.x2 && area.y1 < y && y < area.y2;
}
//Переписать без перебора всех значений
function findArea(x, y){
    for(let i = 0; i < row; i++){
        for (let  j = 0; j < col; j++){
            let area = field[i][j];
            if (inAreaAndEmpty(area, x, y)) {
                return area;
            }
        }
    }
    return undefined;
}

function changeCircle(draw, area) {
    if (draw){
        drawCircle(area.x1, area.y1, radius, diameter, game.player.color);
        // console.log("Рисую фишку")
    }
    else{
        clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);
        // console.log("Удаляю")
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

    while (i < row - 1 && arr[i][m].busy === 0) {
        i++;
    }
    if (arr[i][m].busy !== 0){
        i--;
    }

    field.busy = playerNum;
    game.numArr[i][m].busy = playerNum;
    game.player.lastPos = {i: i, j: m};
    currentArea = undefined;
    game.player.numOfMoves++;
    if (i !== n){
        let pace = 100;

        setTimeout(() => {clearCircle(ctx,arr[n][m].x1 + radius, arr[n][m].y1 + radius, radius);}, pace)

        for (let k = n + 1; k < i; k++){
            if (field[k][m].busy === 0){
                setTimeout(() => {drawCircle(arr[k][m].x1, arr[k][m].y1, radius, diameter, color);},  -100 + pace);
                setTimeout(() => {clearCircle(ctx,arr[k][m].x1 + radius, arr[k][m].y1 + radius, radius);}, 50 + pace);
            }
            pace += 100;
        }

        setTimeout(() => {drawCircle(arr[i][m].x1, arr[i][m].y1, radius, diameter, color);}, pace);

        setTimeout(() => {
            if (limit > 1){
                //Возможно будет работать не на всех случаях, но пока работал на всех X)
                let color = game.player.color.split(",");
                color[0] = color[0].split("(")[1];
                let pix;
                for (let i = 0; i < row; i++){
                    for (let j = 0; j < row; j++){
                        if (field[i][j].busy === playerNum){
                            pix = ctx.getImageData(field[i][j].x1 + radius, field[i][j].y1 + radius, 1, 1).data;
                            if (pix[0] !== color[0]*1 && pix[1] !== color[1]*1 && pix[2] !== color[2]*1){
                                drawCircle(arr[i][j].x1, arr[i][j].y1, radius, diameter, color);
                            }

                        }
                    }
                }
            }
        }, pace + 100);
    }
}

canvas.onmousemove = function (e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    if (currentArea === undefined) {
        let newCurrArea = findArea(x, y);
        if (newCurrArea !== undefined){
            // Случай, когда нужно нарисовать фишку
            changeCircle(true, newCurrArea, x, y);
            currentArea = newCurrArea;
        }
    } else {
        if (!inAreaAndEmpty(currentArea, x, y)){
            changeCircle(false, currentArea);
            currentArea = undefined;
        }
    }
    // console.log(currentArea);
}

canvas.onmousedown = function () {
    if (game.player.numOfMoves < limit && currentArea !== undefined){
        drawAndFallChip(field, game.player.chip, currentArea, game.player.color);
    }
}

canvas.ondblclick = function (e){
    clearSelection();
    if (game.player.lastPos.i !== -1 && game.player.lastPos.j !== -1 ) {
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;
        let pos = game.player.lastPos;
        let area = field[pos.i][pos.j];

        if (inArea(area, x, y)){
            clearCircle(ctx, area.x1 + radius, area.y1 + radius, radius);
            game.player.numOfMoves--;
            field[pos.i][pos.j].busy = 0;
            game.numArr[pos.i][pos.j].busy = 0;
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
    constructor(id, num) {
        this.id = id;
        this.playersQueue = new Queue();
        //Правильно обработать или убрать
        this.limit = 0;
        this.player = undefined;
        // Переделать чтобы он сначала заполнять num, а потом Rect
        //Поменять
        this.numArr = num;
    }

    setupGame(){
        this.player = new Player("Иван", 1, playerColor1);
        this.playersQueue.enqueue(new Player("Денис", 2, playerColor2));
        this.limit = limit;
    }

    changePlayers(){
        // this.numArr= fromRectToNum(this.rectArr);
        // console.log(this.rectArr);
        // console.log(this.numArr);

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
    clearCanvas(ctx, field, game.numArr);
    startGame(game);
}

let currentArea = undefined;
let game;
let num;
let field;
[field, num] = drawTable(ctx, radius,  squareSide, squareSideHalf, fieldColor, lineColor);

startGame(game);

