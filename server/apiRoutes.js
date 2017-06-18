import Express from 'express';

// Controllers
import userController from './controllers/user_controller';
import gameStatusController from './controllers/gamestatus_controller';

// Models
import gameStatus from './models/gamestatus.js';

module.exports = function(app) {

    const apiRouter = Express.Router();

	/*
	 * This endpoint takes in a gameId, a userId, and a name for the user.
	 * Returns:
	 *   null for gameId if the game is not currently running
	 *   id for gameId if the game is currently existent
	 *   Passed in userId and name. Which is kinda redundant. But whatever.
	 */
	apiRouter.post('/hostGame', function(req, res) {
		let {gameId, userId, name} = req.body;
		req.app.locals.currentlyRunningGames = app.locals.currentlyRunningGames || {};

		if (!userId) {
			userId = userController.createUser(req.requestId);
		}

		// Make sure this game is not already currently being hosted
		if (!req.app.locals.currentlyRunningGames[gameId]) {
			// Put in the gameId into our persistent dictionary
			req.app.locals.currentlyRunningGames[gameId] = true;

			// Generate the gamestatus object here
			gameStatusController.createGame(req, userId, gameId, name);

			res.json({
				gameId: gameId,
				userId: userId,
				name: name
			});
		} else {
			res.send(500, {status:500, message: 'Game Already Exists'});
		}
	});

	/*
	 * This endpoint takes in a gameId, a userId, and a name for the user.
	 * Returns:
	 *   null for gameId if the game is not currently running
	 *   id for gameId if the game is currently existent
	 *   Passed in userId and name. Which is kinda redundant. But whatever.
	 */
	apiRouter.post('/joinGame', function(req, res) {
		let {gameId, userId, name} = req.body;
		req.app.locals.currentlyRunningGames = app.locals.currentlyRunningGames || {};

		if (!userId) {
			userId = userController.createUser(req.requestId);
		}

		// Check that the game is currently running
		if (req.app.locals.currentlyRunningGames[gameId]) {
			// Add the player to the gamestatus object
			gameStatusController.addPlayer(req, gameId, userId, name);

			res.json({
				gameId: gameId,
				userId: userId,
				name: name
			});			
		} else {
			res.send(500, {status:500, message: 'Game Does Not Exist'});
		}
	});

	/*
	 * Currently this endpoint is repeatedly pinged and returns a giant
	 * json blob of the current game status.
	 */
	apiRouter.get('/gamestatus', function (req, res) {
		let {gameId} = req.query;
        let gamestatusData = gameStatusController.getGamestatus(req, gameId);
        res.json(gamestatusData);
    });

	/*
	 * Sets the gamestatus of start to true, gives players an order,
	 * and then redirects.
	 */
    apiRouter.post('/startGame', function (req, res) {
    	let {gameId} = req.body;

    	gameStatusController.startGame(req, gameId);
	    res.send(200); 
	});

	/*
	 * End a game so that gameId can be used in the future.
	 */
	apiRouter.post('/endGame', function(req, res) {
		let {gameId} = req.body;

		// Check that the game is currently running
		if (req.app.locals.currentlyRunningGames[gameId]) {
			delete req.app.locals.currentlyRunningGames[gameId];
		}
		res.send(200);
	});

	apiRouter.post('/wager', function(req, res) {
		// change the currentplayer
        let {gameId, userId, numberOfDie, face} = req.body;
debugger
        gameStatusController.addWager(req, gameId, userId, numberOfDie, face);
        res.send(200);
    });

    apiRouter.post('/challenge', function(req, res) {
    	let {gameId, userId} = req.body;
    	gameStatusController.challenge(req, gameId, userId);
    	res.json({});
    });
	// challenge

    return apiRouter;
};