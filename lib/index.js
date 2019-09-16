module.exports = () => {

    // requirements
    const conf = require('./../conf');
    const {
        helpers
    } = require('./../bin')();
    const models = require('./models')(conf);
    const services = require('./services')(models);
    const Bot = require('./bot')(conf, helpers());
    const TelegramBot = require('./telegram_bot')(
        conf,
        helpers(),
        services,
        Bot
    );

    TelegramBot.launch();
}
