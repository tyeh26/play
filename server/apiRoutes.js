import Express from 'express';

const apiRouter = Express.Router();

apiRouter.get('/rolldice', function (req, res) {
    res.send('ROLLING THE DICE BITCH');
});

apiRouter.get('/killpeople', function (req, res) {
    res.send('KILL PEOPLE');
});

module.exports = apiRouter;