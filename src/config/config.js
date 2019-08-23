// requirements
require('dotenv-safe').config();
const config = require('../../config');

module.exports = {
    buttons : config.buttons,
    bot_name : config.botname,
    available_commands : config.commands,
    reply_messages : config.reply_messages,
    token : process.env.TOKEM_TELEGRAM_BOT,
}