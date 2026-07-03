// const app = require("./app")
// const connectDatabase = require("./db/Database.js");


// // Handling uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`shutting down the server for handling uncaught exception`);
// });


// // config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   require("dotenv").config({
//     path: "./config/.env"
//   });
// }

// // const app = require("./app");
// // const connectDatabase = require("./db/Database");

// // handling uncaught exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server for handling uncaught exception");
// });

// // connect db
// connectDatabase();

// const PORT = process.env.PORT || 5000;

// // create server
// const server = app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

// // unhandled promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Shutting down the server for ${err.message}`);
//   console.log("Shutting down the server for unhandled promise rejection");

//   server.close(() => {
//     process.exit(1);
//   });
// });

// //yahan tak yh khtm hua
const app = require("./app");
const connectDatabase = require("./db/Database");
const { create } = require("./model/user.model");

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for handling uncaught exception");
});
//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

//connect db
connectDatabase();

//create server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log("Shutting down the server for unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
