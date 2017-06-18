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
    let basicArray = Array.apply(null, {length: length}).map(Number.call, Number) ;
    let randArray = basicArray.sort(function() {
        return .5 - Math.random();
    });

    return randArray;
};

const createWager = (userId, wagerNumberOfDie, face) => {
    return {
        userId,
        face,
        numberOfDie: wagerNumberOfDie,
    }
};

/* Takes in a players object with the format of
 * {amira:{'order':3}, teddy:{'order':4}} and returns an array like
 * ['amira', 'teddy']
 */
const createOrderedPlayersArray = (players) => {
    let sortedPlayersObject = Object.entries(players).sort(
        function(player1, player2) { return player1[1].order > player2[1].order }
    );
    let sortedPlayersArray = sortedPlayersObject.map(function(player) { return player[0] });
    return sortedPlayersArray;
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
        let gameStatus = req.app.locals.games[gameId];
        // Add the wager to the wagers array which is sorted in order
        gameStatus['wagers'].push(createWager(
            playerId,
            numberOfDie,
            face
        ));
        let currentPlayer = gameStatus['currentPlayer'];
        let currentPlayerIndex = gameStatus['playersInOrder'].indexOf(currentPlayer);

        // Set current player to next
        if (currentPlayerIndex === gameStatus['playersInOrder'].length - 1) {
            // If currentPlayer is last, next player is first
            currentPlayer = gameStatus['playersInOrder'][0];
        } else {
            currentPlayer = gameStatus['playersInOrder'][currentPlayerIndex + 1];
        }

    },

    startGame(req, gameId) {
        let gameStatus = req.app.locals.games[gameId];
        let numberOfPlayers = Object.keys(gameStatus['players']).length;
        let randArray = createRandomArray(numberOfPlayers);
        let order = 0;
        // Store for simplified logic later, can remove players when they lose from here
        let playersInOrder = [];
        let playerId, assignedOrder;

        // Randomly give players an order - refactor later to reuse in challenge
        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                assignedOrder = randArray[order];
                gameStatus['players'][playerId]['order'] = assignedOrder;
                order++;
                // Set current player
                if (assignedOrder === 0) {
                    gameStatus['currentPlayer'] = playerId;
                }
            }
        }

        // Create array of players orders
        gameStatus['playersInOrder'] = createOrderedPlayersArray(gameStatus['players']);
        // Set game status to started
        gameStatus['started'] = true;
    },

    // userId is the person challenging
    challenge(req, gameId, userId) {
        let gameStatus = req.app.locals.games[gameId];
        let lastWager = gameStatus['wagers'][gameStatus['wagers'].length-1];
        let numberOfDie = lastWager['numberOfDie'];
        let faceNumber = lastWager['faceNumber'];
        let numberOfMatchingDie = 0;
        let diceRolls, playerId, roll, loserId;
        let challengeSuccess = false;

        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                diceRolls = gameStatus['players'][playerId]['diceRolls'];
                for (roll in diceRolls) {
                    if (roll === faceNumber) {
                        numberOfMatchingDie++;

                        if (numberOfMatchingDie === numberOfDie) {
                            // Challenge succeeded
                            challengeSuccess = true;
                            gameStatus['challengeSuccess'] = true;
                        }
                    }
                }
            }
        }
        debugger;
        if (!challengeSuccess) {
            // Challenge failed
            gameStatus['challengeSuccess'] = false;
            loserId = gameStatus['players'][userId];
        } else {
            // If the challenge succeeded, the loser is the user_id of the last wager
            loserId = lastWager[userId];
        }

        // Reduce dice for the loser
        gameStatus['players'][loserId]['numberOfDie']--;

        // If they have 0 dice, time to kick them out of the game!
        if (gameStatus['players'][loserId]['numberOfDie'] === 0) {
            let loserIndex = gameStatus['playersInOrder'].indexOf(loserId);
            gameStatus['playersInOrder'].splice(loserIndex, 1);
            delete gameStatus['players'][loserId]; // muahahhaha
        }

        // Reset everything
        gameStatus['wagers'] = [];

        let numberOfPlayers = Object.keys(gameStatus['players']).length;

        // Will also just create a new order for people to go in!
        // Since we may have got rid of someone, and yolo y'know?
        let randArray = createRandomArray(numberOfPlayers);

        // Re roll the dice
        for (playerId in gameStatus['players']) {
            if (gameStatus['players'].hasOwnProperty(playerId)) {
                let numDie = gameStatus['players'][playerId]['numberOfDie'];
                gameStatus['players'][playerId]['diceRolls'] = generateDiceRolls(numDie);
                assignedOrder = randArray['order'];
                gameStatus['players'][playerId]['order'] = assignedOrder;
                order++;
                if (assignedOrder === 1) {
                    gameStatus['currentPlayer'] = playerId;
                }
            }
        }

        // If the person just lost, then we set them as the currentPlayer
        if (challengeSuccess && gameStatus['players'][userId]) {
            gameStatus['currentPlayer'] = gameStatus['players'][userId];
        }
    }
};