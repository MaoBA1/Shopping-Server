const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');


app.listen(3000, () => {
    console.log('Server is listening on port 3000');
})