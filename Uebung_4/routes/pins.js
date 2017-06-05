/** This module defines the routes for pins using the store.js as db memory
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module routes/pins
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('we2:pins');
var store = require('../blackbox/store');
var codes = require('../restapi/http-codes'); // if you like, you can use this for status codes, e.g. res.status(codes.success);
var HttpError = require('../restapi/http-error.js');

var pins = express.Router();

const storeKey = 'pins';


// TODO if you like, you can use these objects for easy checking of required/optional and internalKeys....or remove it.
var requiredKeys = {title: 'string', type: ['image', 'video', 'website'], src: 'string'};
var optionalKeys = {description: 'string', views: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};


/* GET all pins */
pins.route('/')
    .get(function (req, res, next) {
        var items = store.select('pins');
        if (items === undefined) {
            var err = new HttpError('Not elements in store', 204);
            next(err);
            return;
        }

        if (req.query.filter !== undefined) {
            var filters = req.query.filter.split(",");
            var resultItems = {};
            try {
                items.forEach(function (e) {
                    resultItems.push(filterPin(filters, e));
                });
                res.locals.items = resultItems;
            } catch (error) {
                var err = new HttpError('No Element found', 400);
                next(err);
                return
            }
        }
        else {
            res.locals.items = items;
        }

        if (req.query.offset !== undefined) {
            var offset = parseInt(req.query.offset);
            if (offset >= 0 && offset < res.locals.items.length) {
                res.locals.items = res.locals.items.slice(offset, items.length);
            } else {
                var err = new HttpError('Offset < 0', 400);
                next(err);
                return
            }
        }

        if (req.query.limit !== undefined) {
            var limit = parseInt(req.query.limit);
            if (limit > 0) {
                res.locals.items = res.locals.items.slice(0, limit);
            } else {
                var err = new HttpError('Offset < 0', 400);
                next(err);
                return
            }
        }


        res.locals.processed = true;
        logger("GET fetched store items");
        next();
    })


    .post(function (req, res, next) {
        // TODO implement
        var pin = req.body;
        if (!checkRequiredParams(pin)) {
            var err = new HttpError('Missing required parameters', 400);
            next(err);
        }
        else {
            if (!checkTypeParam(pin)) {
                var err = new HttpError('Missing required parameters', 400);
                next(err);
                return;
            }


            checkDescription(pin);
            if (!checkRanking(pin)) {
                var err = new HttpError('Element not found', 400);
                next(err);
                return
            }
            if (!checkViews(pin)) {
                var err = new HttpError('Element not found', 400);
                next(err);
                return

            }
            insertTimeStamp(pin);
            var id = store.insert('pins', pin);
            pin.id = id;
            res.locals.items = pin;
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


function filterPin(filterArray, pin) {
    var newPin = {};
    filterArray.forEach(function (e) {
        var contains = false;
        for (var prop in pin) {
            if (prop === e) {
                contains = true;
                newPin[e] = pin[e];
                break;
            }
        }
        if (contains === false) {
            throw new Error('Pins has no such property: ' + e);
        }
    });

    return newPin;

}

// TODO implement
pins.route('/:id')
    .get(function (req, res, next) {
        var items = store.select('pins', req.params.id);
        if (items === undefined) {
            var err = new HttpError('No Element found', 404);
            next(err);
            return
        }
        if (req.query.filter !== undefined) {
            var filters = req.query.filter.split(",");
            try {
                var resultPin = filterPin(filters, items);
                res.locals.items = resultPin;
            } catch (error) {
                var err = new HttpError('No Element found', 400);
                next(err);
                return
            }
        }
        else {
            res.locals.items = items;
        }
        res.locals.processed = true;
        next();
    })

    .delete(function (req, res, next) {
        try {

            function removePinComments(pinID) {
                var comments = store.select('comments');

                function filterByPinID(object) {
                    if (object.pinid === pin.id) {
                        return true;
                    }
                    return false;
                }

                var pinComments = comments.filter(filterByPinID);
                pinComments.forEach(function (e) {
                    store.remove('comments', e.id);
                });
            }

            var pin = store.remove('pins', req.params.id);
            removePinComments(pin.id);
            res.locals.processed = true;
            res.status(204);
            next();
        } catch (e) {
            var err = new HttpError('Element not found', 404);
            next(err);
        }

    })

    .put(function (req, res, next) {
        var pin = req.body;
        if (!checkRequiredParams(pin)) {
            var err = new HttpError('Missing required parameters', 400);
            next(err);
            return;
        }
        else {
            if (!checkTypeParam(pin)) {
                var err = new HttpError('Missing required parameters', 400);
                next(err);
                return;
            }
            checkDescription(pin);

            if (!checkRanking(pin)) {
                var err = new HttpError('Element not found', 400);
                next(err);
                return;
            }
            if (!checkViews(pin)) {
                var err = new HttpError('Element not found', 400);
                next(err);
                return;
            }
            insertTimeStamp(pin);
            try {
                var id = store.replace('pins', req.params.id, pin);
                pin.id = parseInt(req.params.id);
                res.locals.items = pin;
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


function checkRequiredParams(pin) {
    var complete = true;
    var contains = false;
    for (var property in pin) {
        for (var requi in requiredKeys) {
            if (requi === property) {
                if (typeof pin[property] === 'string') {
                    contains = true;
                }
            }
        }
        if (contains === false) {
            complete = false;
            break;
        }

    }
    return complete;
}

function insertTimeStamp(pin) {
    pin.timestamp = Date.now();
}

function checkDescription(pin) {
    if (pin.description === undefined) {
        pin.description = '';
    }
    return true;
}

function checkTypeParam(pin) {
    var type = pin.type;
    var result = false;
    switch (type) {
        case 'image':
            result = true;
            break;
        case 'video':
            result = true;
            break;

        case 'website':
            result = true;
            break;
    }
    return result;
}

function checkViews(pin) {
    if (pin.views === undefined) {
        pin.views = 0;
        return true;
    }
    else {
        if (pin.views < 0) {
            return false;
        }
    }
    return true;
}

function checkRanking(pin) {
    if (pin.ranking === undefined) {
        pin.ranking = 0;
        return true;
    }
    else {
        if (pin.ranking < 0) {
            return false;
        }
    }
    return true;
}


/**
 * This middleware would finally send any data that is in res.locals to the client (as JSON) or, if nothing left, will send a 204.
 */
pins.use(function (req, res, next) {
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

module.exports = pins;
