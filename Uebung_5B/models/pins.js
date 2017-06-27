/** This module defines the routes for pins using the store.js as db memory
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module model/pins
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var mongoose = require('mongoose');

// TODO add here your require for your own model file


var pins = express.Router();
var Schema = mongoose.Schema;
var pin = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video', 'website'],
        required: true
    },
    src: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        min: 0,
        default: 0
    },
    ranking: {
        type: Number,
        min: 0,
        default: 0
    }},  {
    timestamps: {type: Date,
        required: true,
        default: Date.now,
        createdAt: 'timestamp'}
});

module.exports = mongoose.model('Pin', pin);
