const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator"); //this validator library is used for email validation
const passwordValidator = require("password-validator");
const cloudinary = require("../utils/cloudinary");
const router = express.Router();
const db = require("../db/config");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const jwt = require("jsonwebtoken");
const jwtKey = "my-key";
const accessControl = require("../middlewares/jwt_verification");





// -------------------------------------------------------------getting the user profile information------------------------
//http://localhost:4000/user_profile/:user_id
router.get("/:user_id",accessControl, async (req, res) => {
  try {
    jwt.verify(req.token,jwtKey, async(err,authData)=>{
      if(err){
        res.status(400).send({result:"Invalid Token"});
      }else{
        const user_id = req.params.user_id;
        const response = await db.query(
          `select * from users where user_id='${user_id}'`
        );
        res.status(200).json({response:response.rows, authData:authData});
      }
    })
  } catch (err) {
    res.status(400).json(err);
  }
});

// ---------------------------------------------------------------updating the user profile-----------------------------------
//http://localhost:4000/user_profile/update/:user_id
router.put("/update/:user_id", accessControl,async (req, res) => {
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
    const password = hashedPassword;
    const user_id = req.params.user_id;
    const { name, email, stream, course } = req.body;
    const file = req.files.image_url;
    // -----------------
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      console.log("image res------->", result.url);
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
        subject: "Updating User Details",
        html: "<strong>The User Details of Your Account are Updated!</strong>",
      });

      if (error) {
        return res.status(400).json({ error });
      }

      const response = await db.query(
        `UPDATE users SET name = '${name}', email = '${email}', password = '${password}', stream = '${stream}', course = '${course}', image_url = '${result.url}' WHERE user_id = ${user_id}`
      );

      res.status(200).json({ data: data, response: response });
      console.log("compok------------>>>>>", {
        data: data,
        response: response,
      });
    });
  } catch (err) {
    res.status(400).json(console.log(err));
  }
});

module.exports = router;
