/** Main app for the server
*
* @author The Cake Is a Lie
* @license MIT
*/


"use strict";
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
 *reads asynchronous from textfile.txt and returns it as text/plain by adding duration of this process in nanoseconds
 *@returns error, if such occurs, as log in the console.
 */
app.get('/text.txt', function (req, res) {
    var startTimestamp = process.hrtime();
    res.setHeader('content-type', 'text/plain');

    fs.readFile(path.join(__dirname, '/textfile.txt'), 'utf8', function (err, data) {
        if (err) {
            // Fehlercode zurückgeben
            return console.log(err);
        }
        var endtime = process.hrtime();
        var total = [endtime[0] - startTimestamp[0], endtime[1] - startTimestamp[1]];

        var time = total[0] + 's : ' + total[1] + 'ns';
        res.send(data + time);
    });
});

/**
 * Task 5b
 * memoizing the readfile function in the cache, so it would be much faster as regular.
 * Limitations: consuming additional memory and output must depending only on their inputs.
 * @param func
 * @returns {Function}
 */
app.get('/text2.txt', function (req, res) {
    var startTimestamp = process.hrtime();
    res.setHeader('content-type', 'text/plain');

    reader(path.join(__dirname, '/textfile.txt'), function (data) {
        var endtime = process.hrtime();
        var total = [endtime[0] - startTimestamp[0], endtime[1] - startTimestamp[1]];

        var time = total[0] + 's : ' + total[1] + 'ns';
        console.log(data);
        res.send(data + time);

    });
});

/**
 *
 * @param func function to store in memory
 * @returns {Function}
 */
function memoize(func) {
//stores the data into the cache
    var cache = {};

// please read the data from the cache if it was already stored there,
// if it's not this case - read the file and store it in the cache
    return function (path, callback) {
        if (cache[path] === undefined) {
            func(path, function (data) {
                if (data) {
                    cache[path] = data;
                }
                callback(cache[path]);
            });
        }
        else {
            callback(cache[path]);

        }
    };
}

//writes the result of memoized function into the variable reader
    var reader = memoize(function (path, callback) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            callback(data);
        });
    });


    /**
     * Task 1
     * returns "Hello World!" as html by requesting all paths on the server
     * excluding previously stated. It has to be written on the end of the file,
     * so it would not overwrite previously methods
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
