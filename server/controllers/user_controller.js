'use strict';

module.exports = exports = {

    createUser(userIds) {
        let uniqueIdentifier = 0
        // First id
        if (userIds.length !== 0) {
            uniqueIdentifier = userIds[userIds.length-1] + 1;
        }
        return uniqueIdentifier;
    }
};

