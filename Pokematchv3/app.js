
//Pokemon API
const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const game = document.getElementById('game');

// Variables
let firstPick;
let isPaused = true;
let matches;
let fails = 0;
let score = 0;
let highscore = 0;
let Sklein = 1;
let Smittel = 2;
let Sgroß = 3;
let Zahl = 1;
let Anzahl = 8;
let Karten = 4;
let truescore = 0;
let highestscore = 0;
let nummer = 2;
let player1score = 0;
let player2score = 0;
let Kartenumgedreht= 1;
Playerchange = null;
let isMultiplayer;
let player = 1;
matchend = false;


//Farben für Kartenhintergrund
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

//Schwierigkeit
function changeDifficulty(Zahl) {
    if (Zahl == 1) { //leicht
        Anzahl = 8;
        Karten = 4
    } else if (Zahl == 2) { //mittel
        Anzahl = 16;
        Karten = 8;
    } else if (Zahl == 3) { //schwer
        Anzahl = 24;
        Karten = 12;
    }

    const gameElement = document.getElementById('game');
    gameElement.style.gridTemplateRows = `repeat(${Karten/2}, 160px)`;

    return Anzahl;
}

function changeDifficult() {
    console.log(Anzahl);
}


function changeMultiplayer(nummer) {
    if (nummer == 1) {
        isMultiplayer = false;
        console.log(isMultiplayer);

        document.getElementById("score").innerHTML = "richtig: " + score; 
        document.getElementById("truescore").innerHTML = "score: " + truescore; 
        document.getElementById("fails").innerHTML = "falsch: " + fails; 
        document.getElementById("Winner").innerHTML = "";
        document.getElementById("highscore").innerHTML = "Gewonnene Spiele: " + highscore;
        document.getElementById("highestscore").innerHTML = "highscore: " + highestscore;

        document.getElementById("score").style.display = "block";
        document.getElementById("truescore").style.display = "block";
        document.getElementById("fails").style.display = "block";
        document.getElementById("Winner").style.display = "block";
        document.getElementById("highestscore").style.display = "block";
        document.getElementById("highscore").style.display = "block";

        document.getElementById("Player1").innerHTML = "";
        document.getElementById("Player2").innerHTML = "";
        document.getElementById("Playerturn").innerHTML = "";
        document.getElementById("Playerwon").innerHTML = "";

        document.getElementById("Player1").style.display = "none";
        document.getElementById("Player2").style.display = "none";
        document.getElementById("Playerturn").style.display = "none";
        document.getElementById("Playerwon").style.display = "none"

        
        return nummer;
    } else if (nummer == 2) {
        isMultiplayer = true;
        console.log(isMultiplayer);
        document.getElementById("score").textContent = " ";
        document.getElementById("truescore").textContent = " ";
        document.getElementById("fails").textContent = " ";
        document.getElementById("Winner").textContent = " ";
        document.getElementById("highestscore").textContent = " ";
        document.getElementById("highscore").textContent = " ";

        document.getElementById("score").style.display = "none";
        document.getElementById("truescore").style.display = "none";
        document.getElementById("fails").style.display = "none";
        document.getElementById("Winner").style.display = "none";
        document.getElementById("highestscore").style.display = "none";
        document.getElementById("highscore").style.display = "none";

        document.getElementById("Player1").innerHTML = "Player 1: " + player1score;
        document.getElementById("Player2").innerHTML = "Player 2: " + player2score;
        document.getElementById("Playerturn").innerHTML = "Player 1 ist dran";
        document.getElementById("Playerwon").innerHTML = "Gewinner?";

        document.getElementById("Player1").style.display = "block";
        document.getElementById("Player2").style.display = "block";
        document.getElementById("Playerturn").style.display = "block";
        document.getElementById("Playerwon").style.display = "block";
        return nummer;
    }
}



//Pokemone werden geladen und anhand einer mathe rechnung zufällig ausgewählt
const loadPokemon = async () => {
    const randomIds = new Set();
    while(randomIds.size < Karten){
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }
    const pokePromises = [...randomIds].map(id => fetch(pokeAPIBaseUrl + id))
    const results = await Promise.all(pokePromises);
    return await Promise.all(results.map(res => res.json()));
}

//Hintergrundbilder werden geladen und gewechselt
var currentPicture = 1;

    function changePicture() {
      var imgElement = document.getElementById("picture");
  
      var images = ["wallpaper-46.jpg", "wallpaper-55.jpg", "wallpaper-56.jpg", "wallpaper-70.jpg", "wallpaper-72.jpg"];

      currentPicture = (currentPicture + 1) % images.length;
      imgElement.src = images[currentPicture];
      imgElement.alt = "Picture " + (currentPicture + 1);
    }
    //Konfetti 🎉
    function createConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
  
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          confetti.style.left = `${Math.random() * 100}vw`;
          confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
          confettiContainer.appendChild(confetti);
        }
      }
      //Stop Konfetti damit man das Konfetti deaktivieren kann
    function stopConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
        confettiContainer.innerHTML = '';
    }

  
    //Spiel wird zurückgesetzt (außer ein paar Variablen)
const resetGame = async() => {
    game.innerHTML = '';
    isPaused = true;
    firstPick = null;
    matches = 0;
    setTimeout(async () => {
        const loadedPokemon = await loadPokemon();
        displayPokemon([...loadedPokemon, ...loadedPokemon]);
        isPaused = false;
        
    },200)
    fails = 0;
    score = 0;
    truescore = 0;
    player1score=0;
    player2score=0;
    matchend = false;
    Kartenumgedreht = 1;

    
    document.getElementById("score").innerHTML = "richtig: " + score; 
    document.getElementById("truescore").innerHTML = "score: " + truescore; 
    document.getElementById("fails").innerHTML = "falsch: " + fails; 
    document.getElementById("Winner").innerHTML = "";
    document.getElementById("Player1").innerHTML = "Player 1: " + player1score;
    document.getElementById("Player2").innerHTML = "Player 2: " + player2score;
    document.getElementById("Playerturn").innerHTML = "Player 1 ist dran";
    document.getElementById("Playerturn").style.backgroundColor = "rgba(0, 17, 255, 0.14)";

    document.getElementById("Playerwon").innerHTML = "Gewinner?";
}

//Karten werden angezeigt
const displayPokemon = (pokemon) => {
    pokemon.sort(_ => Math.random() - 0.5);
    const pokemonHTML = pokemon.map(pokemon => {
        const type = pokemon.types[0]?.type?.name;
        const color = colors[type] ||'#F5F5F5';
        return `
          <div class="card" onclick="clickCard(event)" data-pokename="${pokemon.name}" style="background-color:${color};">
            <div class="front ">
            </div>
            <div class="back rotated" style="background-color:${color};">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"  />
            <h2>${pokemon.name}</h2>
            </div>
        </div>
    `}).join('');
    game.innerHTML = pokemonHTML;
}


function change()
{

        if (Kartenumgedreht % 2 === 0) {
            console.log(kartenmatched)
            if (kartenmatched == true){
             player1score += 15;
             console.log(player1score);
            }
            else {
                if (player1score > 0) {
                    player1score -= 5;
                    console.log(player1score);
                    }
            }
            player = "Player 1";
            console.log(player);
            document.getElementById("Playerturn").innerHTML = "Player 2 ist dran";
            document.getElementById("Playerturn").style.backgroundColor = "rgba(255, 0, 0, 0.182)";
            }
            else {
             console.log(kartenmatched)
             if (kartenmatched == true){
                
                   player2score += 15;
                 console.log(player1score);
                    }
                    else {
                        if (player2score > 0) {
                            player2score -= 5;
                            console.log(player1score);
                            }
                    }
                
        
        player = "Player 2";
        console.log(player);
        document.getElementById("Playerturn").innerHTML = "Player 1 ist dran";
        document.getElementById("Playerturn").style.backgroundColor = "rgba(0, 17, 255, 0.14)";
    }

    document.getElementById("Player1").innerHTML = "Player 1: " + player1score;
    document.getElementById("Player2").innerHTML = "Player 2: " + player2score;
   

    if(matchend == true){
        if (player1score > player2score) {
            document.getElementById("Playerwon").innerHTML = "Player 1 hat gewonnen!!!";
        } else if (player1score < player2score) {
            document.getElementById("Playerwon").innerHTML = "Player 2 hat gewonnen!!!";
        } else if (player1score == player2score) {
            document.getElementById("Playerwon").innerHTML = "Unentschieden";
        }
    }
   

}
const clickCard = (e) => {
    const pokemonCard = e.currentTarget;
    const [front, back] = getFrontAndBackFromCard(pokemonCard);
    if(front.classList.contains("rotated") || isPaused) {
        return;
    }
    isPaused = true;
    rotateElements([front, back]);
    if(!firstPick){
        firstPick = pokemonCard;
        isPaused = false;
    }
    else { 
        const secondPokemonName = pokemonCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;
        if(firstPokemonName !== secondPokemonName) { //Vergleich ob die Karte nicht mit übereinstimmt
            kartenmatched = false;
            Kartenumgedreht++;
            console.log(Kartenumgedreht);
            if (isMultiplayer == false) {
            if (truescore > 0) {
                truescore -= 5;
                }
                fails++; 
            }
            else {
                change();
            }
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstPick = null;
                isPaused = false;
                document.body.style.backgroundColor = 'red'; //Hintergrund wird rot
               
                //Konfetti
                setTimeout(() => {
                    document.body.style.backgroundColor = '';
                }, 500);
            }, 500)       
            
          
        } else { //Wenn die Karten übereinstimmen
           kartenmatched = true;
           Kartenumgedreht++;
           console.log(Kartenumgedreht);
            if (isMultiplayer == false) {
                if (truescore >= 0) {
                    truescore += 15;
                    console.log(truescore);
                    }
                    score++; 
                   
                    console.log(truescore);
                
            }
            else {
                change();
            }   
           
           
            matches++;
            if (matches === Karten) { //Wenn alle Karten aufgedeckt sind
                console.log("WINNER");
              
                if (isMultiplayer == true) {
                    if (player1score > player2score) {
                        document.getElementById("Playerwon").innerHTML = "Player 1 hat gewonnen!!!";
                    } else if (player1score < player2score) {
                        document.getElementById("Playerwon").innerHTML = "Player 2 hat gewonnen!!!";
                    } else if (player1score == player2score) {
                        document.getElementById("Playerwon").innerHTML = "Unentschieden";
                    }
                }
                else {
                    document.getElementById("Winner").innerHTML = "Du hast gewonnen";
                    highscore++;
                }
              
                createConfetti();
                setTimeout(() => {
                    stopConfetti();
                }, 1500);
               
               

            }
            //Sonst wenn die karten übereinstimmen
    
            firstPick = null;
            isPaused = false;
            
            document.body.style.backgroundColor = 'green';
           
            setTimeout(() => {
                document.body.style.backgroundColor = ''; 
            }, 500);
            
        }
    
       
    }
    
   
    
    //Wenn score höher ist als highscore, dann bekommt highscore den Wert von score
    if (truescore > highestscore) {
        highestscore = truescore;
    }
    
    document.getElementById("score").innerHTML = "richtig: " + 
    score; 
    document.getElementById("fails").innerHTML = "falsch: " + 
    fails; 
    document.getElementById("truescore").innerHTML = "score: " + truescore; 
    document.getElementById("highestscore").innerHTML = "highscore: " + highestscore; 
    document.getElementById("highscore").innerHTML = "Gewonnene Spiele: " + highscore; 
    
}



const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    return [front, back];
}


const rotateElements = (elements) => {
    if(typeof elements !== 'object' || !elements.length) return;
    elements.forEach(element => element.classList.toggle('rotated'));
}

resetGame();
changeMultiplayer(1);

