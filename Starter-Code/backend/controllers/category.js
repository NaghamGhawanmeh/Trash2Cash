const { pool } = require("../models/db");

const addCategory = async (req, res) => {
  const {
    category_name,
    description,
    image,
    points_per_kg,
    price_per_dimensions,
    price_per_kg,
  } = req.body;
  const query = `INSERT INTO category ( category_name, description, image,points_per_kg,price_per_dimensions,price_per_kg) VALUES($1 , $2 , $3,$4,$5,$6 ) returning *`;
  const data = [
    category_name,
    description,
    image,
    points_per_kg,
    price_per_dimensions,
    price_per_kg,
  ];
  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

const getAllCategories = (req, res) => {
  const query = `SELECT * FROM category WHERE is_deleted=0;`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the Categories",
        Categories: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};
const deleteCategoryById = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE category SET is_deleted=1 WHERE id=$1;`;
  const data = [id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Categiries with id: ${id} deleted successfully`,
        });
      } else {
        throw new Error("Error happened while deleting article");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const updateCategoryById = (req, res) => {
  const id = req.params.id;
  let {
    category_name,
    description,
    image,
    points_per_kg,
    price_per_dimensions,
    price_per_kg,
  } = req.body;

  const query = `UPDATE category SET category_name = COALESCE($1,category_name), description = COALESCE($2, description),image = COALESCE($3, image),points_per_kg = COALESCE($4, points_per_kg),price_per_dimensions = COALESCE($5, price_per_dimensions),price_per_kg = COALESCE($6, price_per_kg) WHERE id=$7 AND is_deleted = 0  RETURNING *;`;
  const data = [
    category_name || null,
    description || null,
    image || null,
    points_per_kg || null,
    price_per_dimensions || null,
    price_per_kg || null,
    id,
  ];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Category with id: ${id} updated successfully `,
          result: result.rows[0],
        });
      } else {
        throw new Error("Error happened while updating category");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
module.exports = {
  addCategory,
  getAllCategories,
  deleteCategoryById,
  updateCategoryById,
};
