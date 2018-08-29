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
var wins = 0;
var losses = 0;
var ties = 0;
var players = 0;

database.ref("/players/").on("value", function (snap) {
    if (snap.child("playerOne").exists()) {
        console.log("playerOne exists");
        playerOne = snap.val().playerOne;
        console.log(playerOne)
    }

    if (snap.child("playerTwo").exists()) {
        console.log("playerTwo exists");
        playerTwo = snap.val().playerTwo;
        console.log(playerTwo)
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
                choice: ""
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
                choice: ""
            }
            //Set playerTwo object in the database
            database.ref("/players/playerTwo").set(playerTwo);
            //Remove playerTwo from database on disconnect
            database.ref("/players/playerTwo").onDisconnect().remove();
        }
    }

});