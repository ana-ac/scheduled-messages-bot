/**
 * @module utils/helpers
 */

module.exports = () => {
    /**
     * Process a replacers object in another object and replace the keywords
     * @function
     * @name processReplacers
     * @param {object} ctx
     * @param {object} info
     * @return {object}
     */
    function processReplacers(ctx, info) {
        if (isParameterDefined('replacers', info)) {
            return info.replacers.reduce((result, key) => {
                const processedInfo = info;
                if (findNeedle(key, info.message)) {
                    processedInfo.message = info.message.replace(
                        key,
                        info.empty_replacer ? '' : setValueToReplace(ctx, key)
                    );
                }
                return processedInfo;
            }, {});
        }
        return info;
    }
    /**
     * Decide for what value should be replaced
     * @function
     * @name setValueToReplace
     * @param {object} ctx object where find the replacer
     * @param {string|int} key key to find in object
     * @returns {string} Value to be replaced
     */
    function setValueToReplace(ctx, key) {
        return isParameterDefined(key.toLowerCase(), ctx) ? ctx[key.toLowerCase()] : '';
    }

    /**
     * Say if the parameter is defined
     * @function
     * @name findNeedle
     * @param {array|string} needle
     * @param {string|int} haystack
     * @return {bool}
     */
    function findNeedle(needle, haystack) {
        return (haystack.indexOf(needle) !== -1);
    }

    /**
     * Check if the paraemter is defined in the haystck given
     * @function
     * @name isParameterDefined
     * @param {string|int} needle
     * @param {object|null} haystack
     * @returns {bool}
     */
    function isParameterDefined(needle, haystack = null) {
        let result = false;
        if (haystack === null) {
            result = (typeof needle !== 'undefined');
        } else if (typeof haystack === 'object') {
            result = (typeof haystack[needle] !== 'undefined');
        }
        return result;
    }

    return {
        /**
         * Process objects with certain info to replace keys in for each message
         * @function
         * @name processMessages
         * @param {object} ctx
         * @param {array} messages
         * @return {array}
         */
        processMessages: (ctx, messages) => messages.reduce((result, info) => {
            const processedInfo = processReplacers(ctx, info);
            result[processedInfo.id] = processedInfo.message;
            return result;
        }, {}),
        findNeedle: (needle, haystack) => findNeedle(needle, haystack),
        isParameterDefined: (needle, haystack) => isParameterDefined(needle, haystack),
        /**
         * Transform string in snake case format to camel case
         * @function
         * @name snakeCaseToCamelCase
         * @param {string} str
         * @return {string}
         */
        snakeCaseToCamelCase: (str) => str.replace(
            /([-_][a-z])/g, (group) => group.toUpperCase()
                .replace('-', '')
                .replace('_', '')
        ),
        /**
         * Transform first character of string to upper case
         * @function
         * @name capitalize
         * @param {string} str
         * @return {string}
         */
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        /**
         * Transform a sentence to snake case replacinf the spaces by underscore
         * @function
         * @name stringToSnakeCase
         * @param {string} str
         * @return {string}
         */
        stringToSnakeCase: (str) => str.toLowerCase().split(' ').join('_'),

        /**
         * Remove the first character of a string
         * @function
         * @name removeFirstChar
         * @param {string} str
         * @return {string}
         */
        removeFirstChar: (str) => str.slice(1)
    };
};
