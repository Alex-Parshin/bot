'use strict'
// const { Pool } = require('pg');
const clc = require('cli-color');
const fs = require('fs');
const request = require('request');
var amqp = require('amqplib/callback_api')
// const fetch = require('node-fetch');

const FileStream = require('./filestream');

const configuration = require('./../../data/configuration.json');

var resPostAll = new Array();
var data = [];
var query = "";

class DB {

    async getConfig() {

        await console.log("ENV " + process.env.DB_USER);
        
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        try {
            await pool.connect(async (err, client, release) => {
                
                if (err) {
                    return console.error('Error acquiring client', err.stack);
                }

                try {

                    await client.query(configuration.common.queries.getBotConfig, async (err, result) => {
                        if (err) {
                            return console.error(err);
                        }
                        else {

                            pages = await result.rows[0]['pages'];
                        }
                    });

                } catch (e) {
                    console.log(e);
                }

                await release();
            });

        } catch(e) {

            console.log("Ошибка подключения!");

        }
        
        return pages;
    }

    async store(query, id_request, News_all) {

        this.query = query;
        this.id_request = id_request;
        this.News_all = News_all;

        data = this.News_all;
        query = this.query;

        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'ias_test',
            password: 'postgres',
            port: 5432
        });

        await console.log("Начинаю запись в базу " + this.query);

        try {

            await pool.connect(async (err, client, release) => {

                if (err) {
                    return console.error('Error acquiring client', err.stack);
                }
                else {
                    await console.log("Успешное подключение " + this.News_all.length);
                }

                try {

                    for (let i = 0; i < this.News_all.length; i++) {

                        await client.query('insert into "news" (query, title, description, href, agency, date) values ($1, $2, $3, $4, $5, $6)', [query, data[i].title, data[i].desc, data[i].href, data[i].agency, data[i].date], async function (err, result) {
                            if (err) {
                                await console.log("Новость уже есть в базе!");
                            }
                            else {
                                await console.log("Новость " + data[i].title + " успешно записана в базу");
                                var domain = await data[i].href.replace('http://','').replace('https://','').split(/[/?#]/)[0];

                                await client.query(configuration.common.queries.storeDomains, [domain, 0, data[i].href], async (err, result) => {
                                    if (err) {
                                    }
                                });

                                await client.query(configuration.common.queries.updateDomains, [domain], (err, result) => {
                                    if (err) {
                                    }
                                });
                            }
                        });
                    }

                } catch (e) {
                    console.log(e); 
                }

                await console.log("Записано в базу");

                await release();
            });
        }catch(e) {
            console.log(e);
        }

        try {
            await fs.writeFileSync('/home/user/docker/src/yandex/src/express/data/result.json', JSON.stringify(News_all), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        } catch (e) {
            await console.log(e);
        }
    }

    async remoteStore(query, id_request, News_all, id_engine, configuration) {

        this.query = query;
        this.id_request = id_request;
        this.News_all = News_all;
        this.id_engine = id_engine;
        this.configuration = configuration;

        data = this.News_all;
        query = this.query;

        for (let i = 0; i < data.length; i++) {
            try {
                resPostAll.push([data[i].title, data[i].href, data[i].desc, data[i].date, data[i].agency]);
            } catch (e) {

            }
        }

        await console.log(resPostAll);
        data = resPostAll
        
        const filestream = new FileStream();
        await filestream.append(JSON.stringify(resPostAll));
        
        await console.log(clc.green("ID запроса " + this.id_request));
        await console.log(clc.green("По запросу " + query + " найдено " + resPostAll.length + " новостей!"));

        // await request.post({
        //     headers: {
        //         'content-type' : 'application/json',
        //     },
        //     url: process.env.SEND_URL,
        //     json: true,

        //     form: 
        //     {
        //         'id_request': this.id_request,
        //         'data': JSON.stringify(resPostAll),
        //         'id_engine': this.id_engine
        //     },   

        // }, async (error, response, body) => {
        //     if (error) {
        //         throw error;
        //     }
        //     await console.log(body);
        // });

        resPostAll.length = await 0;
    }

    async testSend(data,rpc_queue){

        await new Promise((resolve, reject) => {

            amqp.connect('amqp://localhost', function(error0, connection) {
              
                if (error0) {
                    throw error0;
                }

                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                
                channel.assertQueue('', {
                    exclusive: true
                }, function(error2, q) {
                    
                    if (error2) {
                        throw error2;
                    }

                    console.log(' [x] Параметр с запроса()');

                    channel.consume(q.queue, function(msg) {
                       // console.log(' [.] Got %s', msg.content.toString());
                        setTimeout(function() { 
                            connection.close();
                            resolve()
                        }, 500);
                    }, {
                        noAck: true
                    });

                    channel.sendToQueue(rpc_queue,
                        Buffer.from(JSON.stringify(data)),
                        { 
                            correlationId: "строка передана", 
                            replyTo: q.queue 
                        }

                    );                                       
                });
            });
        })
    })

    }
}

module.exports = DB;