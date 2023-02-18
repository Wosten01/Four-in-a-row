////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                ОБЪЯВЛЕНИЕ НЕОБХОДИМЫХ ПЕРЕМЕННЫХ И КОНСТАНТ                                        */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
// console.log(innerHeight);
// console.log(innerWidth);
canvas.width = 850;
canvas.height = 850;
const canvasH = canvas.height
const canvasW = canvas.width
// ctx.scale(innerWidth / canvasH, innerHeight / canvasW);
// Прописать зависимость от выбранного варианта
const row = 6;
const col = 7;
const indentX = 5;
const squareSide = (canvasW - 2 * indentX) / col;
const radius = squareSide / 2.65;
const squareSideHalf = squareSide / 2;
const diameter = 2 * radius;
const leftRectIndent = squareSideHalf - radius;
const rightRectIndent = leftRectIndent + diameter;

const indentY = (canvasH - row * squareSide) / 2;
const edge = radius * 0.7;
// Поменять
let limit = 7;

// const playerColor1 = "rgba(245,245,245,1)";
// const playerColor1 = "rgb(129,238,121)";
// const playerColor1 = "#2ee987";
// const playerColor1 = "rgba(70,228,145,0.6)";
const playerColor1 = "rgba(77,247,158,0.6)";
// const playerColor2 = "rgba(249,205,205,1)";
const playerColor2 = "rgba(255, 216, 255, 0.7)";
// const playerColor2 = "rgba(117,175,240,0.7)";
const fieldColor = "rgba(244,172,100,0.8)";
// let lineColor = "rgba(205,3,43,0.7)";
let lineColor = "rgba(198,82,107,0.85)";
// let lineColor1 = "rgba(256,0,100,0.4)";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                             ФУНКЦИИ ЗАПОЛНЕНИЯ ПОЛЯ                                                */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearChip(ctx, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.clip();
    ctx.clearRect(x-radius,y-radius, diameter, diameter);
    ctx.restore();
}

function drawChip(x, y, squareSideHalf, squareSide, color){
    //Возможно имеет смысл поменять // ЧТо поменять?
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

function drawRectWithHole(x, y, squareSide, squareSideHalf, fieldColor, i, j) {
    ctx.fillStyle = fieldColor;
    ctx.lineWidth = 1.7;
    if (i === 0 && j === 0)
        fillRoundedRect00(ctx, x, y, squareSide, squareSide, edge);
    else if (i === 0 && j === 6)
        fillRoundedRect06(ctx, x, y, squareSide, squareSide, edge);
    else if (i === 5 && j === 6)
        fillRoundedRect56(ctx, x, y, squareSide, squareSide, edge);
    else if (i === 5 && j === 0)
        fillRoundedRect50(ctx, x, y, squareSide, squareSide, edge);
    else {
        ctx.lineWidth = 1.3;
        ctx.fillRect(x, y, squareSide, squareSide);
        ctx.strokeRect(x, y, squareSide, squareSide);
    }
    ctx.lineWidth = 0.001;
    clearChip(ctx, x + squareSideHalf, y + squareSideHalf, radius);
}

function fillRoundedRect06(ctx, x, y, w, h, r){
    let halfW = w / 2;
    let halfH = w / 2;
    ctx.beginPath();
    ctx.moveTo(x + halfW, y);
    ctx.arcTo(x + w, y, x + w, y + halfH, r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function fillRoundedRect00(ctx, x, y, w, h, r){
    let halfW = w / 2;
    let halfH = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + halfW, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + halfH);
    ctx.arcTo(x, y, x + halfW, y, r);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function fillRoundedRect56(ctx, x, y, w, h, r){
    let halfW = w / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + halfW);
    ctx.arcTo(x + w, y + h, x + halfW, y + h, r);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function fillRoundedRect50(ctx, x, y, w, h, r){
    let halfW = w / 2;
    let halfH = h / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + halfW, y + h);
    ctx.arcTo(x, y + h, x, y + halfH, r);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function drawTable(ctx, radius,  squareSide, squareSideHalf, fieldColor, lineColor) {

    let arrayRect = [];
    let num = [];

    ctx.strokeStyle = lineColor;

    let x = indentX;
    let y = indentY;

    for(let i = 0; i < row; i++){
        arrayRect.push([]);
        num.push([]);
        for (let j = 0; j < col; j++){
            drawRectWithHole(x, y, squareSide, squareSideHalf, fieldColor, i, j);
            arrayRect[i].push({x1: x + leftRectIndent,x2: x + rightRectIndent,
                               y1: y + leftRectIndent, y2 : y + rightRectIndent, busy : 0})
            x += squareSide;
            num[i].push(0);
        }
        x = indentX;
        y += squareSide;
    }
    ctx.strokeStyle = lineColor;
    return [arrayRect, num];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                    ФУНКЦИИ ОБРАБОТКИ ПОВЕДЕНИЯ И КООРДИНАТ ФИШЕК                                   */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function inArea(area, x, y) {
    return area.x1 <= x && x <= area.x2
        && area.y1 <= y && y <= area.y2;
}

function inAreaAndEmpty(area, x, y) {
    return area.busy === 0 && area.x1 <= x && x <= area.x2
        && area.y1 <= y && y < area.y2;
}

function findArea(x, y){
    let i = 0;
    let j = 0;
    let area;
    while(i < row && j < col){
        area = field[i][j];
        if (x < area.x1 || y < area.y1) {
            break;
        }
        else{
            if (inArea(area, x, y)) {
                if (area.busy === 0){
                    return area;
                }
                else
                    return undefined;
            }
            else {
                if (x > area.x2)
                    j++;
                if (y > area.y2)
                    i++;
            }
        }
    }
    return undefined;
}

function drawOrClearChip(draw, area) {
    if (draw){
        drawChip(area.x1, area.y1, radius, diameter, game.player.color);
    }
    else{
        clearChip(ctx, area.x1 + radius, area.y1 + radius, radius);
    }
}

function findInDoubleArr(arr, area) {
    let i = 0;
    let j = 0;
    while (i < row && j < col){
        if (arr[i][j].y1 === area.y1)
            if (arr[i][j].x1 === area.x1)
                return {i : i, j : j};
            else
                j++;
        else
            i++;
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
    game.player.numOfMoves++;
    // currentArea = undefined;
    // console.log(`i = ${i}, n = ${n}`);
    if (i !== n){
        let pace = 150;

        // setTimeout(() => {clearChip(ctx,arr[n][m].x1 + radius, arr[n][m].y1 + radius, radius);}, pace)
        // setTimeout(() => {drawOrClearChip(true, currentArea)}, pace + 40);

        for (let k = n + 1; k < i; k++){
            if (field[k][m].busy === 0){
                setTimeout(() => {drawChip(arr[k][m].x1, arr[k][m].y1, radius, diameter, color);},
                                  -100 + pace);
                setTimeout(() => {clearChip(ctx,arr[k][m].x1 + radius, arr[k][m].y1 + radius, radius);},
                                  50 + pace);
            }
            pace += 100;
        }

        setTimeout(() => {drawChip(arr[i][m].x1, arr[i][m].y1, radius, diameter, color);}, pace);

        setTimeout(() => {
            if (limit > 1){
                //Возможно будет работать не на всех случаях, но пока работал на всех X)
                let color = game.player.color.split(",");
                color[0] = color[0].split("(")[1];
                let pix;
                for (let i = 0; i < row; i++){
                    for (let j = 0; j < row; j++){
                        if (field[i][j].busy === chip){
                            pix = ctx.getImageData(field[i][j].x1 + radius,
                                                   field[i][j].y1 + radius,
                                                   1,
                                                   1).data;
                            if (pix[0] !== color[0]*1 && pix[1] !== color[1]*1 && pix[2] !== color[2]*1){
                                drawChip(arr[i][j].x1, arr[i][j].y1, radius, diameter, color);
                            }
                        }
                    }
                }
            }
        }, pace + 100);
        // setTimeout(() => drawOrClearChip(true, currentArea), pace/ 2);
    }
    else
        currentArea = undefined;


    // if (currentArea !== undefined){
    //     drawOrClearChip(true, currentArea);
    // }
}

canvas.onmousemove = function (e) {
    if (game !== undefined) {
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;

        if (currentArea === undefined) {
            let newCurrArea = findArea(x, y);
            if (newCurrArea !== undefined) {
                // Случай, когда нужно нарисовать фишку
                drawOrClearChip(true, newCurrArea, x, y);
                currentArea = newCurrArea;
            }
        } else {
            if (!inAreaAndEmpty(currentArea, x, y)) {
                drawOrClearChip(false, currentArea);
                currentArea = undefined;
            }
        }
    }
}

canvas.onmousedown = function () {
    if (game !== undefined) {
        if (game.player.numOfMoves < limit && currentArea !== undefined) {
            drawAndFallChip(game.player.chip, currentArea, game.player.color);
        }
    }
}

canvas.ondblclick = function (e){
    if (game !== undefined) {
        clearSelection();
        if (game.player.lastPos.i !== -1 && game.player.lastPos.j !== -1) {
            let x = e.pageX - canvas.offsetLeft;
            let y = e.pageY - canvas.offsetTop;
            let pos = game.player.lastPos;
            let area = field[pos.i][pos.j];

            if (inArea(area, x, y)) {
                clearChip(ctx, area.x1 + radius, area.y1 + radius, radius);
                game.player.numOfMoves--;
                field[pos.i][pos.j].busy = 0;
                game.nums[pos.i][pos.j] = 0;
            }
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                           ОПИСАНИЕ ИГРОВЫХ МЕХАНИК                                                 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Player {
    constructor(name, chip, color) {
        this.name = name;
        this.chip = chip;
        this.winFlag = false;
        this.winRating = 0;
        //Использую, но почему-то ругается
        this.lastPos = {i: -1, j: -1};
        this.numOfMoves = 0;
        this.color = color;
    }
}

class Game {
    constructor(id, numArr) {
        this.id = id;
        this.playersList = [];
        this.player = undefined;
        this.playerNum = undefined;
        this.nums = numArr;
        this.hasWinner = false;
    }

    getPlayerNum(){
        this.playerNum = this.player.chip - 1;
    }

    getNextPlayerNum(){
        this.playerNum = (this.playerNum + 1 < this.playersList.length) ? ++this.playerNum : 0;
        return this.playerNum;
    }

    setupGame(login1, login2){
        this.player = new Player(login1, 1, playerColor1);
        this.getPlayerNum();
        this.playersList.push(this.player);
        this.playersList.push(new Player(login2, 2, playerColor2));
        // console.log(game);
        let player1 = game.playersList[0];
        let player2 = game.playersList[1];

        document.getElementById("firstPlayerColor").innerHTML = `${player1.name}'s color`;
        document.getElementById("firstPlayerColor").style.backgroundColor = player1.color;

        document.getElementById("secondPlayerColor").innerHTML = `${player2.name}'s color:`;
        document.getElementById("secondPlayerColor").style.backgroundColor = player2.color;

        document.getElementById("currentPlayer").innerText = `Current player: ${game.player.name}`;
        // document.getElementById("currentPlayer").style.backgroundColor = game.player.color;

        document.getElementById("firstPlayerWins").innerHTML = `${player1.name}'s wins: ${player1.winRating}`
        document.getElementById("secondPlayerWins").innerHTML = `${player2.name}'s wins: ${player2.winRating}`
    }

    changePlayers(){
        // console.log("change");
        if (this.hasWinner){
            this.win();
        }
        else if (this.checkWinner(this.nums, this.player.chip)){
            //Добавить появление кнопки рестарта
            toVisible(document.getElementById("RestartButton"));
            this.hasWinner = true;
            this.player.winFlag = true;
            this.player.lastPos = {i: -1, j: -1};
            this.player.winRating += 1;
            document.getElementById("firstPlayerWins").innerHTML = `${game.playersList[0].name}'s wins: ${game.playersList[0].winRating}`
            document.getElementById("secondPlayerWins").innerHTML = `${game.playersList[1].name}'s wins: ${game.playersList[1].winRating}`
            this.block();
            this.win();
        }
        else {
            this.player.numOfMoves = 0;
            this.player.lastPos = {i: -1, j: -1};
            this.player = this.playersList[this.getNextPlayerNum()];
            if (currentArea !== undefined){
                drawOrClearChip(false, currentArea);
                drawOrClearChip(true, currentArea);
            }
            document.getElementById("currentPlayer").innerText = `Current player: ${game.player.name}`;
            // document.getElementById("currentPlayer").style.backgroundColor = game.player.color;
            //Прописать проверку на цвет, чтобы если необходимо сменить цвет
        }
        console.log( game);

        //Здесь отсылать на сервер, если нет ошибок,
        // продолжить смену игроков и игру,
        // иначе вывести баннер победителя, засчитать очко
        // убрать поле и предложить сыграть снова
        // this.num = returned num;
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
    //Обработать ничью
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
                j++;
            }
            j = 0;
            c = 0;
        }
        //Проход по массиву по вертикали
        for (let j = 0; j < col; j++) {
            let i = row - 1;
            while (i >= 0 && c + i + 1 >= 4) {
                if (chip === nums[i][j]){
                    c++;
                    if (c === 4){
                        c = 0;
                        console.log("В");
                        return true;
                    }
                }
                else {
                    c = 0;
                }
                i--;
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
        while(j < (col - 1) / 2){

            if (i > 0){
                i--;
            }
            else{
                j++;
            }
            k = i;
            m = j;
            while (k < row && m < col){
                if (chip === nums[k][m]){
                    c++;
                    if (c === 4){
                        console.log("ПД");
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
            while (k < row && m >= 0){
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

    //Переработать функцию, скорее всего нужно будет это сделать
    // уже после подключения к spring boot
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
    toHide(document.getElementById("RestartButton"));
    game.hasWinner = false;
    for (let i = 0; i < row; i++){
        for (let j = 0; j < col; j++){
            if (num[i][j] !== 0 && num[i][j] !== -1) {
                clearChip(ctx,rect[i][j].x1 + radius, rect[i][j].y1 + radius, radius)
            }
            rect[i][j].busy = 0;
            num[i][j] = 0;
        }
    }
    let player;
    for (let i = 0; i < game.playersList.length; i++) {
        player = game.playersList[i];
        if (!player.winFlag) {
            game.player = player;
            //Я думаю это стоит переписать
            game.getPlayerNum();
        }
        player.winFlag = false;
        player.lastPos = {i: -1, j: -1};
        player.numOfMoves = 0;
    }

}

function startGame(id, login1, login2) {
    game = new Game(id, numArr);
    game.setupGame(login1, login2);
}

function restartGame(){
    clearCanvas(ctx, field, game.nums);
    // console.log("Restart Game");
    console.log(game);
}

function toHide(elem){
    elem.style.display = "none"
}

function toVisible(elem) {
    elem.style.display = "inline-block"
}

let currentArea = undefined;
let game;
let numArr;
let field;
// [field, numArr] = drawTable(ctx, radius,  squareSide, squareSideHalf, fieldColor, lineColor);
login1 = "Иван";
login2 = "Денис";
let canIMove = false;
let isSecondPlayerConnect = false;
// startGame();


function change(){
    console.log(`canIMove = ${canIMove}`);
    console.log(`isSecondPlayerConnect = ${isSecondPlayerConnect}`);
    if (canIMove && isSecondPlayerConnect){
        $.ajax({
            url: url + "/gameplay",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "type": type,
                "coordinateX": xCoordinate,
                "coordinateY": yCoordinate,
                "gameId": gameId
            }),
            success: function (data) {

                gameOn = false;
                displayResponse(data);
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                  КОНЕЦ ФАЙЛА                                                       */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Добавить
    Функционал:
        * Ничья.
        * Автоматический проигрыш при выходе из игры.
        * Починить работу верхнего ряда +
        * Счетчик времени каждого игрока
        *
    Визуал:
        * Добавить окно ожидания при подключении только одного игрока
        * Починить зеленый остаток от зеленой фишки
        * Адаптивность поля
        * Немного переделать ссылку возврата
        * Обновлять то какой цвет показывается при смене игрока +
        * Убрать выделение строчки при двойном клике
        * Оставлять указатель фишки при падении +
      Hotkey:
        Ctrl+Shift+F7
        Ctrl+Shift+I - for images
*/
