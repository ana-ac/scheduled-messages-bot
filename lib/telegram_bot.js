// requirements
const config = require('./config/config')
const helpers = require('./../bin/utils')
const Bot = require('./bot')
const {
    getScheduledMessages,
    addScheduledMessage,
} = require('./controllers/scheduled_messages')

// dependecies
const Telegraf = require('telegraf')
const Keyboard = require('telegraf-keyboard')


class TelegramBot extends Bot {

    constructor() {
        super(
            new Telegraf(config.telegram_token)
        );
        this.keyboard_options = {
            "inline" : true,
            "newline" : true,
            "duplicates" : true
        }
    }

    launch() {
        let bot = this.bot;
        bot.launch()
    }

    bindEvents() {
        // set initials
        let bot = this.bot
        let bot_name = this.bot_name
        let commands = this.available_commands
        let messages = this.reply_messages

        // events
        bot.start(ctx => ctx.reply(messages.start))
        bot.help(ctx  => ctx.reply(messages.help))
        bot.mention(bot_name, ctx => ctx.reply(messages.mention))
        commands.forEach(command => {
            bot.command(command, ctx => this.commandHandler(ctx, command))
        })
        bot.action(this.processAction)
    }

    commandHandler(ctx, action) {
        let fn = `handle${helpers.capitalize(helpers.snakeCaseToCamelCase(action))}`
        this[fn](ctx)
    }

    handleGetScheduledMessages(ctx) {
        let criterias = []
        let response = getScheduledMessages()
        /* try {
            response = handleResponse(response)
        } catch(error) {
            console.warn(`Some error occured executing getScheduledMessages`)
            errorHandler(error)
        } */
        console.log('response')
        console.log(response)
    }

    handleAddScheduledMessage(ctx) {
        // initials
        let messages = this.reply_messages
        let buttons = this.buttons

        let data = {}
        if (!this.areDataMessageCorrect(data)) {
            this.buildKeyboard(
                ctx,
                messages.add_message_initial,
                buttons.add_schedule_message,
            )
            return
        }
        // if data necessary from message is ok will be send to controller
        let result_action = addScheduledMessage(data)
    }

    areDataMessageCorrect(data) {
        return false
    }

    processAction(callbackData) {
        console.log(`processAction`)
        console.log(callbackData)
    }

    errorHandler(error) {

    }

    buildKeyboard(ctx, message, buttons) {
        // set initial
        let options = this.keyboard_options;
        // handle keyboard
        const keyboard = new Keyboard(options)
        keyboard.add(...buttons)
        ctx.reply(
            message,
            keyboard.draw()
        )
    }

}

module.exports = new TelegramBot