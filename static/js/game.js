var ver = true

function redirectHome(){
    var response = confirm('The game will close and you will lose your progress! Do you want to continue?')
    if(response){
        window.location.href = '/'
    }else{
        return
    } 
}


function restartGame(){
    var response = confirm('All progress will be lost! Are you sure you want to restart game? ')
    if(response){
        window.location.href = currentURL
    }else{
        return
    } 
}


function incrementSeconds(){
    let timer = document.getElementById('timer')
    seconds += 1
    if(seconds >= 60){
        var minutes = Math.floor(seconds / 60);
        var sec = seconds - minutes * 60;
        var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(sec,'0',2);
    }else{
        var finalTime = '00:'+seconds
    }
    timer.textContent = finalTime
    return finalTime

}


function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}


const getAllGameSettings = () => {
    let gameSettingsUpdated = [null, "single", null];
    let button = document.getElementById("start-button-link");
    let images = document.querySelectorAll(".card-img-top");
    console.log(images)

    document.addEventListener('click', function () {


        if (event.target.classList.contains('radio-button')) {
            let matchupForm = document.getElementById("matchup-form");

            gameSettingsUpdated[1] = event.target.value;
            if (gameSettingsUpdated[1] == "matchup") {
                matchupForm.style.display = "inline-block";
                matchupForm.style.visibility = "visible";
            }
            else {
                matchupForm.style.display = "none";
                matchupForm.style.visibility = "hidden";
            }
            console.log(gameSettingsUpdated)
        }

        else if (event.target.classList.contains("difficulty")) {

            event.target.classList.add("selected-difficulty");
            let options = document.querySelectorAll(".difficulty");
            for (let i = 0; i < options.length; i++) {
                if (options[i] === event.target) continue;
                options[i].classList.remove("selected-difficulty");
            }
            let tiles_number = event.target.dataset.tiles;
            gameSettingsUpdated[0] = tiles_number.split(",").map(Number);
            console.log(gameSettingsUpdated)
        }

        else if (event.target.classList.contains('card-img-top')) {

            const initialHref = "/game/";
            for (let i = 0; i < images.length; i++) {
                if (images[i] === event.target) {
                    images[i].classList.add("selected-puzzle");
                    button.href = initialHref;
                    let imgName = images[i].dataset.imageName;
                    gameSettingsUpdated[2] = imgName
                    button.href += imgName;
                    continue;
                }
                images[i].classList.remove("selected-puzzle");
            }
            console.log(button.href);
            console.log(gameSettingsUpdated)
        }
        

        else if (event.target.classList.contains('start-game-button')) {

            let player1Name = document.getElementById("player1");
            let player2Name = document.getElementById("player2");

            if (gameSettingsUpdated[1] == "matchup") {
                let player1 = player1Name.value;
                let player2 = player2Name.value;
                if (player1 == "" || player2 == "") {
                  alert("Please choose the players names");
                }
                else {
                    localStorage.setItem("player1", player1)
                    localStorage.setItem("player2", player2)
                }
            }

            if (gameSettingsUpdated[0] == null) {
                alert("Please select a difficulty level");
                button.href = "#";
                return
            }
            else if (gameSettingsUpdated[2] == null) {
                alert("Please select a photo for the puzzle")
                button.href = "#"
                return
            }
            else if (gameSettingsUpdated[2] != null && gameSettingsUpdated[0] != null) {
                var height=gameSettingsUpdated[0][0]
                var width=gameSettingsUpdated[0][1]
                button.href = `/game/${gameSettingsUpdated[2]}` + `?puzzleHeight=${height}&puzzleWidth=${width}`;
            }
        }
        localStorage.setItem("puzzleWidth", gameSettingsUpdated[0][0])
    })
}



function getCategory(){
    let categories = document.querySelectorAll(".category_select")
    for(let catg of categories){
        catg.addEventListener('click',function (event) {
            let catgName=catg.dataset.category;
            catg.href+=catgName;
        })
    }
}



//=============================================================== TESTING =======================================================//

function dragAndDrop() {
    const pieces = document.querySelectorAll('#piece');
    const spots = document.querySelectorAll('#spot');
    let counter = pieces.length**2;
    let check_counter = 0;
    let draggedItem = null;
    let left_pieces = counter;
    let live_count = document.getElementById('cs')
    live_count.innerText += pieces.length.toString()

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];

        piece.addEventListener('dragstart', function () {
            draggedItem = piece;
            setTimeout(function () {
                piece.setAttribute('hidden', 'true')
            }, 0)
        });

        piece.addEventListener('dragend', function () {
            setTimeout(function () {
                draggedItem.removeAttribute('hidden');
                draggedItem = null;


            }, 0)
        });

        for (let j = 0; j < spots.length; j++) {
            const spot = spots[j];

            spot.addEventListener('dragover', function(e) {
                e.preventDefault();
            });
            spot.addEventListener('dragenter', function(e) {
                e.preventDefault();
            });
            spot.addEventListener('drop', function(e) {
                if (draggedItem.dataset.pieceId === this.dataset.spotId){
                    this.append(draggedItem);
                    this.classList.add('correct-piece-placing');
                    counter--;
                    left_pieces = (counter/pieces.length)
                    live_count.innerText = Math.floor(left_pieces).toString()
                    if (counter===check_counter){
                        winnerMessage()
                    }
                }
            });
        }

    }

}


function getSpotSize() {
    let spots= document.getElementById("spot");
    let dif = spots.dataset.dificulty;
    let size = 600 / parseInt(dif);
    return size;

}

function winnerMessage() {
        var modalMessage = document.getElementById("myModalMessage");
        let time = document.getElementById("time")
        modalMessage.style.display = "block";
        var homeButton = document.getElementById('home1')
        homeButton.addEventListener('click', function () {
            window.location.href = '/'

        })
        time.textContent = incrementSeconds()
        clearInterval(interval)
    }



var currentURL = document.URL

if (currentURL.includes('game')) {
    var puzzleWidth = localStorage.getItem("puzzleWidth")
    var spots = document.querySelectorAll("#spot");
    for (let spot of spots ){
        spot.dataset.dificulty=puzzleWidth;
    }
    let size = getSpotSize();
    var spots = document.querySelectorAll("#spot");
    for (let spot of spots ){
        spot.style.width=size+"px";
        spot.style.height=size+"px";
    }
    var seconds = 0
    var interval = setInterval(incrementSeconds, 1000)
    var homeButton = document.getElementById('home')
    homeButton.addEventListener('click', redirectHome)
    var restartButton = document.getElementById('restart')
    restartButton.addEventListener('click', restartGame)
    dragAndDrop()


}else if (currentURL.includes('settings')){
    getAllGameSettings()
}else  {
    getCategory()
}
