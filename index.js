const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 6080;

app.use(
    cors({
        origin: '*'
    })
)


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const productsRouter = require('./controllers/products');
const salesRouter = require('./controllers/sales');


app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);

const dbUrl = "mongodb+srv://admin:admin@cluster0.snkzmpt.mongodb.net/Shopping?retryWrites=true&w=majority"

mongoose.connect(dbUrl)
.then(result => {
    if(result) {
        console.log(result);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })
    }
})
.catch(error => {
    console.log(error);
})
