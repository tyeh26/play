'use strict';

module.exports = exports = {

    // Create unique users for each game
    // So that we cannot have users hijack games
    createUser(req, userId, gameId) {
        let uniqueIdentifier = 0;
        let lastUser, lastUserId;

        // Keep user ids specific to game ids
        // Have we given this user an ID yet for this game?
        // Nothing happens if we passed in a valid user ID
        if (!userId || !userId.startsWith(gameId)) {

            // Initialize game to user map if it doesn't exist already
            if (!req.app.locals.gameToUsersMap[gameId]) {
                req.app.locals.gameToUsersMap[gameId] = [];

                // First user!
                userId = gameId + 0;
            } else {
                // Additional users!
                lastUser = req.app.locals.gameToUsersMap[gameId][req.app.locals.gameToUsersMap[gameId].length-1];
                lastUserId = parseInt(lastUser.replace(gameId, ''));
                userId = gameId + (lastUserId+1);
            }

            req.app.locals.gameToUsersMap[gameId].push(userId);
        }
        return userId;
    }
};

