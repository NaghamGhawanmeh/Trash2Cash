const express = require("express");
const {loginGoogle} = require("../controllers/authController");

const router = express.Router();

router.post("/google",loginGoogle)

module.exports = router;

