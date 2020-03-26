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
    var timer = document.getElementById('timer')
    seconds += 1
    if(seconds >= 60){
        var minutes = Math.floor(seconds / 60);
        var sec = seconds - minutes * 60;
        var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(sec,'0',2);
    }else{
        var finalTime = '00:'+seconds
    }
    timer.textContent = finalTime

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
            gameSettingsUpdated[1] = event.target.value;
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
                button.href = `/game/${gameSettingsUpdated[2]}`;
            }
        }
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
    let counter = pieces.length
    let check_counter = counter**2 -counter
    let draggedItem = null;

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
        })

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
                    console.log(draggedItem.dataset.pieceId)
                    console.log(this.dataset.spotId)
                    this.append(draggedItem)
                     counter--
                    console.log(counter)
                    if (counter===-check_counter){
                        alert('Great job')

                    }}

            });
        }
    }
}


var currentURL = document.URL

if (currentURL.includes('game')) {
    var seconds = 0
    var timeCounter = setInterval(incrementSeconds, 1000)
    timeCounter
    var homeButton = document.getElementById('home')
    homeButton.addEventListener('click', redirectHome)
    var restartButton = document.getElementById('restart')
    restartButton.addEventListener('click', restartGame)
    dragAndDrop()

    var leftPanel = document.getElementById('')
}else if (currentURL.includes('settings')){
    getAllGameSettings()
}else  {
    getCategory()
}