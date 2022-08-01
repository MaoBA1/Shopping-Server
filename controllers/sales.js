const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/products');
const Sale = require('../models/sales');
const moment = require('moment');



router.post('/buyCart', async(request, response) => {
    let productArray = [];
    const productInCart = await Product.find({isInCart:true});
    let total = 0;
    productInCart.forEach(async product => {
        total += product.price * product.countInCart;
        productArray.push({
            productAssociatedId: product._id,
            productImage: product.productImage,
            productName: product.productName,
            price: product.price,
            countOfUnitSold: product.countInCart
        });
        await Product.update({_id: product._id}, {$set: {countOfSales:product.countOfSales + product.countInCart, isInCart:false, countInCart:0}})
    })
    const sale = new Sale({
        _id: mongoose.Types.ObjectId(),
        products: productArray,
        total:total
    })
    return sale.save()
    .then(new_sale => {
        return response.status(200).json({
            status: true, 
            Sale: new_sale
        })
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
})


router.get('/top5UniqueSoldProducts', async(request, response) => {
    let sales = await Sale.find({});
    let uniqueProducts = [];
    sales.forEach(sale => {
        sale.products.forEach(async product => {
            if(product.countOfUnitSold > 1){
                const indexOfCurrentProduct = uniqueProducts.findIndex(x => {
                    x._id === product._id
                })
                if(indexOfCurrentProduct == -1) {
                    uniqueProducts.push(product)
                } else {
                    uniqueProducts[indexOfCurrentProduct].countOfUnitSold += product.countOfUnitSold
                }
            }
        })
    })
    uniqueProducts.sort((a,b) => (b.countOfUnitSold - a.countOfUnitSold));
    const top5 = uniqueProducts.slice(0,5)
    return response.status(200).json({
        status: true,
        UniqueProducts: top5
    })
})

router.get('/5lastdaysSales', async(request, response) => {
    const sales = await Sale.find()
    const today = moment(Date.now());
    let salesFrom5lastDays = [];
    sales.forEach(x => {
        let saleDate = moment(x.creatAdt); 
        if (Math.abs(saleDate.diff(today,'days')) <= 4) {
            salesFrom5lastDays.push(x);
        }
    })
    
    let totalForEachDay = [];
    let itemId = 1;
    salesFrom5lastDays.forEach(sale => {
        let indexOfCurrentDay = totalForEachDay.findIndex(x => x.date.toDateString() == sale.creatAdt.toDateString());
        
        if(indexOfCurrentDay == -1) {
            totalForEachDay.push({_id:itemId, date:sale.creatAdt, total:sale.total});
            itemId++;
        } else {
            totalForEachDay[indexOfCurrentDay].total += sale.total;
        }
    })

    return response.status(200).json({
        status: true,
        sales: totalForEachDay
    })
})



module.exports = router;