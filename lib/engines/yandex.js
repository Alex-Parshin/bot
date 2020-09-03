'use strict'

const WSCN = require('../core/struct/wscn');
const Messages = require('./../core/utils/messages');

class Yandex extends WSCN {

    constructor(page, pages, query, configuration, id_request) {

        super(page, pages, query, '4', configuration.engines.yandex, id_request);
        this.selectors = [this.configuration.selectors.nextPage_1_Selector, this.configuration.selectors.nextPage_2_Selector]

    }

    async index() {

        const messages = new Messages();
        const relNewsFunc = async (page, configuration) => {

            var news_set = [];
            var item_hrefs = await page.$$(configuration.selectors.relatedNews);
            await messages.countRelated(item_hrefs.length);

            for (let i = 0; i < item_hrefs.length; i++) {
                var item_hrefs_href = await page.evaluate(el => el.getAttribute('href'), item_hrefs[i]);
                await news_set.push(item_hrefs_href);
            }

            return news_set;

        }

        return await super.index(relNewsFunc);
    }

    async nextPage(next_page_title) {

        const pageFunc = async (next_page, next_page_title, next_page_href, page) => {

            if (next_page_title != process.env.NEXT_PAGE) {

                const next_page = await page.$(npSelectorTwo);
                const next_page_title = await page.evaluate(el => el.textContent, next_page);
                
                if (next_page_title == process.env.NEXT_PAGE) {
                    const next_page_href = await page.evaluate(el => el.getAttribute('href'), next_page);
                } else {
                    console.log('Ошибка перехода по странице. Не найден селектор');
                    return;
                }

            }

            return next_page_href;
        }

        await super.nextPage(this.selectors, pageFunc);
        
    }
}

module.exports = Yandex;
