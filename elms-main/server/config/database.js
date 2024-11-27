const mongoose = require("mongoose");
require("dotenv").config();

// Extracting MONGODB_URL from environment variables
const { MONGO_URI } = process.env;

exports.connect = () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1); // Exit process if MONGODB_URL is missing
  }

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connection Success"))
    .catch((err) => {
      console.error("DB Connection Failed");
      console.error(err.message);
      process.exit(1); // Exit the process on connection failure
    });
};
