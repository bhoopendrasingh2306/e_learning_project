const express = require("express");
// const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require("../db/config");
const jwt = require("jsonwebtoken");
const jwtKey = "my-key";
const accessControl = require("../middlewares/jwt_verification");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);




// ----------------------------------------------------enrolling the user into a course -------------------------
//http://localhost:4000/user_enrollment/:user_id
router.post("/:user_id",accessControl,async (req, res) => {
  try {
    const { course_id, course_name, user_name, email } = req.body;
    const enrollment_id = parseInt(Math.random() * 100000);
    // check if user already exists
    const ifAlreadyExists = await db.query(
      `select * from user_enrollment where user_id = '${req.params.user_id}' and course_id = '${course_id}'`
    );
    console.log("detaislls", ifAlreadyExists);
    if (!ifAlreadyExists.rowCount == 0) {
      res
        .status(400)
        .json({ error: "USER IS ALREADY ENROLLED IN THIS COURSE" });
    } else {

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
        await db.query(`INSERT INTO user_enrollment (enrollment_id,user_name,user_id,course_name, course_id, email )
          VALUES ('${enrollment_id}',' ${user_name}','${req.params.user_id}','${course_name}', '${course_id}','${email}') on conflict do nothing`);

      res.status(201).json({response: response, data: data});
      console.log("response---------->",{response: response, data: data});
    }
  } catch (err) {
    res.status(400).json(console.log(err));
  }
});

// ------------------------------------------getting all courses in which a user is enrolled----------------------------------
// http://localhost:4000/user_enrollment/courses_for/:user_id
router.get("/courses_for/:user_id", accessControl ,async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const response = await db.query(
      `select * from user_enrollment where user_id='${user_id}'`
    );

    res.status(200).json(response.rows);
    console.log(response.rows);
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
