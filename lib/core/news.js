'use strict'

const _ = require('underscore');

const Captcha = require('../core/utils/captcha');
const DateFormer = require('../core/utils/date');
const Messages = require('../core/utils/messages');

class News {

    constructor(page, pages, query, configuration, engine, id_request) {

        this.page = page;
        this.pages = pages;
        this.query = query;
        this.configuration = configuration;
        this.id_engine = engine;
        this.id_request = id_request;

    }

    async getMainPage() {

        var now = new Date();
        const messages = new Messages();
        const captcha = new Captcha(this.page);

        try {

            await this.page.goto(this.configuration.urls.startUrl);
            await messages.onPage(this.configuration.urls.startUrl);
            
            await captcha.solve()
            
        }
        catch (e) {

            await messages.showError(now, e);
            return false;

        }

        try {
            const input = await this.page.$(this.configuration.selectors.queryField);
            await input.type(this.query);

            await this.page.keyboard.press('Enter')
            await this.page.waitForNavigation()

            await captcha.solve()

            try {

                await this.page.waitForSelector(this.configuration.selectors.news.title);
                await messages.loadComplete(now);

            } catch (e) {

                await messages.showError(now, e);
                
                await captcha.solve()

                await this.page.waitForNavigation();

            }

        } catch(e) {
            console.log(`ERROR ${e}`)
            return false
        }

        return true;
    }

    async getNews(selectors) {

        const dateFormer = new DateFormer();
        
        var now = new Date();
        var News_array = [];

        this.selectors = selectors;

        try {
            await this.page.waitForSelector(this.selectors.title);

            var news_title = await this.page.$$(this.selectors.title);
            var news_href = await this.page.$$(this.selectors.href);
            var news_agency = await this.page.$$(this.selectors.agency);
            var news_date = await this.page.$$(this.selectors.date);
            var news_desc = await this.page.$$(this.selectors.desc);
            var news_lead_img = await this.page.$$(this.selectors.lead_img);

            for (let i = 0; i < news_title.length; i++) {

                try {

                    var News = new Object({
                        title: "",
                        desc: "",
                        agency: "",
                        href: "",
                        date:"",
                        content: "",
                        lead_img: "",
                        id_request: this.id_request,
                        id_engine: this.id_engine
                    });

                    News.title = (await this.page.evaluate(el => el.textContent, news_title[i]));
                    News.href = (await this.page.evaluate(el => el.getAttribute('href'), news_href[i])).split('?')[0];
                    News.agency = (await this.page.evaluate(el => el.textContent, news_agency[i]));

                    News.date = (await this.page.evaluate(el => el.getAttribute('datetime'), news_date[i]));

                    if (News.date === null) {

                        News.date = await this.page.evaluate(el => el.textContent, news_date[i]);
                        News.date = await dateFormer.index(this.id_engine, News.date);
                        News.date = News.date.join(' ');                        

                    }

                    News.desc = await this.page.evaluate(el => el.textContent, news_desc[i]);

                    News_array.push(News);

                } catch(e) {
                    console.log(`ERROR ${e}`)
                }

            }
        } catch (err) {
            console.log(err)
            return
        }

        return _.flatten(News_array);
    }

    // async getContent(url) {

    //     var text = "";
    //     var text_arr = [];

    //     const messages = await new Messages();
    //     await console.log("Начинаю получать контент!");
    //     var now = new Date();

    //     var content_text = [];

    //     if (this.id_engine == "3") {
    //       try {
    //           await this.page.goto(url);
    //           var response = await this.page.goto(url);
    //           var status = await response._status;
    //           if (status == "200") {
    //               await console.log("Успешное подключение к " + url);
    //               var selector = this.configuration.selectors.content;
    //               var sel_art = this.configuration.selectors.article;
    //               await this.page.waitForSelector(selector);
    //               var content = await this.page.$$(sel_art);
    //               for (let i = 0; i < content.length; i++) {
    //                   await content_text.push(await this.page.evaluate(el => el.textContent, content[i]));
    //               }
    //               text = content_text.join('\n');
    //               text = text.replace(/[!^a-z]/gm,"").replace(/[![:blank:]]/,"");
    //           } else {
    //               await console.log("Не удалось подключиться к " + url);
    //           }
    //       } catch (e) {
    //           await messages.showError(now, e);
    //       }
    //     }

    //     // else {
    //     //     const sels = configuration.common.custom_sel;
    //     //     for (let i = 0; i < contentArray.length; i++) {
    //     //         text = "";
    //     //         var response = await this.page.goto(contentArray[i]);
    //     //         var status = await response._status;
    //     //         if (status == "200") {
    //     //             await console.log("Успешное подключение к " + contentArray[i]);
    //     //             for (let j = 0; j < sels.length; j++) {
    //     //                 var content = await this.page.$$(sels[j]);
    //     //                 if (content.length == 0) {
    //     //                     continue;
    //     //                 }
    //     //                 else {
    //     //                     for (let t = 0; t < content.length; t++) {
    //     //                         try {
    //     //                             text += await this.page.evaluate(el => el.textContent, content[t]);
    //     //                             text = text.replace(/[!^a-z]/gm,"").replace(/[![:blank:]]/,"").replace(/{[^\}]*\}/gm,"");
    //     //                         } catch (e) {
    //     //                             await messages.showError(now, e);
    //     //                         }
    //     //                     }
    //     //                     await text_arr.push(text);
    //     //                     break;
    //     //                 }
    //     //             }
    //     //             if (text_arr.length == 0) {
    //     //                 await console.log("Не удалось получить контент с " + contentArray[i]);
    //     //             }
    //     //             else {
    //     //                 text = text_arr.join('\n');
    //     //             }
    //     //         }
    //     //         else {
    //     //             await console.log("Проблемы с подключением к " + contentArray[i]);
    //     //         }
    //     //     }
    //     // }

    //     return text;
    // }
}

module.exports = News;
