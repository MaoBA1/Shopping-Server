const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products:[
        {
            productAssociatedId: {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
            productName: String,
            productImage: String,
            price: Number,    
            productImage: String,
            countOfUnitSold:{type:Number, default:0},
        }
    ],
    total:{type:Number, default:0},
    creatAdt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Sale', saleSchema);