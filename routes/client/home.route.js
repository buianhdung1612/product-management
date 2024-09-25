const express = require("express");
const router = express.Router();  // Định nghĩa các đường dẫn con (thay app = router)

const controller = require("../../controllers/client/home.controller");

router.get('/', controller.index);

module.exports = router;