const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
var app = express();
var port = process.env.PORT || 3000; 

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log('running on port', port);
});