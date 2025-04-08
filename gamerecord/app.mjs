import game from "../models/game.mjs";

console.log("APP has been Loaded!");

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
    
  