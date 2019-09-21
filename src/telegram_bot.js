/**
 * @module telegrambot
 * @requires bot
 * @requires conf
 * @requires services
 * @requires utils
 */

// dependencies
/** @external telegraf */
const Telegraf = require('telegraf');
/** @external telegraf-keyboard */
const Keyboard = require('telegraf-keyboard');

module.exports = (conf, helpers, { scheduledMessages }, Bot) => {
    /**
     * @class
     * @classdesc TelegramBot class that handle all the events that receives
     * from the bot and the business logic
     * @extends Bot
     * @see {@link bot.js}
     */
    class TelegramBot extends Bot {
        /**
         * @constructor
         */
        constructor() {
            super(
                new Telegraf(conf.telegram_token)
            );
            /**
             * @readonly
             * @property {bool} inline
             * @property {bool} newline
             * @property {bool} duplicates
             * @type {bool}
             */
            this.keyboard_options = {
                inline: true,
                newline: true,
                duplicates: true
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
         * @function
         * @name bindEvents
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
         * @function
         * @name commandHandler
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
         * @function
         * @name handleGetScheduledMessages
         * @param  {object} ctx
         * @see scheduledMessages
         * @see errorHandler
         */
        async handleGetScheduledMessages(ctx) {
            try {
                const data = await scheduledMessages.list();
                const DataFormatted = await scheduledMessages.listToString(data);
                ctx.reply(DataFormatted);
            } catch (err) {
                this.errorHandler(ctx, err.message);
            }
        }

        /**
         * Handle action to add scheduled messages
         * @function
         * @name handleAddScheduledMessage
         * @param  {object} ctx
         * @see buildKeyboard
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
                // return
            }
            // if data necessary from message is ok will be send to controller
            // addScheduledMessage(data);
        }

        /**
         * Handle error ocurred
         * @function
         * @name errorHandler
         * @param {object} ctx
         * @param {string} message
         */
        errorHandler(ctx, message) {
            ctx.reply(message);
        }

        /**
         * Draw keyboard in message
         * @function
         * @name buildKeyboard
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
    return new TelegramBot();
};
