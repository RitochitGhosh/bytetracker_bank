const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);

async function connectToMongoDB() {
  try {
    mongoose.connect(process.env.MONGO_CONNECTION_URL);
  } catch (error) {
    console.error("DB connection Failed: ", error);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
