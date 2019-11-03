const serverless = require('serverless-http');
const app = require('./app');

const handler = serverless(app);

module.exports.server = (event, context) => {
    return handler(event, context);
};
