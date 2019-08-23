const Telegraf = require('telegraf')
//const Keyboard = require('telegraf-keyboard')
const config = require('./config/config')
const helpers = require('./helpers/utils')

class Bot {

    constructor() {
        this.bot = new Telegraf(config.token)
        this.loadConfig()
        this.bindEvents()
    }

    launch() {
        this.bot.launch()
    }

    loadConfig() {
        this.bot_name = config.bot_name
        this.available_commands = config.available_commands
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
                info.message = info.replacers.map(key => {
                    if (info.message.indexOf(key) !== -1) {
                        return info.message.replace(key, _this[key.toLowerCase()]);
                    }
                });
                info.message = info.message[0];
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
        });
    }

    handleCommand(ctx, command) {
        const handler = `handleAction${helpers.capitalize(helpers.snakeCaseToCamelCase(command))}`
        this[handler](ctx)
    }

    handleActionAddScheduleMessage(ctx) {
        ctx.reply(`AddScheduleMessage`)
    }

    handleActionGetScheduledMessages(ctx) {
        ctx.reply(`GetScheduledMessages`)
    }

    handleActionGetHistory(ctx) {
        ctx.reply(`GetHistory`)
    }

}

module.exports = Bot;
