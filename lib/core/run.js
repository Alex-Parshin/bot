'use strict'

/*
Инициализация сторонних пакетов, расположенных в папке node_modules
--------------------------------------------------------------------------------------
request - GET/POST запросы к серверу
clc - изменение окраски текста, выводимого в консоль
puppeteer - фреймворк для автоматического выполнения действий пользователя в браузере
*/

const request = require('request')
const clc = require('cli-color')
const puppeteer = require('puppeteer')

/*
Подключение внутренних модулей системы поиска новостных материалов
--------------------------------------------------------------------------------------
Initial - класс инициализации поисковых сервисов
Messages - тестовый класс для централизованного хранения выводимых сообщений в консоль
*/

const Initial = require('./initial')
const Messages = require('./utils/messages')
const Utils = require('../core/utils/utils')

const configuration = require('../data/configuration.json')

/*
Переменные, отвечающие за конфигурацию headless chrome браузера
---------------------------------------------------------------------------
headless - отображать графический интерфейс или нет
slowMo - замедление процессов выполнения автоматических действий в браузере
*/

const args = [
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--unhandled-rejections=strict",
    "--disable-notifications"
]

const url = process.env.QUERY_URL

var options = {
    args,
    headless: true,
    ignoreHTTPSErrors: true,
    
    ignoreDefaultArgs: ['--disable-extensions'],
}

var isGo = true
var isServer = false

var status = ""
var query = ""

var configServer = {} 
var id_request = 0
var id_engine = 0

class Run {

    /*
    Класс Run отвечает за получение начальной статической и динамической конфигурации системы, получение поискового запроса
    путем обращения к удаленному серверу посредством модуля request и запуск метода init класса Initial, который позволяет
    подключать поисковые сервисы путем написания одного файла расширения .js и определения его в классе initial.
    */

    async run() {

        const utils = new Utils()
        const messages = new Messages()
        
        var now = new Date()  // текущий момент времени (для логов)
        var goTime = new Date() // текущий момент времени (для отслеживания общего времени работы)

        const interval = 3000  // интервал обращения к isGo
        var pages = Number(process.env.PAGES) //дефолтная глубина поиска в страницах

        var qCount = 0  // количество обработанных запросов
        var AllNews = 0 // количество полученных новостей

        await messages.showStart(now)  //вывод начальной конфигурации в консоль
        
        const browser = await puppeteer.launch(options) //инициализация объекта браузера
        var page = await browser.newPage() //инициалихация объекта страницы

        const searching = setInterval(async () => { //Реализация непрерывного поиска

            if (isGo == true) {

                isGo = false //шлагбаум опускается

                qCount += 1 //количество обработанных запросов
                now = new Date() //текущее время/дата для ведения логов

                //**Get parameters from WEB application**//
                if(configServer.query) {
                    pages = configServer.pages 
                    query = configServer.query 

                    id_request = '123' 

                    switch(configServer.engine) {
                        case 'Yandex.News':
                            id_engine = '4' 
                            break 
                        case 'Rambler.News':
                            id_engine = '3' 
                            break
                        case 'Google.News':
                            id_engine = '7' 
                            break 
                    }
                //*************************************//

                //*********For dev only!***************//
                } else {

                    let query_data = ['боевики', '123', '7']
                    query = query_data[0] 
                    id_request = query_data[1] 
                    id_engine = query_data[2] 

                }
                //***************************************

                console.log(clc.green(`Начинаю обработку поискового запроса: ${query}`)) 
                status = `Начинаю обработку поискового запроса: ${query}` 

                page = await browser.newPage() 
                page.setViewport({width: 1900, height: 1200}) 

                let agents = configuration.common.userAgents
                let userAgent = await utils.getRandom(0, agents.length) 

                console.log(agents[userAgent])
                page.setUserAgent(agents[userAgent])

                const result = await new Initial(browser, page, query, id_request, pages, configuration, id_engine).index()

                //*****************************Stats area ****************************************************************//
                AllNews = AllNews + Number(result) 
                
                let curTime = new Date() 
                let fullTimeWorking = (curTime - goTime) / 1000 
                let queryTime = (curTime - now) / 1000

                console.log(`Обработка запроса заняла ${queryTime} секунд! Всего получено ${AllNews} новостей`)
                //********************************************************************************************************//

                //**********Is the query from WEB*********//
                if (configServer != null) isServer = false
                //****************************************//

                isGo = true // For dev only
            }

            //***********Managing proccess***************//
            // else if (isGo == true && isServer == false) {
            //     console.log("Waiting")
            //     status = "Waiting"
            // }

            // else if (isGo == false && isServer == false) {
            //     console.log("Shutting down")
                // clearInterval(searching) 
                // return
            // }
            //*******************************************//

        }, interval) 
    }

//************************************Get data from remote server*****************************//
    async fromServer(url) {
        console.log("Получаю запрос") 
        return await new Promise(async (resolve, reject) => {
            await request({
                method: "GET",
                url: url,
            },
            async (error, response, body) => {
                if (!error && response.statusCode == 200 && JSON.parse(body).query != " ") {
                    
                    query = await JSON.parse(body).query.replace(/"/g, ' ').trim() 
                    id_request = await JSON.parse(body).id_request 
                    id_engine = await JSON.parse(body).id_engine 
                    
                    resolve(data) 
                }
                else {
                    return 
                }
            }) 
        }) 
    }
//*******************************Server side functions area**********************************//
    async start() {
        isGo = true 
        isServer = true 
    }

    async botConfig(data) {
        configServer = data
    }
    async check() {
        return [status, workTime, newsCount]
    }

    async stop() {
        isServer = false 
        isGo = true 
    }
//*******************************************************************************************//

}

module.exports = Run 
