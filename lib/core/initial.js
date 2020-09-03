'use strict'

//**************Внешние модули для работы системы****************//
const clc = require('cli-color')
const _ = require('underscore')

//************Внутренние модули для работы системы**************//
const DB = require('./utils/db')

//*****************Основные поисковые движки********************//
const Yandex = require('../engines/yandex')
const Google = require('../engines/google')
const Rambler = require('../engines/rambler')

class Initial {

    constructor(browser, page, query, id_request, pages, configuration, id_engine) {

        this.browser = browser
        this.page = page
        this.query = query
        this.id_request = id_request
        this.pages = pages
        this.configuration = configuration
        this.id_engine = id_engine

    }

    async index() {

        var News_array = []

        try {

            switch(this.id_engine) {

                case '4':
                    News_array = await new Yandex(this.page, this.pages, this.query, this.configuration, this.id_request).index()
                    this.page.close() 
                    break 
                case '3':
                    News_array = await new Rambler(this.page, this.pages, this.query, this.configuration, this.id_request).index()
                    this.page.close() 
                    break 
                case '7':
                    News_array = await new Google(this.page, this.pages, this.query, this.configuration, this.id_request).index()
                    this.page.close() 
                    break 
                default:
                    console.log("Такого движка нет") 
                    break

            }

            console.log(News_array)
        } catch (err) {
            return 0
        }

        //****************************** Обработка полученных новостей ****************************************//
        // const db = new DB()
        // await db.store(this.query, this.id_request, _.flatten(News_array)) //хранения данных в локальной базе
        // await db.remoteStore(this.query, this.id_request, _.flatten(News_array), this.id_engine, this.configuration) //отправка данных на удаленный сервер
         //await db.testSend(_.flatten(News_array), "puppeteer_bot") //отправка данных на удаленный сервер через RabbitMQ
        //*****************************************************************************************************//

        return News_array.length || 0
    }
}

module.exports = Initial