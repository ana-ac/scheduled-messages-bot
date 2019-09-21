/**
 * @module services
 * @requires services/scheduled_messages
 * @requires models
 */

module.exports = (models) => ({
    scheduledMessages: require('./scheduled_messages')(models)
});
