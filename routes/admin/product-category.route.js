const express = require("express");
const router = express.Router();  
const multer = require('multer')

const upload = multer();

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const controller = require("../../controllers/admin/product-category.controller.js");

router.get('/', controller.index);
router.get('/create', controller.create);
router.get('/edit/:id', controller.edit);

router.post(
    '/create', 
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    controller.createPost
);

router.patch(
    '/edit/:id', 
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    controller.editPatch
);

router.patch(
    '/change-status', 
    controller.changeStatus
);

module.exports = router;