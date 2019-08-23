function _processReplacers(_this, info) {
    if (typeof info.replacers !== 'undefined') {
        info.replacers.map(key => {
            if ((info.message.indexOf(key) !== -1) &&
            (typeof _this[key.toLowerCase()] !== 'undefined' || info.empty_replacer)) {
                let value = typeof _this[key.toLowerCase()] !== 'undefined' ? _this[key.toLowerCase()] : '';
                info.message = info.message.replace(key, value);
            }
        });
    }
    return info;
}

exports.processMessages = (_this, messages) => {
    return messages.reduce(function(processed, info){
        info = _processReplacers(_this, info);
        processed[info.id] = info.message
        return processed
    },{})
}

exports.snakeCaseToCamelCase = (str) => str.replace(
    /([-_][a-z])/g, (group) => group.toUpperCase()
                                    .replace('-', '')
                                    .replace('_', '')
);

exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);