var Memory = {};

Memory.cardNames = [1,2,3,4,5,6,7,8,9,10,11,12];
Memory.difficulty = "easy";
Memory.theme = "babyanimals";
Memory.wrongGuesses = 0;
Memory.Status = 0;
Memory.playerName = "";
Memory.flip = 0;
Memory.highScore = {};
Memory.maxScore = 6;

//Start game with Start button
Memory.startGame = function(){
    document.getElementById("newgame").addEventListener("click", Memory.newGame);
    document.getElementById("startscreen").style.display = "none";
    document.getElementById("options-button").style.display = "block";
    document.getElementById("information").style.display = "block";
    document.getElementsByClassName("background")[0].style.padding = "0";
    var difficulty = document.getElementsByName("difficulty");
    var theme = document.getElementsByName("theme");
    for(var i=0; i < difficulty.length; i++){
        if(difficulty[i].checked === true){
            Memory.difficulty = difficulty[i].value;
        }
    }
    for(var i=0; i < theme.length; i++){
        if(theme[i].checked === true){
            Memory.theme = theme[i].value;
        }
    }

    Memory.playerName = document.getElementById("playername").value;
    Memory.createDesign();
}

//Create a new game layout with new game button
Memory.newGame = function(){
    var difficulty = document.getElementsByName("difficulty2");
    var theme = document.getElementsByName("theme2");
    document.getElementById("youwin").style.display = "none";
    for(var i=0; i < difficulty.length; i++){
        if(difficulty[i].checked === true){
            Memory.difficulty = difficulty[i].value;
        }
    }
    for(var i=0; i < theme.length; i++){
        if(theme[i].checked === true){
            Memory.theme = theme[i].value;
        }
    }
    Memory.wrongGuesses = 0;
    document.getElementById("guess").innerHTML = "Wrong Guesses : " + Memory.wrongGuesses;
    Memory.createDesign();
}

//Dynamically create game structure and reset few global variables
Memory.createDesign = function(){
    var wrapper = document.getElementById("gamewrapper");
    wrapper.style.display = "inline-block";
    wrapper.innerHTML = "";
    var columns = 4;
    var rows = 3;
    Memory.maxScore = 6;
    Memory.Status = 0;
    Memory.highScore = {};
    if(localStorage[Memory.difficulty] != undefined){
        Memory.highScore = JSON.parse(localStorage[Memory.difficulty]);
    }
    
    if(Memory.highScore.name != undefined){
        document.getElementById("bestscore").innerHTML = "Least Wrong Guesses by " + Memory.highScore.name + " : " + Memory.highScore.score;
    }
    else{
        document.getElementById("bestscore").innerHTML = "No High Score Yet In This Difficulty";
    }

    //Generate counts of rows and columns based on difficulty level
    if(Memory.difficulty == "medium"){
        columns = 6;
        rows = 3;
        Memory.maxScore = 9;
    }
    else if(Memory.difficulty == "hard"){
        columns = 6;
        rows = 4;
        Memory.maxScore = 12;
    }
    var cardNames = Memory.generateCardNames(columns, rows);
    //Create dynamic game structure
    for(var i=0; i < rows; i++){
        var rowdiv = document.createElement("div");
        wrapper.appendChild(rowdiv);
        for(var j=0; j < columns; j++){
            var coldiv = document.createElement("div");
            coldiv.className = "cardholder";
            coldiv.style.backgroundImage = "url('./images/" + Memory.theme + "/texture.jpg')";
            coldiv.addEventListener("click", Memory.flipCard);            
            var random = Math.floor(Math.random() * cardNames.length);
            coldiv.setAttribute("name", cardNames[random]);
            cardNames.splice(random, 1);
            rowdiv.appendChild(coldiv);
        }
    }
}

//Generate a random array depending on difficulty level
Memory.generateCardNames = function(columns, rows){
    var count = (columns * rows) / 2;
    var tempArray = Memory.cardNames.slice(0);
    var returnArray = [];
    for(var i=0; i < count; i++){
        var random = Math.floor(Math.random() * tempArray.length);
        returnArray.push(tempArray[random]);
        returnArray.push(tempArray[random]);
        tempArray.splice(random, 1);
    }
    return returnArray;
}

//Flip the clicked card and also check that not more then 2 cards are flipped at the same moment
Memory.flipCard = function(){
    var element = event.target;
    var flippedCards = document.getElementsByClassName("flipped");
    if(flippedCards.length < 2 && Memory.flip == 0){
        var name = element.getAttribute("name");
        element.style.backgroundImage = "url('./images/" + Memory.theme + "/" + name + ".jpg')";
        element.classList.add("flipped");
    }

    flippedCards = document.getElementsByClassName("flipped");
    if(flippedCards.length == 2){
        Memory.flip = 1;
        setTimeout(function() {
            Memory.unFlipCards(flippedCards);
            Memory.flip = 0;
        }, 1000);
    }
}

//Function to verify about the two flipped cards
Memory.unFlipCards = function(flippedCards){
    if(flippedCards.length == 2){
        //Check if both flipped cards are same or no
        if(flippedCards[0].getAttribute("name") === flippedCards[1].getAttribute("name")){
            flippedCards[1].removeEventListener("click", Memory.flipCard);
            flippedCards[1].className = flippedCards[1].className.replace(/ flipped/, " matched");
            flippedCards[0].removeEventListener("click", Memory.flipCard);
            flippedCards[0].className = flippedCards[0].className.replace(/ flipped/, " matched");
            Memory.Status++;
            if(Memory.Status === Memory.maxScore){
                document.getElementById("youwin").style.display = "block";
                //Display highscore for that particular difficulty
                if(Memory.highScore.name != undefined){
                    var tempScore = {};
                    if(Memory.wrongGuesses < Memory.highScore.score && Memory.playerName != ""){
                        tempScore.name = Memory.playerName,
                        tempScore.score = Memory.wrongGuesses
                        localStorage[Memory.difficulty] = JSON.stringify(tempScore);
                        
                    }
                    Memory.highScore = JSON.parse(localStorage[Memory.difficulty]);
                    document.getElementById("bestscore").innerHTML = "Least Wrong Guesses by " + Memory.highScore.name + " : " + Memory.highScore.score;
                }
                else if(Memory.playerName != ""){
                    var tempScore = {
                            name:Memory.playerName,
                            score:Memory.wrongGuesses
                        };
                    localStorage[Memory.difficulty] = JSON.stringify(tempScore);
                    Memory.highScore = JSON.parse(localStorage[Memory.difficulty]);
                    document.getElementById("bestscore").innerHTML = "Least Wrong Guesses by " + Memory.highScore.name + " : " + Memory.highScore.score;
                }
            }
        }
        //Unflip the two cards if they are not same.
        else{
                flippedCards[1].style.backgroundImage = "url('./images/" + Memory.theme + "/texture.jpg')";
                flippedCards[1].classList.remove("flipped");
                flippedCards[0].style.backgroundImage = "url('./images/" + Memory.theme + "/texture.jpg')";
                flippedCards[0].classList.remove("flipped");
                Memory.wrongGuesses++;
                document.getElementById("guess").innerHTML = "Wrong Guesses : " + Memory.wrongGuesses;
        }
    }
}

//Basic add event for start game
Memory.addEvents = function(){
    document.getElementById("start").addEventListener("click", Memory.startGame);
}

Memory.addEvents();