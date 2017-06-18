'use strict';

// Update this variable to determine how many die each player gets
const defaultDieNumber = 5;

const generateDiceRolls = (numberOfDie) => {
    let diceRolls = [];

    for (let i = 0; i<numberOfDie; i++) {
        diceRolls.push(Math.floor(Math.random() * 6 + 1));
    }

    return diceRolls;
};

const createPlayer = (name, isHost) => {   
    let diceRolls = generateDiceRolls(defaultDieNumber);

    return {
        name,
        isHost,
        diceRolls,
        numberOfDie: defaultDieNumber,
        order: null,
    }
};

const createRandomArray = (length) => {
    let basicArray = Array.apply(null, {length: length+1}).map(Number.call, Number)
    let randArray = basicArray.sort(function() {
        return .5 - Math.random();
    });
    return randArray;
};

const createWager = (userId, wagerNumberOfDie, face) => {
    return {
        userId,
        numberOfDie: wagerNumberOfDie,
        face,
    }
};

/* 
 * Takes in a changes object that will only include whatever we need to update
 * on the player.
 */
 const updatePlayer = (playerObject, changesObject) => {

};

module.exports = exports = {
    
    getGamestatus(req, gameId) {
        if (!req.app.locals.games) {
            req.app.locals.games = {};
        } 

        if (!req.app.locals.games[gameId]) {
            // Should theoretically never hit this line
            req.app.locals.games[gameId] = {};
        }

        return req.app.locals.games[gameId];
    },

    createGame(req, hostId, gameId, hostName) {
        let players = {};
        let wagers = [];
        let rolledFaces = [];
        let currentPlayer = null;
        let started = false;

        if (!req.app.locals.games) {
            req.app.locals.games = {};
        }

        players[hostId] = createPlayer(hostName, true);
        let game = {
            gameId,
            players,
            wagers,
            rolledFaces,
            currentPlayer,
            started
        };

        req.app.locals.games[gameId] = game;
    },

    addPlayer(req, gameId, playerId, playerName) {
        req.app.locals.games[gameId]['players'][playerId] = createPlayer(
            playerName,
            false
        );
    },

    addWager(req, gameId, playerId, numberOfDie, face) {
        req.app.locals.games[gameId]['wagers'].push(createWager(
            playerId,
            numberOfDie,
            face
        ));

        let currentPlayer = req.app.locals.games[gameId]['currentPlayer'];
        let playerOrder = []; // user Ids in order
        let players = req.app.locals.games[gameId]['players'];
        Object.keys(players).map( (userId) =>
            playerOrder[players[userId].order] = userId
        );
        let currentPlayerOrder = players[currentPlayer].order;
        let nextPlayers = playerOrder.slice(currentPlayerOrder).concat(playerOrder.slice(0, currentPlayerOrder));
        req.app.locals.games[gameId]['currentPlayer'] = nextPlayers[1 % players.length];
    },

    startGame(req, gameId) {
        let gameStatus = req.app.locals.games[gameId];
        let numberOfPlayers = Object.keys(gameStatus['players']).length;
        let randArray = createRandomArray(numberOfPlayers);
        let order = 0;
        let playerId, assignedOrder;

        // Randomly give players an order
        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                assignedOrder = randArray[order];
                gameStatus['players'][playerId]['order'] = assignedOrder;
                order++;
                // Set current player
                if (assignedOrder === 1) {
                    gameStatus['currentPlayer'] = playerId;
                }
            }
        }

        gameStatus['started'] = true;
    },

    challenge(req, gameId, userId) {
        let gameStatus = req.app.locals.games[gameId];
        let lastWager = gameStatus.wagers[-1];
        let numberOfDie = lastWager['numberOfDie'];
        let faceNumber = lastWager['faceNumber'];
        let numberOfMatchingDie = 0;
        let diceRolls;
        let challengeSuccess = false;

        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                diceRolls = gameStatus['players'][playerId]['diceRolls'];
                for (roll in diceRolls) {
                    if (roll === faceNumber) {
                        numberOfMatchingDie++;

                        if (numberOfMatchingDie === numberOfDie) {
                            // Challenge succeededs
                            challengeSuccess = true;
                            gameStatus['challengeSuccess'] = true;
                        }
                    }
                }
            }
        }

        if (!challengeSuccess) {
            // Challenge failed
            gameStatus['challengeSuccess'] = false;

            // Reduce dicefor the current player
            gameStatus['players'][userId]['numberOfDie']--;
        }

        // Reset everything
        gameStatus['wagers'] = [];

        let numberOfPlayers = Object.keys(gameStatus['players']).length;
        let randArray = createRandomArray(numberOfPlayers);

        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                let numDie = gameStatus['players'][playerId]['numberOfDie']
                gameStatus['players'][playerId]['diceRolls'] = generateDiceRolls(numDie);
                assignedOrder = randArray[order];
                gameStatus['players'][playerId]['order'] = assignedOrder;
                order++;
                // Set current player
                if (assignedOrder === 1) {
                    gameStatus['currentPlayer'] = playerId;
                }
            }

        }         
    }
};