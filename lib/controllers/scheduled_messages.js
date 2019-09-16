// requirements
const conf = require('./../../conf/config');
// throw Error(`Error getting scheduled messages`)
function get() {
    const fetch = require('node-fetch')
    const apiUrl = `${conf.domain}:${conf.port}/messages`

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    const requestConfig = {
        method: 'GET',
        headers
    }

    return fetch(apiUrl, requestConfig)
        .then(response => response.json())
}

exports.getScheduledMessages = async (criterias) => {
    const messages = await get();
    return messages.filter((message) => message.scheduled);
}

exports.addScheduledMessage = (data) => ({});
