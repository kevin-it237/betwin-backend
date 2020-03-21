const localDB = "mongodb://localhost/surveycmr";
const liveDB = "mongodb://admin:admin5@ds329668.mlab.com:29668/surveycmr"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}