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
    
    var player1 = null;
    var player2 = null;
    var yourPlayerName = "";
    var player1Choice = "";
    var player2Choice = "";
    var turn = 1;

    database.ref("/players/").on("value", function(snapshot) {
        if (snapshot.child("player1").exists()) {
            console.log("Player 1 exists");
    
            player1 = snapshot.val().player1;
            player1Name = player1.name;
    
            $("#player-1-name").text(player1Name);
            $("#player-1-stats").html("Wins: " + player1.win + ", Losses: " + player1.loss + ", Ties: " + player1.tie);
        } else {
            console.log("Player 1 does NOT exist");
    
            player1 = null;
            player1Name = "";
    
            $("#player-1-name").text("Waiting for Player 1...");
            database.ref("/outcome/").remove();
        }
    
        if (snapshot.child("player2").exists()) {
            console.log("Player 2 exists");
    
            player2 = snapshot.val().player2;
            player2Name = player2.name;
    
            $("#player-2-name").text(player2Name);
            $("#player-2-stats").html("Wins: " + player2.win + ", Losses: " + player2.loss + ", Ties: " + player2.tie);
        } else {
            console.log("Player 2 does NOT exist");
    
            player2 = null;
            player2Name = "";
    
            $("#player-2-name").text("Waiting for Player 2...");
            database.ref("/outcome/").remove();
        }
    
        if (player1 && player2) {
            $("#player-1-div").css("border-color", "yellow")
            $("#result-div").html("<h4>" + player1Name + ", make your choice!</h4>");
        }
    
        if (!player1 && !player2) {
            database.ref("/chat/").remove();
            database.ref("/turn/").remove();
            database.ref("/outcome/").remove();
    
            $("#chat-box").empty();
            $("#player-1-stats").empty();
            $("#player-2-stats").empty();
        }
    });

    $("#name-box").on("click", function(event) {
        event.preventDefault();
    
        if ( ($("#player-name").val().trim() !== "") && !(player1 && player2) ) {
            if (player1 === null) {
                console.log("Adding Player 1");
                yourPlayerName = $("#player-name").val().trim();
                player1 = {
                    name: yourPlayerName,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };
                $("#player-1").text(player1.name);
                $("#player-1-greeting").css("display", "block");
                $("#player-1-buttons").css("display", "block");
                $("#enter-name").css("display", "none");
                console.log(player1);
                console.log(yourPlayerName);
                database.ref().child("/players/player1").set(player1);
    
                database.ref().child("/turn").set(1);
    
                database.ref("/players/player1").onDisconnect().remove();
            } else if( (player1 !== null) && (player2 === null) ) {
                console.log("Adding Player 2");
    
                yourPlayerName = $("#player-name").val().trim();
                player2 = {
                    name: yourPlayerName,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };
                $("#player-2").text(player2.name);
                $("#player-2-greeting").css("display", "block");
                $("#player-2-buttons").css("display", "block");
                $("#enter-name").css("display", "none");
                database.ref().child("/players/player2").set(player2);
    
                database.ref("/players/player2").onDisconnect().remove();
            }
    
            var msg = yourPlayerName + " has joined!";
            console.log(msg);
    
            var chatKey = database.ref().child("/chat/").push().key;
    
            database.ref("/chat/" + chatKey).set(msg);
    
            $("#player-name").val("");	
        }
    });

    database.ref("/turn/").on("value", function(snapshot) {
        if (snapshot.val() === 1) {
            console.log("TURN 1");
            turn = 1;
    
            if (player1 && player2) {
                $("#player-2-div").css("border-color", "black");
                $("#player-1-div").css("border-color", "yellow");
                $("#result-div").html("<h4>" + player1Name + ", make your choice!</h4>");
            }
            if (snapshot.child("/outcome/").exists()) {
                $("body").append("<h4>" + outcome + "!</h4>");
            }

        } else if (snapshot.val() === 2) {
            console.log("TURN 2");
            turn = 2;
    
            if (player1 && player2) {
                $("#player-1-div").css("border-color", "black");
                $("#player-2-div").css("border-color", "yellow");
                $("#result-div").html("<h4>" + player2Name + ", make your choice!</h4>");
            }
            if (snapshot.child("/outcome/").exists()) {
                $("chat-box").append("<h4>" + outcome + "!</h4>");
            }
        }
    });
    database.ref("/chat/").on("child_added", function(snapshot) {
        var chatMsg = snapshot.val();
        var chatEntry = $("<div>").html(chatMsg);
        
        $("#chat-box").append(chatEntry);
        $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight);
    });
    $("#chat-send").on("click", function(event) {
        event.preventDefault();
    
        if ( (yourPlayerName !== "") && ($("#player-chat").val().trim() !== "") ) {
            var msg = yourPlayerName + ": " + $("#player-chat").val().trim();
            $("#player-chat").val("");
    
            var chatKey = database.ref().child("/chat/").push().key;
    
            database.ref("/chat/" + chatKey).set(msg);
        }
    });

    database.ref("/outcome/").on("value", function(snapshot) {
        var outcome = snapshot.val();
        $("#result-div").append(snapshot.val());
        $("#chat-box").append(snapshot.val());
    });

    $("#player-1-div").on("click", ".btn", function(event) {
        event.preventDefault();
    
        if (player1 && player2 && (yourPlayerName === player1.name) && (turn === 1) ) {
            var choice = $(this).text().trim();
    
            player1.choice = choice;
            database.ref().child("/players/player1/choice").set(choice);
    
            turn = 2;
            database.ref().child("/turn").set(2);
        }
    });
    
    $("#player-2-div").on("click", ".btn", function(event) {
        event.preventDefault();
    
        if (player1 && player2 && (yourPlayerName === player2.name) && (turn === 2) ) {
            var choice = $(this).text().trim();
    
            player2.choice = choice;
            database.ref().child("/players/player2/choice").set(choice);
    
            rpsCompare();
            
        }
    });
    function rpsCompare() {
        if (player1.choice === "rock") {
            if (player2.choice === "rock") {
                console.log("tie");
    
                database.ref().child("/outcome/").set("Tie game!");
                database.ref().child("/players/player1/tie").set(player1.tie + 1);
                database.ref().child("/players/player2/tie").set(player2.tie + 1);
            } else if (player2.choice === "paper") {
                console.log("paper wins");
    
                database.ref().child("/outcome/").set("Paper wins!");
                database.ref().child("/players/player1/loss").set(player1.loss + 1);
                database.ref().child("/players/player2/win").set(player2.win + 1);
            } else { 
                console.log("rock wins");
    
                database.ref().child("/outcome/").set("Rock wins!");
                database.ref().child("/players/player1/win").set(player1.win + 1);
                database.ref().child("/players/player2/loss").set(player2.loss + 1);
            }
    
        } else if (player1.choice === "paper") {
            if (player2.choice === "rock") {
                console.log("paper wins");
    
                database.ref().child("/outcome/").set("Paper wins!");
                database.ref().child("/players/player1/win").set(player1.win + 1);
                database.ref().child("/players/player2/loss").set(player2.loss + 1);
            } else if (player2.choice === "paper") {
                console.log("tie");
    
                database.ref().child("/outcome/").set("Tie game!");
                database.ref().child("/players/player1/tie").set(player1.tie + 1);
                database.ref().child("/players/player2/tie").set(player2.tie + 1);
            } else {
                console.log("scissors win");
    
                database.ref().child("/outcome/").set("Scissors win!");
                database.ref().child("/players/player1/loss").set(player1.loss + 1);
                database.ref().child("/players/player2/win").set(player2.win + 1);
            }
    
        } else if (player1.choice === "scissors") {
            if (player2.choice === "rock") {
                console.log("rock wins");
    
                database.ref().child("/outcome/").set("Rock wins!");
                database.ref().child("/players/player1/loss").set(player1.loss + 1);
                database.ref().child("/players/player2/win").set(player2.win + 1);
            } else if (player2.choice === "paper") {
                console.log("scissors win");
    
                database.ref().child("/outcome/").set("Scissors win!");
                database.ref().child("/players/player1/win").set(player1.win + 1);
                database.ref().child("/players/player2/loss").set(player2.loss + 1);
            } else {
                console.log("tie");
    
                database.ref().child("/outcome/").set("Tie game!");
                database.ref().child("/players/player1/tie").set(player1.tie + 1);
                database.ref().child("/players/player2/tie").set(player2.tie + 1);
            }
        }
    
        turn = 1;
        database.ref().child("/turn").set(1);
        // database.ref("/outcome/").on("value", function(snapshot) {
        //     $("#round-outcome").html(snapshot.val());
        // });
    }
});