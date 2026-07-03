const mongoose = require("mongoose");

const connectDatabase = () => {

  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
      console.log(`Database name: ${data.connection.name}`);
    })
    .catch((err) => {

      console.log(`Database connection failed: ${err.message}`);
    });
};

module.exports = connectDatabase;