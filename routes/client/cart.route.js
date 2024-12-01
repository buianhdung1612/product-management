const express = require("express");
const router = express.Router();  // Định nghĩa các đường dẫn con (thay app = router)

const controller = require("../../controllers/client/cart.controller");

router.get('/', controller.index);

router.get('/delete/:id', controller.delete);

router.post('/add/:id', controller.addPost);

router.patch('/update', controller.updatePatch);

module.exports = router;    