$( document ).ready(function() {
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
        wins: 0
        },

        "2": {
        name: "",
        choice: "",
        losses: 0,
        wins: 0
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
    database.ref().set({
        players: players,
        turn: turn
    });

    database.ref().on("value", function(snapshot) {
        
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

});