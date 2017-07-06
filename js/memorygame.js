var Memory = {};

Memory.array = [1,2,3,4,5,6,7,8,9,10,11,12];

Memory.difficulty = "easy";
Memory.theme = "baby-animals";
Memory.flippedcards = 0;
Memory.wrongGuesses = 0;
Memory.Status = 0;

Memory.createDesign = function(){
    var wrapper = document.getElementById("gamewrapper");
    var columns = 4;
    var rows = 3;
    if(Memory.difficulty == "medium"){
        columns = 6;
        rows = 3;
    }
    else if(Memory.difficulty == "hard"){
        columns = 6;
        rows = 4;
    }
    var array = [1,1,2,2,3,3,4,4,5,5,6,6];
    for(var i=0; i < rows; i++){
        var rowdiv = document.createElement("div");
        wrapper.appendChild(rowdiv);
        for(var j=0; j < columns; j++){
            var coldiv = document.createElement("div");
            coldiv.className = "cardholder";
            coldiv.style.border = "1px solid red";
            coldiv.addEventListener("click", Memory.flipCard);            
            var random = Math.floor(Math.random() * array.length);
            coldiv.setAttribute("name", array[random]);
            array.splice(random, 1);
            //console.log(random + " " + array);
            rowdiv.appendChild(coldiv);
        }
    }
}

Memory.flipCard = function(){
    console.log(Memory.flippedcards);
    var element = event.target;
    if(Memory.flippedcards != 2 && element.className === "cardholder flipped"){
        Memory.unFlipCard();
        Memory.flippedcards--;
    }
    else if(Memory.flippedcards < 2){
        var name = element.getAttribute("name");
        element.style.backgroundImage = "url('./images/" + name + "_" + Memory.theme + ".jpg')";
        element.className += " flipped";
        Memory.flippedcards++;
    }
    if(Memory.flippedcards == 2){
        var cards = document.getElementsByClassName("flipped");
        if(cards.length == 2 && cards[0].getAttribute("name") === cards[1].getAttribute("name")){
            cards[0].removeEventListener("click", Memory.flipCard);
            cards[1].removeEventListener("click", Memory.flipCard);
            cards[1].className = cards[1].className.replace(/ flipped/, " matched");
            cards[0].className = cards[0].className.replace(/ flipped/, " matched");
            Memory.flippedcards = 0;
        }
        else if(cards.length == 2){
            setTimeout(function() {
                    Memory.unFlipCard();
                    Memory.flippedcards = 0;
            }, 2000);
        }
    }
}

Memory.unFlipCard = function(){
    var cards = document.getElementsByClassName("flipped");
    for(var i = cards.length - 1; i >= 0; i--){
        cards[i].style.backgroundImage = "url('./images/texture.jpg')";
        cards[i].className = cards[i].className.replace(/ flipped/, "");
    }
}

Memory.createDesign();