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
var codes = require('../restapi/http-codes');
var HttpError = require('../restapi/http-error.js');
var mongoose = require('mongoose');
var pinModel = require('../models/pins');

// TODO add here your require for your own model file


var pins = express.Router();

var storeKey = 'pins';


mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('openUri', function () {
    logger("DB connection established");
});

// Helper functions *************************
/**
 * Takes an Array of filter-strings for the db to build
 * @param filterArray array of strings
 */
function createFilterObject(filterArray) {
    var filterobject = {};
    for(var i = 0; i < filterArray.length; i++)
    {
        filterobject[filterArray[i]] = 1;
    }
    return filterobject;
}
// routes **************
pins.route('/')
    .get(function (req, res, next) {
        if (req.query.filter !== undefined) {
            var filterobject = createFilterObject(req.query.filter.split(","));
        }
        else {
            filterobject = {};
        }

        var query = pinModel.find({},filterobject);

        if(req.query.limit !== undefined) {
            var limit = parseInt(req.query.limit);
            query.limit(limit);
        }
        if(req.query.offset !== undefined) {
            var off = parseInt(req.query.offset);
            query.skip(off);
        }
        query.exec(function (err, items) {
            res.locals.items = items;
            res.locals.processed = true;
            next();
        });

    })
    .post(function (req, res, next) {

        var pin = new pinModel(req.body);

        pin.save(function (err) {
            if (err) {
                return next(err);
            }
            res.locals.processed = true;
            res.set('Status-Code', codes.created);
            next();
        });

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

pins.route('/:id')
    .get(function (req, res, next) {
        // TODO replace store and use mongoose/MongoDB
        // res.locals.items = store.select(storeKey, req.params.id);
        if (req.query.filter !== undefined) {
            var filterobject = createFilterObject(req.query.filter.split(","));
        }
        else {
            filterobject = {};
        }
        pinModel.find({_id: req.params.id},filterobject, function (err, items) {
            if (err) {
                next(err);
            } else {
                res.locals.items = items;
                res.locals.processed = true;
                next();
            }
        });
    })
    .put(function (req, res, next) {
        pinModel.find({_id: req.params.id}, function (err, items) {
            if (err) {
                next(err);
            } else {
                if (items.length === 1) {
                    if (!(items[0].updatedAt === req.body.updatedAt && !items[0].__V == req.body.__v )) {
                        var err = new HttpError('Conflict' + req.originalUrl, codes.conflict);
                        next(err);
                    }
                    pinModel.findByIdAndRemove(req.params.id, function (err, item) {
                        if (err || !item) {
                            err = err || new Error("item not found");
                            res.set('Status-Code', 404);
                            next(err);
                        } else {
                            delete(req.body.updatedAt);
                            delete(req.body.timestamp);
                            var pin = new pinModel(req.body);
                            pin.save(function (err) {
                                if (err) {
                                    return next(err);
                                }
                                res.locals.processed = true;
                                res.set('Status-Code', codes.created);
                                next();
                            });
                        }
                    });
                }
            }
        });
    })
    .delete(function (req, res, next) {
        pinModel.findByIdAndRemove(req.params.id, function (err, item) {
            if (err || !item) {
                err = err || new Error("item not found");
                res.set('Status-Code', 404);
                next(err);
            } else {
                res.set('Status-Code', 200);
                res.locals.processed = true;
                next();
            }
        });

    })
    .patch(function (req, res, next) {
        var update = {
            title: req.body.title,
            type: req.body.type,
            src: req.body.src,
            description: req.body.description,
            views: req.body.views,
            ranking: req.body.ranking
        };
        // delete undefined values from update array
        function removeUndefined(obj) {
            for (var prop in obj) {
                if (obj[prop] === undefined) {
                    delete obj[prop];
                }
            }
        }

        var opts = {runValidators: true};
        removeUndefined(update);

        pinModel.findByIdAndUpdate(req.params.id, {$set: update}, opts, function (error) {
            if (error) {
                next(error);
            } else {
                res.locals.processed = true;
                res.set('Status-Code', codes.success);
                next();
            }
        })
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
 * This middleware would finally send any data that is in res.locals to the client (as JSON)
 * or, if nothing left, will send a 204.
 */
pins.use(function (req, res, next) {
    if (res.locals.items && res.locals.items.length > 0) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json'); // not really necessary if "no content"
        if (res.get('Status-Code') == undefined) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = pins;
