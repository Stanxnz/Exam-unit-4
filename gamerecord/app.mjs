import game from "../models/game.mjs";

console.log("APP has been Loaded!");

const fileInput = document.getElementById("file-input");
const fileContentDisplay = document.getElementById("file-content");


let games = [];

function saveGameToStorage(game) {
    const uniqueGameKey = `game-${game.title.replace(/\s+/g, '-')}-${Date.now()}`;
    localStorage.setItem(uniqueGameKey, JSON.stringify(game));
}

function getAllGamesFromStorage() {
    const arrayOfGames = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("game-")) {
        const gameData = localStorage.getItem(key);
        try {
          const gameObj = JSON.parse(gameData);
          arrayOfGames.push({ key, game: gameObj });
        } catch (error) {
          console.error(`Error getting the game from storage for key ${key}:`, error);
        }
      }
    }
    return arrayOfGames;
  }

function exportGamesFromStorage(){
    try {
     const storedGames = getAllGamesFromStorage();
     return JSON.stringify(storedGames);
    } catch (error){
        console.error("error exporting the games from storage:", error);
        return null;
    }
}

function importGamesFromStorage(jsonString) {
    try {
        const importedgames = JSON.parse(jsonString);
        if (!Array.isArray(importedgames)){
            console.error("imported games are not an array of games");
            return;
        }
        importedgames.forEach(game => {
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

    games.forEach(item => {
        const key = item.key;
        const game = item.game;
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.setAttribute("data-key", key);

        gameCard.innerHTML = `
      <h3>${game.title}</h3>
      <p>
          <strong>Designer:</strong> ${game.designer}<br />

          <strong>Publisher:</strong> ${game.publisher} | <strong>Year:</strong> ${game.year}<br />

          <strong>Players:</strong> ${game.players} | <strong>Time:</strong> ${game.time} | <strong>Difficulty:</strong> ${game.difficulty}
      </p>
      <p>
          <strong>Playcount:</strong> <span class="playcount-value">${game.playCount || 0}</span>

          <button class="btn-playcount">+</button>
      </p>
      <p>
          <strong>Rating:</strong>

          <input type="range" class="rating-range" min="0" max="10" value="${game.personalRating || 0}" />

          <span class="rating-value">${game.personalRating || 0}</span>
      </p>
    <button class="btn-delete">🗑️</button>
    `;

const playCountButton = gameCard.querySelector(".btn-playcount");
playCountButton.addEventListener("click", () => {
  let currentGame = JSON.parse(localStorage.getItem(key));
  currentGame.playCount = (currentGame.playCount || 0) + 1;
  localStorage.setItem(key, JSON.stringify(currentGame));
  
  gameCard.querySelector(".playcount-value").textContent = currentGame.playCount;

  games = getAllGamesFromStorage();
    });

const ratingInput = gameCard.querySelector(".rating-range");
const ratingValueDisplay = gameCard.querySelector(".rating-value");
ratingInput.addEventListener("change", (e) => {
  const newRating = parseInt(e.target.value, 10);
  let currentGame = JSON.parse(localStorage.getItem(key));
  currentGame.personalRating = newRating;
  localStorage.setItem(key, JSON.stringify(currentGame));
  
  ratingValueDisplay.textContent = newRating;
  
  games = getAllGamesFromStorage();
    });

    const deleteButton = gameCard.querySelector(".btn-delete");
    deleteButton.addEventListener("click", () => {
      localStorage.removeItem(key);
      games = getAllGamesFromStorage();
      displayGames();
    });

    gameListContainer.appendChild(gameCard);
    });
}

const newGameForm = document.getElementById("new-game-form");
newGameForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

if (newGameForm) {
  newGameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newGame = {
          title: document.getElementById("title").value,
          designer: document.getElementById("designer").value,
          artist: document.getElementById("artist").value,
          publisher: document.getElementById("publisher").value,
          year: parseInt(document.getElementById("year").value, 10),
          players: document.getElementById("players").value,
          time: document.getElementById("time").value,
          difficulty: document.getElementById("difficulty").value,
          url: document.getElementById("url").value,
          playCount: 0, 
          personalRating: parseInt(document.getElementById("personalRating").value, 10)
      };
      saveGameToStorage(newGame);
      games = getAllGamesFromStorage();
      displayGames();
      newGameForm.reset();
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
  