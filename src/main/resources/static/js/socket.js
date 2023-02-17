
const url = 'http://localhost:8080';
let stompClient;
let gameId;
let playerNum;
let login1;
let login2;

function connectToSocket(gameId){
    console.log("Connecting to the game");
    let socket = new SockJS(url + "/gameplay/" + gameId);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame){
        console.log("connected to the frame: " + frame);
        stompClient.subscribe("/topic/game-progress/" + gameId, function (response){
            let data = JSON.parse(response.body);
            console.log(data);
        })
        }

    )
}

function createGame(){
    let login = document.getElementById("login").value;
    if (login == null || login === ""){
        alert("Please enter login");
    }
    else{
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
                alert("You're created a game. Game id is: " + gameId);
                window.location.href = "/game/" + gameId ;
            },
            error: function (error){
                alert("Something goes wrong, check console!");
                console.log(error);
            }
        })
    }
}

function connectToRandom(){
    let login = document.getElementById("login").value;
    if (login == null || login === ""){
        alert("Please enter login");
    }
    else{
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
                window.location.href = "/game/" + gameId;
                // console.log(window.document.title);
                // window.document.getElementById("idToPlay").innerHTML = `ID: ${gameId}}`;
            },
            error: function (error){
                alert("Something goes wrong, check console!");
                console.log(error);
            }
        })
    }
}

function connectToSpecificGame(){
    let login = document.getElementById("login").value;
    if (login == null || login === ""){
        alert("Please enter login");
    }
    else{
        let gameId = document.getElementById("gameId").value;
        if (gameId == null || gameId === ""){
            alert("Please enter the Game ID!");
        }
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
                alert("You're playing with:" +  data.player1.login)
                window.location.href = "/game/" + gameId;
                },
            error: function (error){
                alert("Something goes wrong, check console!");
                console.log(error);
            }
        })
    }
}