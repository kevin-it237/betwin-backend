const localDB = "mongodb://admin:admin5@ds329668.mlab.com:29668/betwin";
const liveDB = "mongodb://admin:admin5@ds329668.mlab.com:29668/betwin"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}