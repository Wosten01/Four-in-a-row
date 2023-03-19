
const url = 'http://localhost:8080';
let stompClient;
let gameId;
let playerNum;
let login1;
let login2;

function connectToSocket(gameId){
    console.log("Connecting to the game");
    let socket = new SockJS(url + "/gameplay");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame){
        console.log("connected to the frame: " + frame);

        stompClient.subscribe("/player/game-progress/" + gameId, function (response){
            let data = JSON.parse(response.body);
            console.log(data);
            // displayResponse(data);
        });
        window.location.href = "/game/" + gameId;
        }
        , function (error){
            console.log(error)
        }
    )
}


function createGame(login){
    // let login = document.getElementById("login").value;
    // if (login == null || login === ""){
    //     alert("Please enter login");
    // }
    // else{
        $.ajax({
            url: url + "/start",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({
                "login": login
            }),
            success: function (data){
                gameId = data.id;
                playerNum = 1;
                //Возможно что-то добавить
                connectToSocket(gameId);
                alert("You're created a game: Game id is: " + data.id);
                // canIMove = true;
            },
            error: function (error){
                alert("Something goes wrong, check console!");
                console.log(error);
            }
        })
    // }
}

function connectToRandom(login){
    // let login = document.getElementById("login").value;
    // if (login == null || login === ""){
    //     alert("Please enter login");
    // }
    // else{
        $.ajax({
            url: url + "/connect/random",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({
                "login": login
            }),
            success: function (data){
                gameId = data.id;
                // console.log(game);
                playerNum = 2;
                //Возможно что-то добавить
                connectToSocket(gameId);
                // console.log(data.player1.login);
                alert("You're playing with:" +  data.player1.login);
                isSecondPlayerConnect = true;
            },
            error: function (error){
                alert("Something goes wrong, check console!");
                console.log(error);
            }
        })
    // }
}

function connectToSpecificGame(login, gameId){
    // let login = document.getElementById("login").value;
    // if (login == null || login === ""){
    //     alert("Please enter login");
    // }
    // else{
        // let gameId = document.getElementById("gameId").value;
        // if (gameId == null || gameId === ""){
        //     alert("Please enter the Game ID!");
        // }
        $.ajax({
            url: url + "/connect",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({
                "player" : {
                    "login" : login
                },
                "gameId": gameId
            }),
            success: function (data){
                gameId = data.id;
                playerNum = 2;
                //Возможно что-то добавить
                connectToSocket(gameId);
                alert("You're playing with:" +  data.player1.login);
                isSecondPlayerConnect = true;
                //Продумать этот момент
                // startGame(data.id, data.player1.login, data.player2.login);
                },
            error: function (error){
                alert("Something goes wrong, check console!");
                console.log(error);
            }
        })
    // }
}

// TODO:Доделать Split Screen
function connectToSplitScreenGame(login1, login2){
    $.ajax({
        url: url + "/connect/split_screen",
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            "player1" : {
                "login" : login1
            },
            "player2" : {
                "login" : login2
            }
        }),
        success: function (data){
            // gameId = data.id;
            playerNum = 2;
            //Возможно что-то добавить
            // connectToSocket(gameId);
            alert("${data.player1.login} VS ${data.player1.login}");
            isSecondPlayerConnect = true;
            //Продумать этот момент
            startGame(0, data.player1.login, data.player2.login);
        },
        error: function (error){
            alert("Something goes wrong, check console!");
            console.log(error);
        }
    })
}



function enterName(connect) {
    let login = prompt("Please, enter your name:", "Player");
    if (login == null || login === "") {
        alert("Invalid name, please try again");
    } else {
        connect(login);
    }
}

function enterGameId(login){
    let gameId = prompt("Please, enter Game Id:", "");
    if (gameId == null || gameId === "") {
        alert("Game with given id does not exist, please try again");
    } else {
        connectToSpecificGame(login, gameId);
    }
}

function enterSecondNameForSplitScreenGame(login1) {
    let login2 = prompt("Please, enter your name:", "Player");
    if (login2 == null || login2 === "") {
        alert("Invalid name, please try again");
    } else {
        connectToSplitScreenGame(login1, login2);
    }
}




