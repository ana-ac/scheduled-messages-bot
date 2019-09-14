/**
 * @module bot
 * @requires config
 * @requires utils
 * @requires lodash
 */

// requirements
const config = require('./config/config');
const helpers = require('./../bin/utils');

/**
 * @class
 * @classdesc Bot Class is the father of the implemented bots and handle the common logic
 */
class Bot {

    /**
     * @constructor
     * @param {object} bot
     * @see helpers
     * @see loadConfig
     * @see bindEvents
     */
    constructor(bot) {
        /** @global */
        this.bot = bot;
        this.loadConfig();
        if (helpers.isParameterDefined('bindEvents', this)) {
            this.bindEvents();
        }
    }

    /**
     * Load config for application
     */
    loadConfig() {
        /** @global */
        this.buttons = config.buttons || {};
        /** @global */
        this.bot_name = config.bot_name || '';
        /** @global */
        this.available_commands = config.available_commands || [];
        /** @global */
        this.reply_messages = helpers.processMessages(this, config.reply_messages) || {};
    }

    /**
     * Check if we have all content necessary to add a scheduled message
     * @param  {object} data
     * @returns {bool} we have all data?
     */
    areDataMessageCorrect(data) {
        return false;
    }

    /**
     * Format the response of the scheduled messages to show like string
     * @param  {object} scheduledMessages
     * @returns {string} scheduled message in a string
     */
    formatResponseScheduledMessages(scheduledMessages) {
        return scheduledMessages.reduce((result, item) => {
            result.push(this.buildPrintScheduledMessage(item));
            return result;
        }, []).join('\n\n');
    }

    /**
     * Build Scheduled message info in string
     * @param {object} item
     * @returns {string} Scheduled message in string
     */
    buildPrintScheduledMessage(item) {
        return `To: ${item.alias}\nDate: ${item.date}\nMessages to send:\n${item.message}`;
    }
}

module.exports = Bot;
