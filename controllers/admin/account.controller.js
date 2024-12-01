const Role = require('../../models/role.model');
const Account = require('../../models/account.model');
const md5 = require('md5');
const generate = require('../../helpers/generate.helpers');
const systemConfig = require('../../config/system');


module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false
    });

    for(const account of records){
        const role = await Role.findOne({
            deleted: false,
            _id: account.role_id
        });
        account.role_title = role.title;
    }
    res.render('admin/pages/accounts/index.pug', {
        pageTitle: "Tài khoản quản trị",
        records: records
    })
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render('admin/pages/accounts/create.pug', {
        pageTitle: "Tạo tài khoản quản trị",
        roles: roles
    })
}

module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    req.body.token = generate.generateRandomString(30);

    const account = new Account(req.body);
    await account.save();

    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.edit = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    const account = await Account.findOne({
        _id: req.params.id,
        deleted: false
    })

    res.render('admin/pages/accounts/edit.pug', {
        pageTitle: "Chỉnh sửa tài khoản quản trị",
        roles: roles,
        account: account
    })
}

module.exports.editPatch = async (req, res) => {
    await Account.updateOne({
        _id: req.params.id,
        deleted: false
    }, req.body);

    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
}

module.exports.changePassword = async (req, res) => {
    const account = await Account.findOne({
        _id: req.params.id,
        deleted: false
    })

    res.render('admin/pages/accounts/change-password.pug', {
        pageTitle: "Đổi mật khẩu",
        account: account
    })
}

module.exports.changePasswordPatch = async (req, res) => {
    await Account.updateOne({
        _id: req.params.id,
        deleted: false
    }, {
        password: md5(req.body.password)
    })

    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.myProfile = (req, res) => {
    res.render('admin/pages/accounts/my-profile.pug', {
        pageTitle: "Thông tin cá nhân"
    })
}

module.exports.myProfileEdit = async (req, res) => {
    res.render('admin/pages/accounts/my-profile-edit.pug', {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    })
}

module.exports.myProfileEditPatch = async (req, res) => {
    await Account.updateOne({
        _id: res.locals.user.id
    }, req.body);

    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
}

