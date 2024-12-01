const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    // Sản phẩm nổi bật
    const productsFeatured = await Product
        .find({
            status: "active",
            deleted: false,
            featured: "1"
        })
        .sort({
            position: "desc"
        })
        .limit(6);
    
        for(const item of productsFeatured){
            item.priceNew = (1 - item.discountPercentage/100) * item.price;
            item.priceNew = item.priceNew.toFixed(0);
        }

    // Sản phẩm mới
    const productsNew = await Product
        .find({
            status: "active",
            deleted: false
        })
        .sort({
            position: "desc"
        })
        .limit(6);
    
        for(const item of productsFeatured){
            item.priceNew = (1 - item.discountPercentage/100) * item.price;
            item.priceNew = item.priceNew.toFixed(0);
        }

    // Sản phẩm giảm giá nhiều
    const productsDiscount = await Product
        .find({
            status: "active",
            deleted: false
        })
        .sort({
            discountPercentage: "desc"
        })
        .limit(6);
    
        for(const item of productsFeatured){
            item.priceNew = (1 - item.discountPercentage/100) * item.price;
            item.priceNew = item.priceNew.toFixed(0);
        }

    // Lấy ra các sản phẩm cụ thể do mình tự chọn (theo id)
    const productsChoose = await Product
        .find({
            _id: { 
                $in: [
                    "66e97977ef57ea23eabbc750",
                    "66dfbfcdc827d9992773a07f"
                ] 
            },
            status: "active",
            deleted: false
        })
        .sort({
            position: "desc"
        })
    
        for(const item of productsFeatured){
            item.priceNew = (1 - item.discountPercentage/100) * item.price;
            item.priceNew = item.priceNew.toFixed(0);
        }

    res.render('client/pages/home/index.pug', {
        pageTitle: "Trang chủ",
        productsFeatured: productsFeatured,
        productsNew: productsNew,
        productsDiscount: productsDiscount,
        productsChoose: productsChoose
    })
}