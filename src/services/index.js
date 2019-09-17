module.exports = (models) => {
    return {
        scheduledMessages: require("./scheduled_messages")(models)
    };
};
