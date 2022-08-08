require("datejs")

const parsedDate = (dateInMS,format) =>{
    const date = new Date(dateInMS);
    return date.toString(format);
}

module.exports = parsedDate