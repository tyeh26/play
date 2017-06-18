import Express from 'express';
import userController from './controllers/user_controller';

module.exports = function(app) {

    const apiRouter = Express.Router();

	apiRouter.get('/gamestatus', function (req, res) {
        res.json({
            players: {
                aaa: {name: 'Awesome Amira', isHost: false, numberOfDie: 5},
                abc: {name: 'Teddy', isHost: true, numberOfDie: 5},
                zzz: {name: 'John Doe', isHost: false, numberOfDie: 5},
                xyz: {name: 'LittleBobbyTables', isHost: false, numberOfDie: 5},
            },
            rolledFaces: [1, 2, 4, 4, 3],
            wagers: [
                {userId:"aaa",numberOfDie:2,face:3},
                {userId:"abc",numberOfDie:3,face:3},
                {userId:"zzz",numberOfDie:3,face:4},
                {userId:"xyz",numberOfDie:4,face:2},
                {userId:"aaa",numberOfDie:6,face:2},
            ]
        });
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