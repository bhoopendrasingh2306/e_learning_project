const express = require("express");
// const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require("../db/config");

// -----------------------------------------------------add new super admin ---------------------------------------------
//http://localhost:4000/super_admin/add_admin
router.post("/add_admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin_id = parseInt(Math.random() * 100000);
    const response =
      await db.query(`INSERT INTO super_admin (admin_id,name,email,password )
          VALUES ('${admin_id}',' ${name}','${email}','${password}') on conflict do nothing`);

    res.status(201).json(response);
  } catch (err) {
    res.status(400).json(err);
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
    const { name, email, password } = req.body;
    const response = await db.query(
      `UPDATE super_admin SET name = '${name}', email = '${email}', password = '${password}' WHERE admin_id = ${admin_id}`
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
