/**
 * @module conf
 * @requires config.json
 */

// requirements
/** @external dotenv-safe */
require('dotenv-safe').config();
const config = require('./config.json');

/**
 * Data exports
 * @property {array} buttons
 * @property {string} bot_name
 * @property {array} available_commands
 * @property {array} reply_messages
 * @property {int} telegram_token
 * @property {int} port
 * @property {string} domain
 */
module.exports = {
    buttons: config.buttons,
    bot_name: config.botname,
    available_commands: config.commands,
    reply_messages: config.reply_messages,
    port: process.env.PORT,
    domain: process.env.DOMAIN,
    telegram_token: process.env.TOKEM_TELEGRAM_BOT,
};
