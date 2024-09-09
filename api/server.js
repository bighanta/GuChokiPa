const express = require("express");
const cors = require("cors");

const app = express();

//var corsOptions = {
//  origin: "http://localhost"
//};

app.use(cors());

//parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));
const db = require("./model");

console.log(db.url);

db.mongoose
  .connect(db.url, {
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
console.log("Nothing or Anything");
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to project application." });
});

// Import Routes
require("./route/tutorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

