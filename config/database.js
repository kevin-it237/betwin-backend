const localDB = "mongodb://localhost/betwin";
const liveDB = "mongodb+srv://betwin:yBOOzFXLBP39B0ni@cluster0.tvrqc.mongodb.net/betwin?retryWrites=true&w=majority"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}