'use strict';

// Update this variable to determine how many die each player gets
const defaultDieNumber = 5;

const createPlayer = (name, isHost) => {
    return {
        name,
        isHost,
        numberOfDie: defaultDieNumber,
        order: null
    }
};

const createRandomArray = (length) => {
    let basicArray = Array.apply(null, {length: length+1}).map(Number.call, Number)
    let randArray = basicArray.sort(function() {
        return .5 - Math.random();
    });
    return randArray;
};

/* 
 * Takes in a changes object that will only include whatever we need to update
 * on the player.
 */
 const updatePlayer = (playerObject, changesObject) => {

};

module.exports = exports = {
    
    get(req) {
        if (!req.app.locals.gamestatus) {
            return {}
        } else {
            return req.app.locals.gamestatus;
        }
    },

    create(req, hostId, gameId, hostName) {
        let players = {};
        let wagers = [];
        let rolledFaces = [];
        let currentPlayer = null;
        let started = false;

        players[hostId] = createPlayer(hostName, true);

        req.app.locals.gamestatus = {
            gameId,
            players,
            wagers,
            rolledFaces,
            currentPlayer,
            started
        };
    },

    addPlayer(req, gameId, playerId, playerName) {
        req.app.locals.gamestatus['players'][playerId] = createPlayer(
            playerName,
            false
        );
    },

    startGame(req) {
        let gameStatus = req.app.locals.gamestatus; 
        let numberOfPlayers = Object.keys(gameStatus['players']).length;
        let randArray = createRandomArray(numberOfPlayers);
        let order = 0;
        let playerId;

        // Randomly give players an order
        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                gameStatus['players'][playerId]['order'] = randArray[order];
                order++;
            }
        }

        gameStatus['started'] = true;
    }
};