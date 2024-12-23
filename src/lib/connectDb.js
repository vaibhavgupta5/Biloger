const mongoose = require("mongoose");

const connectDb = async () => {
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        console.log("Already connected to the database");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI || "", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to the database", error);
        throw new Error("Database connection failed");
    }
};

module.exports = connectDb;
