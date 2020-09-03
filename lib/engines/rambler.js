'use strict'
const _ = require('underscore');

const WSC = require('../core/struct/wsc');
const News = require('../core/news');

class Rambler extends WSC {

    constructor(page, pages, query, configuration, id_request) {
        super(page, pages, query, '3', configuration.engines.rambler, id_request);
    }
}

module.exports = Rambler;