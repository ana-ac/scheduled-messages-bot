/**
 * @module services/scheduled_messages
 * @requires models
 */

module.exports = (models) => {
    return { list, listToString };
    /**
     * To get the scheduled messages from model
     * @function
     * @name list
     * @returns {array}
     */
    async function list() {
        const messages = await models.ScheduledMessage.get();
        return messages.filter((message) => message.scheduled);
    }
    /**
     * Get a messages formatted in a text
     * @function
     * @name listToString
     * @param {array} data
     * @returns {string}
     */
    function listToString(data) {
        if (data.length === 0) {
            throw Error('Error getting scheduled messages');
        }
        return data.reduce((result, item) => {
            result.push(`To: ${item.alias}\nDate: ${item.date}\nMessages to send:\n${item.message}`);
            return result;
        }, []).join('\n\n');
    }
};
