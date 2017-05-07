var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();


/**
 * Task 3
 *delivers static files from ./public folder by calling URLS with path with prefix /staticfiles/
 *
 */
app.use('/staticfiles', express.static(path.join(__dirname, '/public')));

/**
 * Task 4
 * reads server time by calling a new path /time and returns it to client as text/plain
 */
app.get('/time', function (req, res) {
    res.setHeader('content-type', 'text/plain');
    var date = new Date();
    var dateString = date.toString();
    res.send(dateString);
});


/**
 * Task 5a
 *reads asynchron from textfile.txt and returns it as text/plain by adding duration of this process in nanoseconds 
 *@returns error, if such occurs, as log in the console.
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
 * Task 5b
 *
 * Limitations: consuming additional memory and output must depending only on their inputs. 
 */






/**
 * Task 1
 * returns "Hello World!" as html by requesting all paths on the server excluding previously stated. It has to be written on the end of the file, so it would not overwrite previously methods
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
