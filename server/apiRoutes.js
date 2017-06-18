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
			gameStatusController.create(req, userId, gameId, name);

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
			let gameId = gameId;

			// Add the player to the gamestatus object
			gameStatusController.addPlayer(req, userId, gameId, name);

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

	/*
	 * Currently this endpoint is repeatedly pinged and returns a giant
	 * json blob of the current game status.
	 */
	apiRouter.get('/gamestatus', function (req, res) {
        let gamestatusData = gameStatusController.get(req);
        res.json(gamestatusData);
    });

    apiRouter.post('/startGame', function (req, res) {
	    res.redirect('/gamestatus'); // SET STARTED TO TRUE AND REDIRECT TO GAMESTATUS
	});

    return apiRouter;
};