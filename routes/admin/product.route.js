const express = require("express");
const router = express.Router();
const multer = require('multer')

const upload = multer()

const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get('/', controller.index);

router.get('/trash', controller.trash);

router.get('/create', controller.create);

router.get('/edit/:id', controller.edit);

router.get('/detail/:id', controller.detail);

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.editPatch
)

router.patch('/change-status', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.patch('/delete', controller.delete);

router.patch('/delete-restore', controller.deleteRestore);

router.patch('/change-position', controller.changePosition);

router.delete('/delete-destroy', controller.deleteDestroy);


module.exports = router;