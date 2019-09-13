// dependecies
const Telegraf = require('telegraf');
const Keyboard = require('telegraf-keyboard');

// requirements
const config = require('./config/config');
const helpers = require('./../bin/utils');
const Bot = require('./bot');
const {
    getScheduledMessages,
    addScheduledMessage,
} = require('./controllers/scheduled_messages');

class TelegramBot extends Bot {
    constructor() {
        super(
            new Telegraf(config.telegram_token)
        );
        this.keyboard_options = {
            inline : true,
            newline : true,
            duplicates : true
        };
    }

    launch() {
        this.bot.launch();
    }

    bindEvents() {
        this.bot.start((ctx) => ctx.reply(this.reply_messages.start));
        this.bot.help((ctx) => ctx.reply(this.reply_messages.help));
        this.bot.mention(this.bot_name, (ctx) => ctx.reply(this.reply_messages.mention));
        this.available_commands.forEach((command) => {
            this.bot.command(command, (ctx) => this.commandHandler(ctx, command));
        });
        // this.bot.action(this.processAction);
    }

    commandHandler(ctx, action) {
        const fn = `handle${helpers.capitalize(helpers.snakeCaseToCamelCase(action))}`;
        this[fn](ctx);
    }

    handleGetScheduledMessages(ctx) {
        try {
            const criterias = [];
            const response = getScheduledMessages(criterias);
            this.handleResponseScheduledMessages(ctx, response);
        } catch (err) {
            this.errorHandler(ctx, err.message);
        }
    }

    handleAddScheduledMessage(ctx) {
        const data = {};
        if (!this.areDataMessageCorrect(data)) {
            this.buildKeyboard(
                ctx,
                this.reply_messages.add_message_initial,
                this.buttons.add_schedule_message,
            );
            return;
        }
        // if data necessary from message is ok will be send to controller
        addScheduledMessage(data);
    }

    handleResponseScheduledMessages(ctx, response) {
        if (!helpers.isParameterDefined('scheduled_messages', response) || response.scheduled_messages.length === 0) {
            ctx.reply('There are any scheduled meessages pending to send');
            return;
        }
        const scheduledMessages = this.formatResponseScheduledMessages(
            response.scheduled_messages
        );
        ctx.reply(scheduledMessages);
    }

    formatResponseScheduledMessages(scheduledMessages) {
        return scheduledMessages.reduce((result, item) => {
            result.push(this.buildPrintScheduledMessage(item));
            return result;
        }, []).join('\n\n');
    }

    buildPrintScheduledMessage(item) {
        return `To: ${item.alias}\nDate: ${item.date}\nMessages to send:\n${item.message}`;
    }

    areDataMessageCorrect(data) {
        return false;
    }

    errorHandler(ctx, message) {
        ctx.reply('Oupss ... Some error ocurred\n');
        ctx.reply(message);
    }

    buildKeyboard(ctx, message, buttons) {
        // set initial
        const options = this.keyboard_options;
        // handle keyboard
        const keyboard = new Keyboard(options);
        keyboard.add(...buttons);
        ctx.reply(
            message,
            keyboard.draw()
        );
    }
}

module.exports = new TelegramBot();
