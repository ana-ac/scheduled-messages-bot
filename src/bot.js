const Telegraf = require('telegraf');
const config = require('./config/config');
const helpers = require('./helpers/utils');

class Bot {

    constructor() {
        this.bot = new Telegraf(config.token)
        this.bindEvents()
    }

    launch() {
        this.bot.launch()
    }

    bindEvents() {
        this.bot.start((ctx) => ctx.reply('Welcome! :)'))
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
