const localDB = "mongodb://127.0.0.1/betwin";
const liveDB = "mongodb+srv://betwin-admin:betwin@123@cluster0.tvrqc.mongodb.net/betwin?retryWrites=true&w=majority"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}