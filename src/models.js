/**
 * @module models
 * @requires conf
 */

// requirements
/** @external fetch  */
const fetch = require('node-fetch');

module.exports = (conf) => {
    const baseUrl = `${conf.domain}:${conf.port}`;
    const headers = {
        'Content-Type': 'application/json'
    };

    const ScheduledMessage = {
        /**
         * API call to get messages
         * @function
         * @name get
         * @returns {promise}
         */
        get: () => {
            const apiUrl = `${baseUrl}/messages`;
            const requestConfig = {
                method: 'GET',
                headers
            };
            return fetch(apiUrl, requestConfig)
                .then((response) => response.json());
        }
    };
    return { ScheduledMessage };
};
