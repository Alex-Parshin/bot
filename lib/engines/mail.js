'use strict'
const _ = require('underscore');

const WSC = require('../core/struct/wsc');

class Mail extends WSC {

    constructor(page, pages, query, configuration) {
        super(page, pages, query, 'mail', configuration.engines.mail);
    }

    async index() {
        var pageFunc = async (News_array) => {
            for (let i = 0; i < News_array.length; i++) {
                if (News_array[i].href[0] == '/') {
                    News_array[i].href = 'https://news.mail.ru' + News_array[i].href;
                }
            }
            return _.flatten(News_array);
        }
        return await super.index(pageFunc);
    }
}

module.exports = Mail;