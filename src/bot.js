// requirements
const config = require('./config/config')
const helpers = require('./helpers/utils')

const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Keyboard = require('telegraf-keyboard')

class Bot {

    constructor() {
        this.bot = new Telegraf(config.token)
        this.telegram = new Telegram(config.token)
        this.keyboard_options = {
            inline: true,
            newline: true,
            duplicates: true,
        }
        this.loadConfig()
        this.bindEvents()
    }

    launch() {
        this.bot.launch()
    }

    loadConfig() {
        this.bot_name = config.bot_name
        this.available_commands = config.available_commands
        this.buttons = config.buttons
        this.reply_messages = helpers.processMessages(this, config.reply_messages)
    }

    bindEvents() {
        this.bot.help((ctx) => ctx.reply(this.reply_messages.help))
        this.bot.start((ctx) => ctx.reply(this.reply_messages.start))
        this.bot.mention(this.bot_name, (ctx) => ctx.reply(this.reply_messages.mention))
        config.available_commands.forEach(command => {
            this.bot.command(command, (ctx) => this.handleCommand(ctx, command))
        })
        /*this.bot.on('callback_query', (ctx) => {
            this.telegram.answerCbQuery(ctx.callbackQuery.id, "Your scheduled message has been saved", true);
        })*/
    }

    handleCommand(ctx, command) {
        const handler = `handleAction${helpers.capitalize(helpers.snakeCaseToCamelCase(command))}`
        this[handler](ctx)
    }

    handleActionAddScheduleMessage(ctx) {
        const keyboard = new Keyboard(this.keyboard_options)
        keyboard.add(...this.buttons.add_schedule_message)
        ctx.reply(
            this.reply_messages.add_message_initial,
            keyboard.draw()
        )
    }

    handleActionGetScheduledMessages(ctx) {
        ctx.reply(`GetScheduledMessages`)
    }

    handleActionGetHistory(ctx) {
        ctx.reply(`GetHistory`)
    }

}

module.exports = Bot;
