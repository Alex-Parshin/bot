'use strict'

const clc = require("cli-color")
var anticaptcha = require('./anticaptcha')('97203e301632af0a78ff1ba36390b902')

const Messages = require('./messages')
const configuration = require('./../../data/configuration.json')

class Captcha {
    
    constructor(page) {
        this.page = page;
    }

    async solve() {

        const now = new Date()
        const messages = new Messages()

        await messages.captchaCheck(now)

        const cur_page = this.page.url()

        if ((cur_page.indexOf('showcaptcha') != -1) == true)
        {

            await messages.captchaAlert(now)

            const element = await this.page.$(configuration.common.captchaSelectors.img)
            const base64image = await element.screenshot({encoding: "base64"})

            await console.log("Посылаю на обработку!")

            try {

                let solve = await new Promise(async (resolve, reject) => {

                        await anticaptcha.createImageToTextTask({
                            case: true,
                            body: base64image
                        },

                        async (err, taskId) => {
                            
                            if (err) {

                                reject(err)

                            } else {

                                await console.log('Получил идентификатор', taskId)
                                await anticaptcha.getTaskSolution(taskId, async (err, taskSolution) => {

                                    if (err) reject (err)

                                    const c_response = await taskSolution
                                    console.log(c_response)

                                    var captcha_input = await this.page.$(configuration.common.captchaSelectors.input)
                                    await captcha_input.type(c_response)

                                    await this.page.keyboard.press('Enter')
                                    resolve("Капча решена")

                                });

                            }

                        });                     

                });

                let result = await solve
                
                console.log(result)

            } catch (err) {
                throw err
            }

        }

        else {
            await messages.noCaptcha(now)
        }
    }
}

module.exports = Captcha;