// requirements
const conf = require('./src/conf');
const {
    helpers
} = require('./src/utils')();
const models = require('./src/models')(conf);
const services = require('./src/services')(models);
const Bot = require('./src/bot')(conf, helpers());
const TelegramBot = require('./src/telegram_bot.js')(
    conf,
    helpers(),
    services,
    Bot
);

TelegramBot.launch();
