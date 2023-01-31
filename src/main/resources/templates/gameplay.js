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
let limit = 4;

const playerColor1 = "rgba(245,245,245,1)";
const playerColor2 = "rgba(249,205,205,1)";
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

function drawAndFallChip(chip, area, color){
    //Переписать этот кринж с поиском пары и шизу с arr
    let arr = field;
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

    field[i][m].busy = chip;
    game.nums[i][m] = chip;
    game.player.lastPos = {i: i, j: m};
    currentArea = undefined;
    game.player.numOfMoves++;
    if (i !== n){
        let pace = 150;

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
                        if (field[i][j].busy === chip){
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
}

canvas.onmousedown = function () {
    if (game.player.numOfMoves < limit && currentArea !== undefined){
        drawAndFallChip(game.player.chip, currentArea, game.player.color);
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
            game.nums[pos.i][pos.j] = 0;
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

Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

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
        //Использую, но почему-то ругается
        this.lastPos = {i: -1, j: -1};
        this.numOfMoves = 0;
        this.winFlag = false;
    }
}

class Game {
    constructor(id, numArr) {
        this.id = id;
        this.playersQueue = new Queue();
        this.player = undefined;
        this.nums = numArr;
        this.hasWinner = false;
    }

    setupGame(){
        this.player = new Player("Иван", 1, playerColor1);
        this.playersQueue.enqueue(new Player("Денис", 2, playerColor2));
        this.playersQueue.enqueue(this.player);
    }

    changePlayers(){
        console.log("change");
        if (this.hasWinner){
            this.win();
        }
        else if (this.checkWinner(this.nums, this.player.chip)){
            this.hasWinner = true;
            this.player.winFlag = true;
            this.player.lastPos = {i: -1, j: -1};
            this.block();
            this.win();
        }
        else {
            this.player.numOfMoves = 0;
            this.player.lastPos = {i: -1, j: -1};
            this.player = this.playersQueue.dequeue();
            this.playersQueue.enqueue(this.player);
        }
        // console.log(game.playersQueue);
        // this.playersQueue.enqueue(this.player);

        //Здесь отсылать на сервер, если нет ошибок,
        // продолжить смену игроков и игру,
        // иначе вывести баннер победителя, засчитать очко
        // убрать поле и предложить сыграть снова
        // this.num = returned num;

        //
        // console.log("change")
        // console.log(game.player)
        // console.log(game.playersQueue);
    }

    block(){
        for(let i = 0; i < row; i++){
            for (let j = 0; j < col; j++){
                if (field[i][j].busy === 0){
                    field[i][j].busy = -1;
                }
            }
        }
    }

    // Сделать более оптимизированную проверку диагоналей (в целом и так норм, можно и забить)
    checkWinner(nums, chip){
        let c = 0;
        //Проход по массиву по горизонталям
        for (let i = 0; i < row; i++) {
            let j = 0;
            while (j < col && col - j + c >= 4) {
                if (chip === nums[i][j]){
                    c++;
                    if (c === 4){
                        console.log("Г")
                        return true;
                    }
                }
                else{
                    c = 0;
                }
                // console.log(`i = ${i}, j = ${j}`)
                // console.log(c);
                j++;
            }
            j = 0;
            c = 0;
        }
        //Проход по массиву по вертикали
        for (let j = 0; j < col; j++) {
            let i = row - 1;
            while (i >= 0 && c + i + 1 >= 4) {
                // console.log(`c = ${c}`);
                if (chip === 0) {
                    c = 0;
                    break;
                }
                else if (chip === nums[i][j]){
                    c++;
                    // console.log(c);
                    if (c === 4){
                        c = 0;
                        console.log("В");
                        return true;
                    }
                }
                // console.log(`i = ${i}, j = ${j}`)
                // console.log(c);

                i--;
                // console.log(i);
            }
            i = row - 1;
            c = 0;
        }

        //Проход по массиву по диагонали от левого края
        let j = 0;
        let i = row / 2;
        let k;
        let m;
        c = 0;
        // console.log(col/2);
        while(j < (col - 1) / 2){

            if (i > 0){
                i--;
            }
            else{
                j++;
            }
            k = i;
            m = j;
            // console.log("\n")
            while (k < row && m < col){
                if (chip === nums[k][m]){
                    c++;
                    console.log(`i = ${k}, j = ${m}`)
                    if (c === 4){
                        console.log("ПД");
                        console.log(nums);

                        return true
                    }
                }
                else{
                    c = 0;
                }
                k++;
                m++;
            }
            c = 0;
        }

        //Проход по массиву по диагонали от правого края
        i = row / 2;
        j = col - 1;
        while(j > (col - 1) / 2 ){
            if (i > 0){
                i--;
            }
            else{
                j--;
            }
            k = i;
            m = j;
            // console.log("\n")
            while (k < row && m >= 0){
                // console.log(`i = ${k}, j = ${m}`)
                if (chip === nums[k][m]){
                    c++;
                    if (c === 4){
                        console.log("ОД");
                        return true
                    }
                }
                else{
                    c = 0;
                }
                k++;
                m--;
            }
            c = 0;
        }
        return false;
    }

    win(){
        this.banner()
    }

    banner(){
        if (game.player.winFlag){
            alert(`Congratulations, ${game.player.name}, you are Winner`)
        }
        else {
            alert(`Sorry, ${game.player.name}, but you lose`)
        }
    }

}

function clearCanvas(ctx, rect, num) {
    game.hasWinner = false;
    // console.log(game.playersQueue);
    // console.log(game.nums);
    for (let i = 0; i < row; i++){
        for (let j = 0; j < col; j++){
            if (num[i][j] !== 0 && num[i][j] !== -1) {
                clearCircle(ctx,rect[i][j].x1 + radius, rect[i][j].y1 + radius, radius)
            }
            rect[i][j].busy = 0;
            num[i][j] = 0;
        }
    }
    // console.log("Field and nums after delete");
    // console.log(game.nums);
    // console.log(field);
    console.log(game.playersQueue);
    let size = game.playersQueue.size();
    let player;
    for (let i = 0; i < size; i++) {
        player = game.playersQueue.dequeue();
        player.winFlag = false;
        player.lastPos = {i: -1, j: -1};
        player.numOfMoves = 0;
        if (i + 1 === size) {
            game.player = player;
        }
        game.playersQueue.enqueue(player);
    }
    // console.log("clear")
    // console.log(game.player)
    console.log(game.playersQueue);

}

function startGame() {
    game = new Game(123, numArr);
    game.setupGame();
}

function restartGame(){
    clearCanvas(ctx, field, game.nums);
}

let currentArea = undefined;
let game;
let numArr;
let field;
// let WinnerFlag = false;
[field, numArr] = drawTable(ctx, radius,  squareSide, squareSideHalf, fieldColor, lineColor);
startGame(game);