exports.snakeCaseToCamelCase = (str) => str.replace(
    /([-_][a-z])/g, (group) => group.toUpperCase()
                                    .replace('-', '')
                                    .replace('_', '')
);

exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);