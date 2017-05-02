var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();




/**
 * Aufgabe 3
 */
app.use('/staticfiles', express.static(path.join(__dirname, '/public')));

/**
 * Aufgabe 4
 */
app.get('/time', function (req, res) {
    res.setHeader('content-type', 'text/plain');
    var date = new Date();
    var dateString = date.toString();
    res.send(dateString);
});


/**
 * Aufgabe 5a
 */
app.get('/text.txt', function (req, res) {
	res.setHeader('content-type', 'text/plain');
    var startTimestamp = process.hrtime();

    fs.readFile(path.join(__dirname, '/textfile.txt'), 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var endtime = process.hrtime();
        var total = [endtime[0] - startTimestamp[0], endtime[1] - startTimestamp[1]];

        var time = total[0] + 's : ' + total[1] + 'ns';
        console.log(data);

	res.send(data + time);

    });
})


/**
 * Aufgabe 1
 */
app.use('/', function (req, res) {
    res.send('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="utf-8"></head>' +
        '<body><h1>Hello World!</h1></body>' +
        '</html>'
    );
});


app.listen(3000, function () {

});