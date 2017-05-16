/** Main app for server to start a small REST API for tweets
 * The included ./blackbox/store.js gives you access to a "database" which contains
 * already tweets with id 101 and 102, as well as users with id 103 and 104.
 * On each restart the db will be reset (it is only in memory).
 * Best start with GET http://localhost:3000/tweets to see the JSON for it
 *
 * TODO: Start the server and play a little with Postman
 * TODO: First read and understand the code
 * TODO: Look at the Routes-section (starting line 68) and start there to add your code
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 */
"use strict";  // tell node.js to be more "strict" in JavaScript parsing (e.g. not allow variables without var before)

// node module imports
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

// our own modules imports
var store = require('./blackbox/store.js');

// creating the server application
var app = express();

// Middleware ************************************
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logging
app.use(function (req, res, next) {
    console.log('Request of type ' + req.method + ' to URL ' + req.originalUrl);
    next();
});

// API-Version control. We use HTTP Header field Accept-Version instead of URL-part /v1/
app.use(function (req, res, next) {
    // expect the Accept-Version header to be NOT set or being 1.0
    var versionWanted = req.get('Accept-Version');
    if (versionWanted !== undefined && versionWanted !== '1.0') {
        // 406 Accept-* header cannot be fulfilled.
        res.status(406).send('Accept-Version cannot be fulfilled').end();
    } else {
        next(); // all OK, call next handler
    }
});

// request type application/json check
app.use(function (req, res, next) {
    if (['POST', 'PUT'].indexOf(req.method) > -1 &&
        !( /application\/json/.test(req.get('Content-Type')) )) {
        // send error code 415: unsupported media type
        res.status(415).send('wrong Content-Type');  // user has SEND the wrong type
    } else if (!req.accepts('json')) {
        // send 406 that response will be application/json and request does not support it by now as answer
        // user has REQUESTED the wrong type
        res.status(406).send('response of application/json only supported, please accept this');
    }
    else {
        next(); // let this request pass through as it is OK
    }
});


// Routes ***************************************

app.get('/tweets', function (req, res, next) {
    res.json(store.select('tweets'));
});

app.post('/tweets', function (req, res, next) {
    var id = store.insert('tweets', req.body);
    // set code 201 "created" and send the item back
    res.status(201).json(store.select('tweets', id));
});


app.get('/tweets/:id', function (req, res, next) {
    res.json(store.select('tweets', req.params.id));
});

app.delete('/tweets/:id', function (req, res, next) {
    store.remove('tweets', req.params.id);
    res.status(200).end();
});

app.put('/tweets/:id', function (req, res, next) {
    store.replace('tweets', req.params.id, req.body);
    res.status(200).end();
});


// TODO: add your routes, error handling etc.
app.get('/users?', function (req, res, next) {
    var data = store.select('users');
    for (var i = 0; i < data.length; i++) {
        var el = data[i];
        el.href = req.protocol + "://" + req.get('Host') + '/users/' + el.id;
        el.tweets = req.protocol + "://" + req.get('Host') + '/users?expand=tweets';
        if (req.query.expand === "tweets") {
            var tweets = store.select("tweets");
            tweets = tweets.filter(function (element) {
                return element.creator.href === el.href;
            });
            el.tweets = {};
            el.tweets.items = tweets;


            el.href = req.get('Host') + req.originalUrl + "/" + el.id;
            el.tweets.href = req.protocol + "://" + req.get('Host') + '/users/' + el.id + "?expand=tweets";
        }
    }

    res.json(data);

});

app.get('/users/:id?', function (req, res, next) {
    var element = store.select('users', req.params.id);
    element.href = req.protocol + "://" + req.get('Host') + '/users/' + req.params.id;
    element.tweets = req.protocol + "://" + req.get('Host') + '/users/' + req.params.id + "?expand=tweets"
    if (req.query.expand === "tweets") {
        var tweets = store.select("tweets");
        tweets = tweets.filter(function (el) {
            return el.creator.href === element.href;
        });
        element.tweets = {};
        element.tweets.href =req.protocol + "://" + req.get('Host') + req.originalUrl;
        element.tweets.items = tweets;
    }
    res.json(element);
});

app.post('/users', function (req, res, next) {
    var id = store.insert('users', req.body);
    res.status(201).json(store.select('users', id));
});

app.delete('/users/:id', function (req, res, next) {
    store.remove('users', req.params.id);
    res.status(200).end();
});

app.put('/users/:id', function (req, res, next) {
    store.replace('users', req.params.id, req.body);
    res.status(200).end();
});

app.patch('/users/:id', function (req, res, next) {
    var data = req.body;
    var status = 400;
    var user = store.select('users', req.params.id);
    if (data.firstname !== undefined) {
        user.firstname = data.firstname;
        status = 200;
    }
    if (data.lastname !== undefined) {
        user.lastname = data.lastname;
        status = 200;
    }
    store.replace('users', req.params.id, user);
    res.status(status).end();
});


// CatchAll for the other requests (unfound routes/resources) ********

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers (express recognizes it by 4 parameters!)

// development error handler
// will print stacktrace as JSON response
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log('Internal Error: ', err.stack);
        res.status(err.status || 500);
        res.json({
            error: {
                message: err.message,
                error: err.stack
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            error: {}
        }
    });
});


// Start server ****************************
app.listen(3000, function (err) {
    if (err !== undefined) {
        console.log('Error on startup, ', err);
    }
    else {
        console.log('Listening on port 3000');
    }
});