// Import depe
const { Router } = require('express');
const controllers = require('../controllers');
const routesV1 = require('./v1');

module.exports = (app, middlewares) => {
    app.use('/api/v1', routesV1({ Router, controllers, middlewares }));
};
