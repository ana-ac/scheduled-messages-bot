/**
 * @module telegrambot
 * @requires bot
 * @requires config
 * @requires utils
 * @requires lodash
 * @requires telegraf
 * @requires telegraf-keyboard
 */

// dependencies
const Telegraf = require('telegraf');
const Keyboard = require('telegraf-keyboard');

// requirements
const config = require('./config/config');
const helpers = require('./../bin/utils');
const Bot = require('./bot');
/**
 * @readonly
 * @property getScheduledMessages
 * @property addScheduledMessage
 * @type {function}
 */
const {
    getScheduledMessages,
    addScheduledMessage,
} = require('./controllers/scheduled_messages');

/**
 * @class
 * @classdesc TelegramBot class that handle all the events that receives from the bot and the business logic
 * @extends Bot
 * @see {@link bot.js}
 */
class TelegramBot extends Bot {

    /**
     * @constructor
     */
    constructor() {
        super(
            new Telegraf(config.telegram_token)
        );
        /**
         * @readonly
         * @property {bool} inline
         * @property {bool} newline
         * @property {bool} duplicates
         * @type {bool}
         */
        this.keyboard_options = {
            inline : true,
            newline : true,
            duplicates : true
        };
    }

    /**
     * Launch telegram bot
     */
    launch() {
        this.bot.launch();
    }

    /**
     * Bind all events that this bot is going handle
     * @see commandHandler
     */
    bindEvents() {
        this.bot.start((ctx) => ctx.reply(this.reply_messages.start));
        this.bot.help((ctx) => ctx.reply(this.reply_messages.help));
        this.bot.mention(this.bot_name, (ctx) => ctx.reply(this.reply_messages.mention));
        this.available_commands.forEach((command) => {
            this.bot.command(command, (ctx) => this.commandHandler(ctx, command));
        });
        // this.bot.action(this.processAction);
    }

    /**
     * Handle commands thows from bot
     * @param {object} ctx Telegraf context
     * @param {string} action Name of command executed
     * @see handleGetScheduledMessages
     * @see handleAddScheduledMessage
     */
    commandHandler(ctx, action) {
        /**
         * @const
         * @type {string}
         */
        const fn = `handle${helpers.capitalize(helpers.snakeCaseToCamelCase(action))}`;
        this[fn](ctx);
    }
    /**
     * Handle action to get scheduled messages
     * @param  {object} ctx
     * @see getScheduledMessages
     * @see handleResponseScheduledMessages
     * @see errorHandler
     */
    handleGetScheduledMessages(ctx) {
        try {
            /**
             * @const
             * @type {array}
             * @default
             */
            const criterias = [];
            /**
             * @const
             * @type {object}
             */
            const response = getScheduledMessages(criterias);
            this.handleResponseScheduledMessages(ctx, response);
        } catch (err) {
            this.errorHandler(ctx, err.message);
        }
    }
    /**
     * Handle action to add scheduled messages
     * @param  {object} ctx
     * @see buildKeyboard
     * @see addScheduledMessage
     * @see areDataMessageCorrect
     */
    handleAddScheduledMessage(ctx) {
        /**
         * @const
         * @type {object}
         * @default
         */
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
    /**
     * Handle response received from API of taking the scheduled messages
     * @param  {object} ctx
     * @param  {object} response
     * @see formatResponseScheduledMessages
     */
    handleResponseScheduledMessages(ctx, response) {
        if (!helpers.isParameterDefined('scheduled_messages', response) || response.scheduled_messages.length === 0) {
            ctx.reply('There are any scheduled meessages pending to send');
            return;
        }
        /**
         * @const
         * @type {object}
         */
        const scheduledMessages = this.formatResponseScheduledMessages(
            response.scheduled_messages
        );
        ctx.reply(scheduledMessages);
    }

    /**
     * Handle error ocurred
     * @param {object} ctx
     * @param {string} message
     */
    errorHandler(ctx, message) {
        ctx.reply('Oupss ... Some error ocurred\n');
        ctx.reply(message);
    }

    /**
     * Draw keyboard in message
     * @param {object} ctx
     * @param {message} message
     * @param {object} buttons
     */
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
