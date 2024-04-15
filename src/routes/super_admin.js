const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../db/config");
const validator = require("validator");
const passwordValidator = require("password-validator");

// -----------------------------------------------------signup new super admin ---------------------------------------------
//http://localhost:4000/super_admin/signup
router.post("/signup", async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { name, email } = req.body;
    const admin_id = parseInt(Math.random() * 100000);
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    } else {

      // password validatioin check
      const isValid = schema.validate(req.body.password);
      if (!isValid) {
        return res.status(400).json({ message: "Password is not valid" });
      }else{
        const adminCheck = await db.query(
          `select * from super_admin where email = '${email}'`
        );
        if (adminCheck.rowCount > 0) {
          res
            .status(400)
            .json({ result: "Admin with this Email Already exists" });
        } else {
          const response =
            await db.query(`INSERT INTO super_admin (admin_id,name,email,password )
            VALUES ('${admin_id}',' ${name}','${email}','${hashedPassword}') on conflict do nothing`);
  
          res.status(201).json(response);
        }
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ---------------------------------------------------login super admin with email and password -----------------------------------------------
//http://localhost:4000/super_admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const payload = {  email: email, password: password };
  const user = await db.query(
    `select * from super_admin where email = '${email}'`
  );
  if (user.rowCount == 0) {
    return res
      .status(400)
      .json({ result: "cannot find admin with this email" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.rows[0].password)) {
      res.status(200).json(payload);
    } else {
      res.status(400).json({ result: "wrong password" });
    }
  } catch (err) {
    res.status(401).json(err);
  }
});

// ---------------------------------------------------- get super admin list -------------------------------------------
//http://localhost:4000/super_admin/alladmins
router.get("/alladmins", async (req, res) => {
  try {
    const response = await db.query(`select * from super_admin`);

    res.status(200).json(response.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

// ---------------------------------------------------- search super admin by admin_id -------------------------------------------
//http://localhost:4000/super_admin/:admin_id
router.get("/:admin_id", async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const response = await db.query(
      `select * from super_admin where admin_id=${admin_id}`
    );

    res.status(200).json(response.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

// ---------------------------------------------------- update super admin by admin_id -------------------------------------------
//http://localhost:4000/super_admin/:admin_id
router.put("/:admin_id", async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { name, email } = req.body;
    const response = await db.query(
      `UPDATE super_admin SET name = '${name}', email = '${email}', password = '${hashedPassword}' WHERE admin_id = ${admin_id}`
    );

    res.status(200).json(response.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

// -----------------------------------------------------delete super admin by admin id --------------------------------------------
// http://localhost:4000/super_admin/delete/:admin_id
router.delete("/delete/:admin_id", async (req, res) => {
  try {
    const admin_id = req.params.admin_id;

    if (req.params.admin_id) {
      const response = await db.query(
        `delete from super_admin WHERE admin_id = '${admin_id}'`
      );
      res.status(200).json(response[0]);
    } else {
      res.status(400).json({ message: "Request UserId not Found." });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
