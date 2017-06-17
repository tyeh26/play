import Express from 'express';

const apiRouter = Express.Router();

apiRouter.get('/rolldice', function (req, res) {
    res.send('ROLLING THE DICE BITCH');
});

apiRouter.get('/gamestatus', function (req, res) {
    res.json({players: {
        aaa: {name: 'Awesome Amira', isHost: false},
        abc: {name: 'Teddy', isHost: true},
        zzz: {name: 'John Doe', isHost: false},
        xyz: {name: 'LittleBobbyTables', isHost: false},
    }});
});

apiRouter.post('/killpeople', function (req, res) {
    res.json({userId:'abc', name:"john doe", gameId: "xyz"});
});

apiRouter.get('/teddyisamazing', function (req, res) {
    res.send('hi teddy. I adore you');
});

apiRouter.post('/startGame', function (req, res) {
    res.redirect('/gamestatus'); // SET STARTED TO TRUE AND REDIRECT TO GAMESTATUS
});

module.exports = apiRouter;