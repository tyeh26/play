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

    	players[hostId] = createPlayer(hostName, true);

    	req.app.locals.gamestatus = {
    		players,
    		wagers,
    		rolledFaces,
    		currentPlayer
    	};
    },

    startGame() {
    	// randomly give players order
    }
};