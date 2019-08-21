// requirements
require('dotenv-safe').config();
const config = require('../../config');

module.exports = {
    token : process.env.TOKEM_TELEGRAM_BOT,
    available_commands : config.commands
}