$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyBoycFgw6uezVlmKmfORR9LgkToRDnPRQg",
        authDomain: "ro-pa-scis.firebaseapp.com",
        databaseURL: "https://ro-pa-scis.firebaseio.com",
        projectId: "ro-pa-scis",
        storageBucket: "",
        messagingSenderId: "358019893985"
      };
    firebase.initializeApp(config);

    var database = firebase.database();
    
    var players = {
        "1": {
        name: "",
        choice: "",
        losses: 0,
        wins: 0,
        chat: "",
        },

        "2": {
        name: "",
        choice: "",
        losses: 0,
        wins: 0,
        chat: "",
        }
    }
    var turn = 0;
    var wins1 = players["1"].wins;
    var wins2 = players["2"].wins;
    var losses1 = players["1"].losses
    var losses2 = players["2"].losses

    $("#wins-1").text(wins1);
    $("#wins-2").text(wins2);
    $("#losses-1").text(losses1);
    $("#losses-2").text(losses2);
    if (turn == 0) {
        $("#player-1-div").css("border-color", "yellow")
    } else {
        $("#player-2-div").css("border-color", "yellow")
    };

    $("#name-box").on("click", function(event) {
        if ($("#player-name").val() === "") {} else {
            event.preventDefault();
            players["1"].name = $("#player-name").val().trim();
            $("#player-1").text(players["1"].name);
            $("#player-1-greeting").css("display", "block");
            database.ref().set({
                players: players,
                turn: turn
            });
        };
    });
    
    
    $("#chat-send").on("click", function(event) {
        if ($("#player-chat").val() === "") {} else {
            event.preventDefault();
            players["1"].chat = $("#player-chat").val().trim();
            $("#chat-box").append(players["1"].name);
            $("#chat-box").append(":" + " ");
            $("#chat-box").append(players["1"].chat);
            $("#chat-box").append("<br>");
            $("#player-chat").text("");
            $("#player-1-name").html(players["1"].name);
            database.ref().set({
                players: players,
                turn: turn
            });
        };
    });

    $(".btn-primary").on("click", function() {
        turn++;
        players["1"].choice = $(this).text();
        console.log(this);
        console.log(players["1"].choice)
        $("#player-1-buttons").html("<h4>" + players["1"].choice + "</h4>");
        database.ref().set({
            players: players,
            turn: turn
        });
        console.log(turn);
    })

    $(".btn-warning").on("click", function() {
        turn++;
        players["2"].choice = $(this).text();
        console.log(this);
        console.log(players["2"].choice)
        $("#player-2-buttons").html("<h4>" + players["2"].choice + "</h4>");
        database.ref().set({
            players: players,
            turn: turn
        });
        console.log(turn);
    })

    database.ref().set({
        players: players,
        turn: turn
    });

    database.ref().on("value", function(snapshot) {
        
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

});