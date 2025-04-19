const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connectToMongoDB(url) {
  try {
    mongoose.connect(url);
  } catch (error) {
    console.error("DB connection Failed: ", error);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
