const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: String,
    price: Number,
    description: String,
    productImage: String,
    isInCart:{type:Boolean, default:false},
    countInCart:{type:Number, default:0},
    countOfSales:{type:Number, default:0},
    creatAdt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Product', productSchema);