/**
 * @module bot
 * @requires conf
 * @requires helpers
 * @requires lodash
 */

module.exports = (conf, helpers) =>  {
    /**
     * @class
     * @classdesc Bot Class is the father of the implemented bots and handle the common logic
     */
    class Bot {
        /**
         * @constructor
         * @param {object} bot
         * @see helpers
         * @see loadconf
         * @see bindEvents
         */
        constructor(bot) {
            /** @global */
            this.bot = bot;
            this.loadconf();
            if (helpers.isParameterDefined('bindEvents', this)) {
                this.bindEvents();
            }
        }

        /**
         * Load conf for application
         * @function
         * @name loadConf
         */
        loadconf() {
            /** @global */
            this.buttons = conf.buttons || {};
            /** @global */
            this.bot_name = conf.bot_name || '';
            /** @global */
            this.available_commands = conf.available_commands || [];
            /** @global */
            this.reply_messages = helpers.processMessages(this, conf.reply_messages) || {};
        }

        /**
         * Check if we have all content necessary to add a scheduled message
         * @function
         * @name areDataMessageCorrect
         * @param  {object} data
         * @returns {bool} we have all data?
         */
        areDataMessageCorrect(data) {
            return false;
        }

    }
    return Bot;
}

