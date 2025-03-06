const express = require("express");

const { addCategory ,getAllCategories,deleteCategoryById,updateCategoryById} = require("../controllers/category");
const authentication = require("../middleware/authentication");
const categoryRouter = express.Router();

categoryRouter.post("/addCategory" , addCategory);
categoryRouter.get("/getAllCategories" , getAllCategories);
categoryRouter.delete("/:id" , deleteCategoryById);
categoryRouter.put("/:id" , updateCategoryById);

module.exports = categoryRouter;
