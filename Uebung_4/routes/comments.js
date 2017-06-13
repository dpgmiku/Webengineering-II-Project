/** This module defines the routes for comments using the store.js as db memory
 *
 * @author Johannes Konert, Réné, Michael, Paul
 * @licence CC BY-SA 4.0
 *
 * @module routes/comments
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('we2:comments');
var store = require('../blackbox/store');
var codes = require('../restapi/http-codes'); // if you like, you can use this for status codes, e.g. res.status(codes.success);
var HttpError = require('../restapi/http-error.js');
var pins = require('../routes/pins');

var comments = express.Router();

const storeKey = 'comments';
// TODO if you like, you can use these objects for easy checking of required/optional and internalKeys....or remove it.
var requiredKeys = {title: 'string', type: ['image', 'video', 'website'], src: 'string'};
var optionalKeys = {description: 'string', views: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};


/* GET all pins */
comments.route('/')
    .get(function (req, res, next) {
        var items = store.select('comments');
        if (items === undefined) {
            var err = new HttpError('No elements in store', 204);
            next(err);
            return;
        }
        res.locals.items = items;
        res.locals.processed = true;
        logger("GET fetched store items");
        next();
    })

    .post(function (req, res, next) {
        var comment = req.body;
        if (!checkRequiredAttributes(comment)) {
            var err = new HttpError('Missing required parameters', 400);
            next(err);
        } else {
            var id = store.insert('comments', comment);
            comment.id = id;
            res.locals.items = comment;
            res.locals.processed = true;
            res.status(201);
            next();
        }
    })


    .all(function (req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });


/**
 * Checks the required attributes of a comment, adds id + timestamp and sets the likes and dislikes to 0 if not existing
 * @param comment Comment the params should be checked
 * @returns {boolean} returns true if everything is ok and false if not
 */
function checkRequiredAttributes(comment) {
    var valid = true;
    valid = checkPinID(comment);
    valid = checkText(comment);
    valid = checkLikes(comment);
    valid = checkDislikes(comment);
    if (valid) {
        comment.timeStamp = Date.now();
    }
    return valid;

}


/**
 * Checks if Pin-ID is existing and if the pinid is an integer
 * @param comment comment to be checked
 * @returns {boolean} returns true if everything is correct and the pinid could be found
 */
function checkPinID(comment) {
    if ((Number.isInteger(comment.pinid))) {
        var item = store.select('pins', comment.pinid);
        if (item !== undefined) {
            return true;
        }
    }

    return false;

}

/**
 * Checks if the text is a string
 * @param comment
 * @returns {boolean} returns true if text is a string
 */
function checkText(comment) {
    return (typeof comment.text === 'string' || comment.text instanceof String)
}


/**
 * Checks if likes are not negative and a number
 * @param comment
 * @returns {boolean} true if everything is ok
 */
function checkLikes(comment) {
    if (comment.likes !== undefined) {
        if (Number.isInteger(comment.likes)) {
            return comment.likes >= 0;
        }
    } else {
        comment.likes = 0;
        return true;
    }
}

/**
 * Checks if dislikes are existing and an integer
 * @param comment
 * @returns {boolean} true if everything is ok
 */
function checkDislikes(comment) {
    if (comment.dislikes !== undefined) {
        if (Number.isInteger(comment.dislikes)) {
            return comment.dislikes >= 0;
        }
    } else {
        comment.dislikes = 0;
        return true;
    }
}



comments.route('/:id')
    .get(function (req, res, next) {
        var items = store.select('comments', req.params.id);
        if (items === undefined) {
            var err = new HttpError('No Element found', 404);
            next(err);
            return
        }
        res.locals.items = items;
        res.locals.processed = true;
        next();
    })

    .delete(function (req, res, next) {
        try {
            var comment = store.remove('comments', req.params.id);
            res.locals.processed = true;
            res.status(204);
            next();
        } catch (e) {
            var err = new HttpError('Element not found', 404);
            next(err);
        }

    })

    .put(function (req, res, next) {
        var comment = req.body;
        if (!checkRequiredAttributes(comment)) {
            var err = new HttpError('Missing required parameters', 400);
            next(err);
        } else {
            try {
                var id = store.replace('comments', req.params.id, comment);
                comment.id = parseInt(req.params.id);
                res.locals.items = comment;
                res.locals.processed = true;
                res.status(200);
                next();
            } catch (e) {
                var err = new HttpError('Element not found', 404);
                next(err);
            }
        }

    })


    .all(function (req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });


/**
 * This middleware would finally send any data that is in res.locals to the client (as JSON) or, if nothing left, will send a 204.
 */
comments.use(function (req, res, next) {
    if (res.locals.items) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json');
        if (res.get('Status-Code') == undefined) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = comments;
