const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/products');




router.get('/getAllProducts', async(request, response) => {
    await Product.find({})
    .then((products) => {
        return response.status(200).json({
            status: true,
            Products: products
        })
    })
    .catch((error) => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
})

router.post('/addNewProduct', async(request, response) => {
    const {productName, price, description, productImage} = request.body;
    console.log(request.body);
    await Product.findOne({productName:productName})
    .then((product) => {
        if(product) {
            return response.status(200).json({
                status: false,
                message: 'There is already a product with this name \n you can eddit it if you want'
            })
        } else {
            const prod = new Product({
                _id: mongoose.Types.ObjectId(),
                productName: productName,
                price: price,
                description: description,
                productImage: productImage
            })
            return prod.save()
            .then(newProd => {
                return response.status(200).json({
                    status: true, 
                    product: newProd
                })
            })
            .catch(error => {
                return response.status(500).json({
                    status: false,
                    Error: 'Something went wrong...'
                })
            })
        }
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
    
})

router.put('/edditProduct/:productId', async(request, response) => {
    const productId = request.params.productId;
    await Product.findById({_id: productId})
    .then(product => {
        if(!product) {
            return response.status(403).json({
                status: false,
                message: 'Product not found...'
            })
        } else {
            const {productName, price, description, productImage} = request.body;
            product.productName = productName;
            product.price = price;
            product.description = description;
            product.productImage = productImage;
            return product.save()
            .then(updated_product => {
                return response.status(200).json({
                    status: true,
                    Product: updated_product
                })
            })
            .catch(error => {
                return response.status(500).json({
                    status: false,
                    Error: 'Something went wrong...'
                })
            })
        }
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
})

router.delete('/deleteProduct/:productId', async(request, response) => {
    const productId = request.params.productId;
    await Product.findByIdAndDelete({_id: productId})
    .then(result => {
        return response.status(200).json({
            status: true,
            message: result
        })
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
})


router.put('/addProductToCart/:productId', async(request, response) => {
    const productId = request.params.productId;
    await Product.findById({_id: productId})
    .then(product => {
        if(!product) {
            return response.status(403).json({
                status:false,
                message:'Product not found...'
            })
        } else {
            product.isInCart = true;
            product.countInCart = product.countInCart + 1;
            return product.save()
            .then(product_updated => {
                return response.status(200).json({
                    status: true,
                    Product: product_updated
                })
            })
            .catch(error => {
                return response.status(500).json({
                    status: false,
                    Error: error.message
                })
            })
        }
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
})

router.get('/getAllCartProducts', async(request, response) => {
    await Product.find({isInCart:true})
    .then(result => {
        return response.status(200).json({
            status: true,
            CartProducts: result
        })
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
})

router.put('/deleteItemFromCart/:productId', async(request,response) => {
    const productId = request.params.productId;
    await Product.findById({_id: productId})
    .then(product => {
        if(!product) {
            return response.status(403).json({
                status: false,
                message: 'Product not found...'
            })
        } else {
            if(product.countInCart > 0) {
                product.countInCart = product.countInCart - 1;
            } 
            if(product.countInCart == 0) {
                product.isInCart = false;
            }
            return product.save()
            .then(product_updated => {
                return response.status(200).json({
                    status: true,
                    Product: product_updated
                })
            })
            .catch(error => {
                return response.status(500).json({
                    status: false,
                    Error: error.message
                })
            })
        }
    })
    .catch(error => {
        return response.status(500).json({
            status: false,
            Error: error.message
        })
    })
    
})


router.get('/getTotalPrice', async(request, response) => {
    let total = 0;
    const productInCartList = await Product.find({isInCart:true});
    productInCartList.forEach(product => {
        total += product.price * product.countInCart;
    })
    return response.status(200).json({
        status: true,
        total:total
    })
})

router.get('/top5products', async(request, response) => {
    let products = await Product.find({});
    products = products.filter(product => product.countOfSales > 0)
    const sortedProductListByCountOfSales = products.sort((a,b) => (b.countOfSales - a.countOfSales));
    const top5 = sortedProductListByCountOfSales.slice(0,5);
    return response.status(200).json({
        status: true,
        top5:top5
    })
    
})


router.get('/test', async(request, response) => {
    return response.status(200).json({
        message: 'Hello world'
    })
})


module.exports = router;