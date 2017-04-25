var express = require('express');
var path = require('path');
var app = express();


/**
 * Aufgabe 1
 */
app.get('/', function (req, res) {
    res.send('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="utf-8"></head>' +
        '<body><h1>Hello World!</h1></body>' +
        '</html>'
    );
});

/**
 * Aufgabe 3
 */
app.use('/staticfiles', express.static(path.join(__dirname, '/public')));






app.listen(3000, function () {

});