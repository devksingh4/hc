function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

module.exports.replaceAll = (str, replace, replacement) => {
    return str.replace(new RegExp(escapeRegExp(replace), 'g'), replacement);
}