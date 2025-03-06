const pool = require("../models/db");

const authorization = (permission) => {
  return function (req, res, next) {
    if (!req.token || !req.token.roleid) {
      return res
        .status(403)
        .json({ message: "Forbidden: Missing or invalid token" });
    }

    const role_id = req.token.roleid;
    const query = `
      SELECT * FROM role_permission RP 
      INNER JOIN permissions P ON RP.permission_id = P.id 
      WHERE RP.role_id = $1 AND P.permission = $2
    `;

    pool
      .query(query, [role_id, permission])
      .then((result) => {
        if (result.rows.length > 0) {
          return next();
        }
        if (!res.headersSent) {
          return res
            .status(403)
            .json({
              message: "Forbidden: You do not have the required permissions",
            });
        }
      })
      .catch((err) => {
        console.error("Authorization Error:", err);
        if (!res.headersSent) {
          return res
            .status(500)
            .json({ message: "Server error", error: err.message });
        }
      });
  };
};

module.exports = authorization;


