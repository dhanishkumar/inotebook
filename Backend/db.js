const mongoose = require('mongoose');
//mongodb connection link
const mongoURI = "mongodb+srv://dhanishkumar:Dhanish12@notes.95pfs.mongodb.net/inotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
