const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const moment = require('moment');

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    // Lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    // Hết lọc theo trạng thái

    // Tìm kiếm
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // Hết tìm kiếm

    // Phân trang
    let limitItems = 4;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItems = parseInt(req.query.limit);
    }
    const skip = (page - 1) * limitItems;

    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / limitItems);
    // Hết phân trang

    // Sắp xếp
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }
    else {
        sort["position"] = "desc";
    }
    // Hết sắp xếp

    const products = await Product
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort(sort);

    
    // Tạo bởi   
    for(const item of products){
        const infoCreatedBy = await Account.findOne({
            _id: item.createdBy
        });

        if(infoCreatedBy){
            item.createdByFullName = infoCreatedBy.fullName
        }
        else{
            item.createdByFullName = ""
        }

        if(item.createdAt){
            item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD//MM//YY");
        }
    }

    // Cập nhật bởi
    for(const item of products){
        const infoUpdatedBy = await Account.findOne({
            _id: item.updatedBy
        });

        if(infoUpdatedBy){
            item.updatedByFullName = infoUpdatedBy.fullName
        }
        else{
            item.updatedByFullName = ""
        }

        if(item.updatedAt){
            item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD//MM//YY");
        }
    }

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        totalPage: totalPage,
        currentPage: page,
        limitItems: limitItems
    });
}

module.exports.create = async (req, res) => {
    const listCategory = await ProductCategory.find({
        deleted: false
    })
    res.render('admin/pages/products/create.pug', {
        pageTitle: "Trang thêm mới sản phẩm",
        listCategory: listCategory
    });
}

module.exports.edit = async (req, res) => {
    const listCategory = await ProductCategory.find({
        deleted: false
    });

    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    })

    res.render('admin/pages/products/edit', {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: product,
        listCategory: listCategory
    });
}

module.exports.detail = async (req, res) => {
    if (res.locals.role.permissions.includes("products_edit")) {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        })

        res.render('admin/pages/products/detail', {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    }
}

module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("products_edit")) {
        const id = req.params.id;

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.updatedBy = res.locals.user.id;
        req.body.updatedAt = new Date();
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }

        await Product.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật thành công!");
        res.redirect("back");
    }
}


module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("products_create")) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.createdBy = res.locals.user.id;
        req.body.createdAt = new Date();
        
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }
        else {
            const countRecord = await Product.countDocuments();
            req.body.position = countRecord + 1;
        }

        const record = new Product(req.body);
        await record.save();
    }

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

module.exports.trash = async (req, res) => {
    const find = {
        deleted: true
    };

    // Lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status;
    }
    // Hết lọc theo trạng thái

    // Tìm kiếm
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // Hết tìm kiếm

    // Phân trang
    let limitItems = 4;
    let page = 1;

    if (req.query.page) {
        page = parseInt(req.query.page);
    }
    if (req.query.limit) {
        limitItems = parseInt(req.query.limit);
    }
    const skip = (page - 1) * limitItems;

    const totalProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(totalProduct / limitItems);
    // Hết phân trang

    const products = await Product.find(find).limit(limitItems).skip(skip);

    // Xóa bởi
    for(const item of products){
        const infoDeleted = await Account.findOne({
            _id: item.deletedBy
        });

        if(infoDeleted){
            item.deletedByFullName = infoDeleted.fullName
        }
        else{
            item.deletedByFullName = ""
        }

        if(item.deletedAt){
            item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD//MM//YY");
        }
    }

    res.render('admin/pages/products/trash', {
        pageTitle: "Thùng rác",
        products: products,
        totalPage: totalPage,
        currentPage: page
    });
}

module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permissions.includes("products_edit")) {
        await Product.updateOne({
            _id: req.body.id
        }, {
            status: req.body.status,
            updatedBy: res.locals.user.id,
            updatedAt: new Date()
        })

        req.flash('success', 'Đổi trạng thái thành công!')

        res.json({
            code: "success"
        })
    }
}

module.exports.changeMulti = async (req, res) => {
    if (res.locals.role.permissions.includes("products_edit")) {
        switch (req.body.status) {
            case "active":
            case "inactive":
                await Product.updateMany({
                    _id: req.body.ids
                }, {
                    status: req.body.status,
                    updatedBy: res.locals.user.id,
                    updatedAt: new Date()
                });

                req.flash('success', 'Đổi trạng thái thành công!')

                res.json({
                    code: "success"
                })
                break;
            case "delete":
                await Product.updateMany({
                    _id: req.body.ids,
                    deletedBy: res.locals.user.id,
                    deletedAt: new Date()
                }, {
                    deleted: true
                });

                req.flash('success', 'Xóa thành công!')

                res.json({
                    code: "success"
                })
                break;
            default:
                res.json({
                    code: "error",
                    message: "Trạng thái không hợp lệ!"
                })
                break;
        }
    }
}

module.exports.delete = async (req, res) => {
    if (res.locals.role.permissions.includes("products_delete")) {
        await Product.updateOne({
            _id: req.body.id
        }, {
            deleted: true,
            deletedBy: res.locals.user.id,
            deletedAt: new Date()
        })

        req.flash('success', 'Xóa sản phẩm thành công!')

        res.json({
            code: "success"
        })
    }
}

module.exports.deleteRestore = async (req, res) => {
    if (res.locals.role.permissions.includes("products_delete")) {
        await Product.updateOne({
            _id: req.body.id
        }, {
            deleted: false
        })

        req.flash('success', 'Khôi phục sản phẩm thành công!')

        res.json({
            code: "success"
        })
    }
}

module.exports.deleteDestroy = async (req, res) => {
    if (res.locals.role.permissions.includes("products_delete-destroy")){
        await Product.deleteOne({
            _id: req.body.id
        });
    
        req.flash('success', 'Xóa vĩnh viễn sản phẩm thành công!')
    
        res.json({
            code: "success"
        })
    }
}

module.exports.changePosition = async (req, res) => {
    if (res.locals.role.permissions.includes("products_edit")) {
        await Product.updateOne({
            _id: req.body.id
        }, {
            position: req.body.position,
            updatedBy: res.locals.user.id,
            updatedAt: new Date()
        })

        req.flash('success', 'Đổi vị trí thành công!')

        res.json({
            code: "success"
        })
    }
}
