const express = require("express");
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage })

const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");

router.get('/', controller.index);

router.get('/trash', controller.trash);

router.get('/create', controller.create);

router.get('/edit/:id', controller.edit);

router.get('/detail/:id', controller.detail);

router.post(
    '/create', 
    upload.single('thumbnail'), 
    validate.createPost,
    controller.createPost
);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'), 
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