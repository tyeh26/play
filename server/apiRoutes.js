import Express from 'express';

const apiRouter = Express.Router();

apiRouter.get('/rolldice', function (req, res) {
    res.send('ROLLING THE DICE BITCH');
});

apiRouter.post('/killpeople', function (req, res) {
    res.json({userId:'abc', name:"john doe", gameId: "xyz"});
});

apiRouter.get('/teddyisamazing', function (req, res) {
    res.send('hi teddy. I adore you');
});

module.exports = apiRouter;