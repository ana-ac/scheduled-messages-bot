const {token} = require('./config/config');
const {available_commands} = require('./config/config');
const TelegramBot = require('node-telegram-bot-api');

class Bot {

    constructor() {
        this.bot = new TelegramBot(token, {polling: true});
        this.handleEvents();
    }

    handleEvents() {
        this.bot.on('message', (msg) => {
            const chat_id = msg.chat.id;
            this.bot.sendMessage(chat_id, 'Received your message');
        });
        available_commands.forEach(command => {
            console.log(command);
        });
    }
}

module.exports = Bot;