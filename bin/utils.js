function processReplacers(ctx, info) {
    if (isParameterDefined('replacers', info)) {
        return info.replacers.reduce((result, key) => {
            let processedInfo = info;
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

function setValueToReplace(ctx, key) {
    return isParameterDefined(key.toLowerCase(), ctx) ? ctx[key.toLowerCase()] : '';
}

function findNeedle(needle, haystack) {
    return (haystack.indexOf(needle) !== -1);
}

function isParameterDefined(needle, haystack = null) {
    let result = false;
    if (haystack === null) {
        result = (typeof needle !== 'undefined');
    } else if (typeof haystack === 'object') {
        result = (typeof haystack[needle] !== 'undefined');
    }
    return result;
}

exports.processMessages = (ctx, messages) => messages.reduce((result, info) => {
    const processedInfo = processReplacers(ctx, info);
    result[processedInfo.id] = processedInfo.message;
    return result;
}, {});

exports.findNeedle = (needle, haystack) => findNeedle(needle, haystack);

exports.isParameterDefined = (needle, haystack) => isParameterDefined(needle, haystack);

exports.snakeCaseToCamelCase = (str) => str.replace(
    /([-_][a-z])/g, (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
);

exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

exports.stringToSnakeCase = (str) => str.toLowerCase().split(' ').join('_');

exports.removeFirstChar = (str) => str.slice(1);
