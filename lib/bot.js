// requirements
const config = require('./config/config')
const helpers = require('./../bin/utils')

class Bot {

    constructor(bot) {
        this.bot = bot;
        this.loadConfig()
        if (typeof this.bindEvents === 'function') {
            this.bindEvents()
        }
    }

    loadConfig() {
        this.buttons = config.buttons || {}
        this.bot_name = config.bot_name || ""
        this.available_commands = config.available_commands || []
        this.reply_messages = helpers.processMessages(this, config.reply_messages) || {}
    }

    errorHandler(response) {

    }

}

module.exports = Bot;
