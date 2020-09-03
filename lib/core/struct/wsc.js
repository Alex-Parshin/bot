'use strict'
const clc = require('cli-color');
const _ = require('underscore');

const News = require('../news');
const Messages = require('../../core/utils/messages');
const Utils = require('../../core/utils/utils');

class WSC {

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
        const messages = await new Messages();
        const news = await new News(this.page, this.pages, this.query, this.configuration, this.engine, this.id_request);

        var News_array = [];
        var fullText = "";

        if (await news.getMainPage() == true) {
            await utils.autoscroll(this.page);
            for (let i = 0; i < this.pages; i++) {
                await utils.autoscroll(this.page);
                const loadMore = await this.page.$(this.configuration.selectors.loadMore);
                if (loadMore != null) {
                    await this.page.click(this.configuration.selectors.loadMore);
                }
            }
            News_array = await news.getNews(this.configuration.selectors.news);
            if (pageFunc != undefined) News_array = await pageFunc(News_array);
        }
        return _.flatten(News_array);
    }
}

module.exports = WSC;
