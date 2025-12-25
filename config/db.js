const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conected To Database ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`Error in Database Connection ${error}`.bgRed.white);
    }
};

module.exports = connectDB;