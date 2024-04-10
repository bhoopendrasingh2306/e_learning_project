// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
const pool = require("./db/config");

require("dotenv").config({ path: ".env" });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);

// ======================================================================
console.log("hi");
pool.connect();

const superadminRoute = require("./routes/super_admin");
app.use("/super_admin", superadminRoute);

const courseRoute = require("./routes/courses");
app.use("/courses", courseRoute);

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

const userprofileRoute = require("./routes/user_profile");
app.use("/user_profile", userprofileRoute);

const user_enrollmentRoute = require("./routes/user_enrollment");
app.use("/user_enrollment", user_enrollmentRoute);

app.listen(process.env.PORT || 5000, function () {
  console.log("App running on port 4000.");
});
