const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

let { POOLED_URL, URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } =
  process.env;
const pool = new Pool({
  // host: PGHOST,
  // database: PGDATABASE,
  // username: PGUSER,
  // password: PGPASSWORD,
  // port: 5432,
  // ssl: 'require',
  // connection: {
  //   options: `project=${ENDPOINT_ID}`,
  // },
  connectionString: POOLED_URL,
});

pool.on("connect", () => {
  console.log("database connected successfully");
});

pool.on("end", () => {
  console.log("database disconnected");
});

module.exports = pool;
