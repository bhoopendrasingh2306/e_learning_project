const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator"); //this validator library is used for email validation
const passwordValidator = require("password-validator");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const db = require("../db/config");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const jwtKey = "my-key";


const accessControl = require("../middlewares/jwt_verification");
// -----------------------------------------------------register new user---------------------------------------------
//http://localhost:4000/users/registration
router.post("/registration", async (req, res) => {
  const passcode = req.body.password;
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces();

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passcode, salt);
    const { name, email, stream, course } = req.body;
    const password = hashedPassword;
    const user_id = parseInt(Math.random() * 100000);

    // profile image upload on cloudinary

    const file = req.files.image_url;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      console.log("image res------->", result.url);
      const payload = {
        name: name,
        email: email,
        password: password,
        stream: stream,
        course: course,
        image_url: result.url,
        user_id: user_id,
      };

      const existingUser = await db.query(
        `select * from users where email = '${email}'`
      );
      if (!existingUser.rowCount == 0) {
        return res.status(400).json({ error: "Email/user already exists" });
      }

      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // password validatioin check
      const isValid = schema.validate(passcode);
      if (!isValid) {
        return res.status(400).json({ message: "Password is not valid" });
      }

      // sending email confirmation
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "User Registration",
        html: "<strong>User Registered Successfully</strong>",
      });

      if (error) {
        return res.status(400).json({ error });
      }

      const response =
        await db.query(`INSERT INTO users (user_id,name,email,password,stream , course, image_url )
            VALUES ('${user_id}',' ${name}','${email}','${password}','${stream}','${course}','${result.url}') on conflict do nothing`);

      jwt.sign({ payload }, jwtKey, { expiresIn: "5h" }, (err, token) => {
        if (err) {
          res.send({ result: "something went wrong or token expired" });
        } else {
          res.status(200).send({ data: data, response: response, auth: token });
          console.log("user signup detailed data======>", {
            data: data,
            response: response,
            auth: token,
          });
        }
      });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// -------------------------------------user LOGIN -----------------------------
//http://localhost:4000/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.query(`select * from users where email = '${email}'`);
  if (user.rowCount == 0) {
    return res.status(400).json("cannot find user");
  }
  try {
    const payload = { email: email, password: password };
    if (await bcrypt.compare(req.body.password, user.rows[0].password)) {
      jwt.sign({ payload }, jwtKey, { expiresIn: "5h" }, (err, token) => {
        if (err) {
          res.send({ result: "something went wrong or token expired" });
        } else {
          res.status(200).send({ response: payload, auth: token });
          console.log("userlogin detailed data======>", {
            response: payload,
            auth: token,
          });
        }
      });
      // res.status(200).json("successfully logged in");
    } else {
      res.status(400).json("wrong password");
    }
  } catch (err) {
    res.status(400).json(console.log(err));
  }
});

// -------------------------------------------------------------delete user-----------------------------------------------
// http://localhost:4000/users/delete/:user_id
router.delete("/delete/:user_id", accessControl, async (req, res) => {
  try {
    jwt.verify(req.token, jwtKey, async (err, authData) => {
      if (err) {
        res.status(400).send({ result: "invalid token" });
      } else {
        const user_id = req.params.user_id;
        const validUser = await db.query(
          `select * from users where user_id ='${user_id}'`
        );
        if (validUser.rowCount > 0) {
          const response = await db.query(
            `delete from users WHERE user_id = '${user_id}'`
          );
          res.status(200).json({response:response,authData:authData});
        } else {
          res.status(400).json({ message: " UserId not Found." });
        }
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;

// jwt.verify(req.token,jwtKey, async(err,authData)=>{
//   if(err){
//     res.status(400).send({result:"Invalid Token"});
//   }else{

//   }
// })