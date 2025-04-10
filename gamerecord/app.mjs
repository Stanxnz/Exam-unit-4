import game from "../models/game.mjs";

console.log("APP has been Loaded!");

const fileInput = document.getElementById("file-input");
const fileContentDisplay = document.getElementById("file-content");

let games = [];

function saveGameToStorage(game){
    const uniqueGameKey = `game-${game.title.replace(/\s+/g, '-')}-${Date.now()}`;
    localStorage.setItem(uniqueGameKey, JSON.stringify(game));
}

function getAllGamesFromStorage(){
    const games = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("game-")){
            const gameData = localStorage.getItem(key);
            try{
            const gameObj = JSON.parse(gameData);
            games.push(gameObj);
            } catch (error){
                console.error(`error getting the game from storage as a key ${key};`, error);
            }
        }
    }
    return games;
}

function exportGamesFromStorage(){
    try {
     const games = getAllGamesFromStorage();
     return JSON.stringify(games);
    } catch (error){
        console.error("error exporting the games from storage:", error);
        return null;
    }
}

function importGamesFromStorage(jsonString) {
    try {
        const games = JSON.parse(jsonString);
        if (!Array.isArray(games)){
            console.error("imported games are not an array of games");
            return;
        }
        games.forEach(game => {
            saveGameToStorage(game);
        });
    } catch (error){
        console.error("error importing the games:", error);
    }
}

function handleTheSelectedFile(event) {
    fileContentDisplay.textContent = "";
    const file = event.target.files[0];
    
    if (!file) {
      console.error("No file selected.");
      return;
    }
    
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const fileContent = fileReader.result;
      importGamesFromStorage(fileContent);
      games = getAllGamesFromStorage();
      console.log("Games after importing files:", games);
      displayGames();
    };
  
    fileReader.readAsText(file);
  }
  
  function displayGames() {
    const gameListContainer = document.getElementById("list-of-games");
    if (!gameListContainer) {
        console.error("No game list container found in the HTML.");
        return;
    }
    gameListContainer.innerHTML = "";

    games.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card"; 

        gameCard.innerHTML = `
            <h3>${game.title}</h3>
            <p>
                <strong>Designer:</strong> ${game.designer}<br />
                <strong>Publisher:</strong> ${game.publisher} | <strong>Year:</strong> ${game.year}<br />
                <strong>Players:</strong> ${game.players} | <strong>Time:</strong> ${game.time} | <strong>Difficulty:</strong> ${game.difficulty}
            </p>
            <p>
                <strong>Playcount:</strong> ${game.playCount || 0}
                <button>+</button>
            </p>
            <p>
                <strong>Rating:</strong>
                <input type="range" min="0" max="10" value="${game.personalRating || 0}" />
                <span>${game.personalRating || 0}</span>
            </p>
        `;

        gameListContainer.appendChild(gameCard);
    });
}

  document.addEventListener("DOMContentLoaded", () => {
    if (fileInput) {
      fileInput.addEventListener("change", handleTheSelectedFile, false);
    }
    games = getAllGamesFromStorage();
    console.log("Games loaded on start:", games);
    displayGames();
  });
  