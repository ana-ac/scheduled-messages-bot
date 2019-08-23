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
        this.reply_messages = this.processParameterConfig('reply_messages')
    }

    processParameterConfig(type) {
        const process_function = `process${
            helpers.capitalize(helpers.snakeCaseToCamelCase(type))
        }`
        return this[process_function]()
    }

    processReplyMessages() {
        let _this = this;
        let processReplacers = function(info) {
            if (typeof info.replacers !== 'undefined') {
                info.replacers.map(key => {
                    if ((info.message.indexOf(key) !== -1) && (typeof _this[key.toLowerCase()] !== 'undefined' || info.empty_replacer)) {
                        let value = typeof _this[key.toLowerCase()] !== 'undefined' ? _this[key.toLowerCase()] : '';
                        info.message = info.message.replace(key, value);
                    }
                });
            }
            return info;
        }
        return config.reply_messages.reduce(function(processed, info){
            info = processReplacers(info);
            processed[info.id] = info.message
            return processed
        },{})
    }

    bindEvents() {
        this.bot.help((ctx) => ctx.reply(this.reply_messages.help))
        this.bot.start((ctx) => ctx.reply(this.reply_messages.start))
        this.bot.mention(this.bot_name, (ctx) => ctx.reply(this.reply_messages.mention))
        config.available_commands.forEach(command => {
            this.bot.command(command, (ctx) => this.handleCommand(ctx, command))
        })
        this.bot.on('callback_query', (ctx) => {
            this.telegram.answerCbQuery(ctx.callbackQuery.id, "Your scheduled message has been saved", true);
        })
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

    handleActionEditMessage() {
        ctx.reply(`EditMessage`)
    }

}

module.exports = Bot;
