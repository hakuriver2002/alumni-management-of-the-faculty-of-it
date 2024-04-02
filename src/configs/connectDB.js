const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'alumni-management-system'
        })
        console.log("MongoDB connected ...")
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB