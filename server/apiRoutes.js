import Express from 'express';
import userController from './controllers/user_controller';
import gameStatus from './models/gamestatus.js';

module.exports = function(app) {

    const apiRouter = Express.Router();

	apiRouter.get('/gamestatus', function (req, res) {
        res.json(gameStatus);
    });
	
	apiRouter.post('/startGame', function (req, res) {
	    res.redirect('/gamestatus'); // SET STARTED TO TRUE AND REDIRECT TO GAMESTATUS
	});

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

		// TO DO MAKE SURE I LOG WHO THE HOST IS IN THE GAME STATUS

		if (!userId) {
			userId = userController.createUser(req.requestId);
		}

		// Make sure this game is not already currently being hosted
		if (!req.app.locals.currentlyRunningGames[gameId]) {
			// Put in the gameId into our persistent dictionary
			req.app.locals.currentlyRunningGames[gameId] = true;
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

    return apiRouter;
};