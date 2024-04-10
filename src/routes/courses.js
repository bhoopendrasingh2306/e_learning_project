const express = require("express");
const router = express.Router();
const db = require("../db/config");

// -----------------------------------------------------adding new course by admin ---------------------------------------------
//http://localhost:4000/courses/add_course
router.post("/add_course", async (req, res) => {
  try {
    const { admin_id, name, type, price, description } = req.body;
    const course_id = parseInt(Math.random() * 100000);
    const check_admin = await db.query(
      `select * from super_admin where admin_id=${admin_id}`
    );
    if (check_admin.rowCount === 0) {
      res.status(201).json({ result: "Super Admin details are not matched" });
    } else {
      const response =
        await db.query(`INSERT INTO course (admin_id,name,type,price,description, course_id)
          VALUES ('${admin_id}',' ${name}','${type}','${price}','${description}','${course_id}')`);

      res.status(201).json(response[0]);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// -------------------------------------------------course update only by admin---------------------------------------------------
//http://localhost:4000/courses/update/:course_id
router.put("/update/:course_id", async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const { admin_id, name, type, price, description } = req.body;
    const check_admin = await db.query(
      `select * from super_admin where admin_id=${admin_id}`
    );
    if (check_admin.rowCount === 0) {
      res.status(400).json({ result: "Super Admin details are not matched" });
    } else {
      const course_check = await db.query(
        `select * from course where course_id = '${course_id}'`
      );
      if (course_check.rowCount === 0) {
        res.status(400).json({ result: "Course details are not matched" });
      } else {
        const response = await db.query(
          `UPDATE course SET name = '${name}', type = '${type}', price = '${price}', description = '${description}', WHERE admin_id = ${admin_id}`
        );
        res.status(200).json(response.rows);
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// --------------------------------------------------course delete only by admin---------------------------------------------------
//http://localhost:4000/courses/delete/:course_id
router.delete("/delete/:course_id", async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const { admin_id } = req.body;
    const check_admin = await db.query(
      `select * from course where admin_id=${admin_id}`
    );

    if (check_admin.rowCount === 0) {
      res.status(400).json({ result: "Super Admin details are not matched" });
    } else {
      const course_check = await db.query(
        `select * from course where course_id = '${course_id}'`
      );
      if (course_check.rowCount === 0) {
        res.status(400).json({ result: "Course details are not matched" });
      } else {
        const response = await db.query(
          `delete from course WHERE course_id = '${course_id}'`
        );
        res.status(200).json(response.rows);
      }
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ------------------------------------------------show all courses created by admin_id----------------------------------
//http://localhost:4000/courses/byadmin/:admin_id
router.get("/byadmin/:admin_id", async (req, res) => {
  try {
    const admin_id = req.params.admin_id;
    const response = await db.query(
      `select * from course where admin_id = '${admin_id}'`
    );
    if (response.rowCount === 0) {
      res.status(400).json({ result: "No course available for now" });
    } else {
      res.status(200).json(response.rows);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ---------------------------------------------------show all courses -----------------------------------------------
//http://localhost:4000/courses/all_courses
router.get("/all_courses", async (req, res) => {
  try {
    const response = await db.query(`select * from course`);
    res.status(200).json(response.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

// --------------------------------------------------search courses by course id----------------------------------------------
//http://localhost:4000/courses/:course_id
router.get("/:course_id", async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const response = await db.query(
      `select * from course where course_id = '${course_id}'`
    );
    if (response.rowCount === 0) {
      res
        .status(400)
        .json({ result: "No Course found. Please provide correct course_id" });
    } else {
      res.status(200).json(response.rows);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// --------------------------------------------------search courses by course description----------------------------------------------
//http://localhost:4000/courses/name/:description
router.get("/description/:description", async (req, res) => {
  console.log("datas");
  try {
    const name = req.params.description;
    const response = await db.query(
      ` select * from course where description = '${name}'`
    );
    if (response.rowCount === 0) {
      res
        .status(400)
        .json({ result: "No Course found. Please provide correct course_id" });
    } else {
      res.status(200).json(response.rows);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// --------------------------------------------------search courses by type--------------------------------------------------
//http://localhost:4000/courses/type/:type
router.get("/type/:type", async (req, res) => {
  console.log("datas");
  try {
    const name = req.params.type;
    const response = await db.query(
      ` select * from course where type = '${name}'`
    );
    if (response.rowCount === 0) {
      res
        .status(400)
        .json({ result: "No Course found. Please provide correct course_id" });
    } else {
      res.status(200).json(response.rows);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// ------------------------------------------------------search course by name--------------------------------
//http://localhost:4000/courses/names/:name
router.get("/names/:name", async (req, res) => {
  console.log("datas");
  try {
    const name = req.params.name;
    const response = await db.query(
      ` select * from course where name = '${name}'`
    );
    if (response.rowCount === 0) {
      res
        .status(400)
        .json({ result: "No Course found. Please provide correct course_id" });
    } else {
      res.status(200).json(response.rows);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
