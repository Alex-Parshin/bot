'use strict'
const clc = require('cli-color');
const _ = require('underscore');

const News = require('../news');
const Utils = require('../../core/utils/utils');

class WSW {

    constructor(page, pages, query, engine, configuration, id_request) {
        this.page = page;
        this.pages = pages;
        this.query = query;
        this.engine = engine;
        this.configuration = configuration;
        this.id_request = id_request;
    }

    async index (pageFunc) {
        var now = new Date();

        const utils = new Utils();
        var news = new News(this.page, this.pages, this.query, this.configuration, this.engine, this.id_request);

        var fullText = "";
        var News_array = [];

        if (await news.getMainPage() == true) {
            await utils.autoscroll(this.page);
            News_array = await news.getNews(this.configuration.selectors.news);

            if (pageFunc != undefined) News_array = await pageFunc(News_array, this.configuration);

        }
        return _.flatten(News_array);
    }
}

module.exports = WSW;
