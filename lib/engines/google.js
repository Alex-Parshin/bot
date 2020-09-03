'use strict'

const _ = require('underscore');

const WSW = require('../core/struct/wsw');

class Google extends WSW {

    constructor(page, pages, query, configuration, id_request) {
        super(page, pages, query, '7', configuration.engines.google, id_request);
    }

    async index() {
        var pageFunc = async (News_array, configuration) => {
            
            const arr = [
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n',
                'o','p','q','r','s','t','u','v','w','x','y','z','0','1',
                '2','3','4','5','6','7','8','9','_','-','.','/'
            ];

            News_array.splice(0, 34);

            for (let i = 0; i < News_array.length; i++) {
                try {
                    
                    News_array[i].href = News_array[i].href.split('/')[2];
                    News_array[i].href = Buffer.from(News_array[i].href, 'base64').toString('utf-8');

                    var url = News_array[i].href.split('//')[1];

                    url = url.replace(/[^0-9A-Za-zА-Яа-яЁё:/\\?#_.-]/g, "").replace(/^0-9A-Za-zА-Яа-яЁё+|https:$/g, "");
                    console.log(url);
                    News_array[i].href = 'http://' + url;
                    
                } catch (e) {
                    delete News_array[i];
                }
            }

            News_array = News_array.filter(function (el) {
                return el != null;
            });

            return _.flatten(News_array);
        }
        return await super.index(pageFunc);
    }
}

module.exports = Google;
