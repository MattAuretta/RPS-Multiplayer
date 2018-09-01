//Link to firebase
var config = {
    apiKey: "AIzaSyB1EAU6IS9coAgiUcQt4hgZyKNBD4lRrAs",
    authDomain: "rps-multiplayer-76412.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-76412.firebaseio.com",
    projectId: "rps-multiplayer-76412",
    storageBucket: "rps-multiplayer-76412.appspot.com",
    messagingSenderId: "537950920733"
};
firebase.initializeApp(config);

var database = firebase.database();

//Initial Values
var playerOne = null;
var playerTwo = null;
var playerOneName = "";
var playerTwoName = "";
var playerOneChoice = "";
var playerTwoChoice = "";
var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;
var turn = 0;

//Listener for adding players to the database
database.ref("/players/").on("value", function (snap) {
    if (snap.child("playerOne").exists()) {
        //Assign playerOne to the values in Firebase
        playerOne = snap.val().playerOne;
        //Update HTML to playerOne name
        $("#player-one-name").text(playerOne.name);
        //Add playerOne stats to HTML
        $("#player-one-stats").text("Wins: " + playerOne.wins + " Losses: " + playerOne.losses);
    } else {
        //If playerOne disconnects update HTML back to "Waiting for Player 1"
        $("#player-one-name").text("Waiting for Player 1");
        //Remove stats
        $("#player-one-stats").text("");
    }

    if (snap.child("playerTwo").exists()) {
        //Assign playerTwo to the values in Firebase
        playerTwo = snap.val().playerTwo;
        //Update HTML to playerTwo name
        $("#player-two-name").text(playerTwo.name);
        //Add playerTwo stats to HTML
        $("#player-two-stats").text("Wins: " + playerTwo.wins + " Losses: " + playerTwo.losses);
    } else {
        //If playerTwo disconnects update HTML back to "Waiting for Player 2"
        $("#player-two-name").text("Waiting for Player 2");
        //Remove stats
        $("#player-two-stats").text("");
    }

    //If playerOne and playerTwo both exist
    if ((snap.child("playerOne").exists()) && (snap.child("playerTwo").exists())) {
        //Show game buttons
        $(".rps").show();
    }
    //If playerOne or playerTwo don't exist
    if (!(snap.child("playerOne").exists()) || !(snap.child("playerTwo").exists())) {
        //Hide game buttons
        $(".rps").hide();
        //Reset turns to 0
        turn = 0;
        database.ref("/turn/").set(turn);
    }
})

//When user clicks submit name button
$("#submit-name").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    //Check if there is no playerOne or playerTwo
    if (!playerOne || !playerTwo) {

        //If there is no playerOne
        if (playerOne === null) {
            //Set playerOne name to name input value
            playerOneName = $("#name-input").val().trim()
            //Create player object
            playerOne = {
                name: playerOneName,
                wins: 0,
                losses: 0,
                choice: playerOneChoice
            }
            //Set playerOne object in the database
            database.ref("/players/playerOne").set(playerOne);
            //Remove playerOne from database on disconnect
            database.ref("/players/playerOne").onDisconnect().remove();

            //Checks if there is a playerOne but still no playerTwo
        } else if (playerOne !== null && playerTwo === null) {
            //Set playerTwo name to name input value
            playerTwoName = $("#name-input").val().trim()
            //Create player object
            playerTwo = {
                name: playerTwoName,
                wins: 0,
                losses: 0,
                choice: playerTwoChoice
            }
            //Set playerTwo object in the database
            database.ref("/players/playerTwo").set(playerTwo);
            //Remove playerTwo from database on disconnect
            database.ref("/players/playerTwo").onDisconnect().remove();
        }
    }

    if(playerOneName == playerOne.name){
        $("#username-form").html("Hi " + playerOneName + "! You are Player 1");
    }

    if(playerTwoName == playerTwo.name){
        $("#username-form").html("Hi " + playerTwoName + "! You are Player 2");
    }
});

$("#submit-chat").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();
});

$("#player-one-display").on("click", ".rps", function () {
    //Make sure only playerOne can click their own buttons
    if (playerOneName == playerOne.name) {
        //Create variable that holds the text of the button the user clicked
        var selectedChoice = $(this).text();
        //Set the playerOneChoice to what was selected
        playerOneChoice = selectedChoice;
        //Set players choice in Firebase
        database.ref("/players/playerOne/choice").set(playerOneChoice);
        $("#player-one-name").append("You chose: " + playerOneChoice);
        //Run game logic function
        runGameLogic();
    }
});

$("#player-two-display").on("click", ".rps", function () {
    //Make sure only playerTwo can click their own buttons
    if (playerTwoName == playerTwo.name) {
        //Create variable that holds the text of the button the user clicked
        var selectedChoice = $(this).text();
        //Set the playerTwoChoice to what was selected
        playerTwoChoice = selectedChoice;
        //Set players choice in Firebase
        database.ref("/players/playerTwo/choice").set(playerTwoChoice);
        $("#player-two-name").append("You chose: " + playerTwoChoice);
        //Run game logic function
        runGameLogic();
    }
});

function runGameLogic() {
    if ((playerOne.choice == "Rock") && (playerTwo.choice == "Scissors")) {
        playerOneWins++
        playerTwoLosses++
        database.ref("/players/playerOne/wins").set(playerOneWins);
        database.ref("/players/playerTwo/losses").set(playerTwoLosses);
    }
    if ((playerOne.choice == "Rock") && (playerTwo.choice == "Paper")) {
        playerTwoWins++
        playerOneLosses++
        database.ref("/players/playerTwo/wins").set(playerTwoWins);
        database.ref("/players/playerOne/losses").set(playerOneLosses);
    }
    if ((playerOne.choice == "Scissors") && (playerTwo.choice == "Paper")) {
        playerOneWins++
        playerTwoLosses++
        database.ref("/players/playerOne/wins").set(playerOneWins);
        database.ref("/players/playerTwo/losses").set(playerTwoLosses);
    }
    if ((playerOne.choice == "Scissors") && (playerTwo.choice == "Rock")) {
        playerTwoWins++
        playerOneLosses++
        database.ref("/players/playerTwo/wins").set(playerTwoWins);
        database.ref("/players/playerOne/losses").set(playerOneLosses);
    }
    if ((playerOne.choice == "Paper") && (playerTwo.choice == "Rock")) {
        playerOneWins++
        playerTwoLosses++
        database.ref("/players/playerOne/wins").set(playerOneWins);
        database.ref("/players/playerTwo/losses").set(playerTwoLosses);
    }
    if ((playerOne.choice == "Paper") && (playerTwo.choice == "Scissors")) {
        playerTwoWins++
        playerOneLosses++
        database.ref("/players/playerTwo/wins").set(playerTwoWins);
        database.ref("/players/playerOne/losses").set(playerOneLosses);
    }
    if (playerOne.choice == playerTwo.choice) {
        $("#outcome-display").text("Tie Game!")
    }
    turn++;
    database.ref("/turn/").set(turn);
}