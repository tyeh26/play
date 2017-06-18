module.exports = exports = {
    players: {
        aaa: {name: 'Awesome Amira', isHost: false, numberOfDie: 5, order:0},
        abc: {name: 'Teddy', isHost: true, numberOfDie: 5, order:1},
        zzz: {name: 'John Doe', isHost: false, numberOfDie: 5, order:2},
        xyz: {name: 'LittleBobbyTables', isHost: false, numberOfDie: 5, order:3},
    },
    rolledFaces: [1, 2, 4, 4, 3],
    wagers: [
        {userId:"aaa",numberOfDie:2,face:3},
        {userId:"abc",numberOfDie:3,face:3},
        {userId:"zzz",numberOfDie:3,face:4},
        {userId:"xyz",numberOfDie:4,face:2},
        {userId:"aaa",numberOfDie:5,face:3},
    ],
    currentPlayer: "abc",
};