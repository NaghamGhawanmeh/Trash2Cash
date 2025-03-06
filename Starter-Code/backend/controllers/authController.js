const { pool } = require("../models/db");
const jwt = require("jsonwebtoken");

const loginGoogle = (req, res) => {
  console.log(req.body);
  const { email, given_name, family_name } = req.body;
  const query = `SELECT * from users where email=$1`;
  pool
    .query(query, [email])
    .then(async (result) => {
      console.log("rd", result.rows);
      if (result.rows.length > 0) {
        const payload = {
          userId: result.rows[0].id,
          firstName: result.rows[0].first_name,
          roleid: result.rows[0].role_id,
        };
        const options = { expiresIn: "200m" };
        const token = await jwt.sign(payload, process.env.SECRET, options);

        return res.status(201).json({
          success: true,
          message: "You are logged in successfully",
          token: token,
          userId: result.rows[0].id,
          roleId: result.rows[0].role_id,
        });
      } else {
        const query = `INSERT INTO users (first_name, last_name, email, role_id) 
        VALUES ($1, $2, $3, $4) RETURNING *`;

        pool
          .query(query, [given_name, family_name, email, 2])
          .then(async (result) => {
            const payload = {
              userId: result.rows[0].id,
              firstName: result.rows[0].first_name,
              roleid: result.rows[0].role_id,
            };
            const options = { expiresIn: "200m" };
            const token = await jwt.sign(payload, process.env.SECRET, options);

            return res.status(201).json({
              success: true,
              message: "You are logged in successfully",
              token: token,
              userId: result.rows[0].id,
              roleId: result.rows[0].role_id,
            });
          })
          .catch((err) => {
            res.status(409).json({
              success: false,
              message: "The email already exists",
              err: err.message,
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { loginGoogle };
