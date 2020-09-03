'use strict'
const readline = require('readline');

class Utils {

    async autoscroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {

                var totalHeight = 0;
                var distance = 100;

                var timer = setInterval(() => {

                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    setTimeout(() => {
                        clearInterval(timer);
                        resolve();
                    }, 2000);

                }, 200);

            });
        });
    }

    async firstMenu() {
        await console.log("Добро пожаловать в меню первоначальной настройки работы поискового бота");
        
        var engProm = await new Promise(async (resolve, reject) => {
        
            const rl = await readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            await rl.question("Для какого сервиса будет использоваться поисковой бот? (1 - Yandex, 2 - Google, 3 - Rambler) ", (answer) => {

                switch(answer) {
                    case '1': resolve("yandex");
                    case '2': resolve("google");
                    case '3': resolve("rambler");
                    default: reject("Неправильный ответ");
                }

                rl.close();
            });
        });

        var grProm = await new Promise(async (resolve, reject) => {
            
            const rl = await readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            await rl.question("Использовать графический интерфейс? (y/n) ", (answer) => {
                if (answer == "y") {
                    resolve(false);
                }
                else if (answer == "n") {
                    resolve(true);
                }
                else {
                    reject("Неправильный выбор!");
                }
                rl.close();
            });
        });

        var pageProm = await new Promise(async (resolve, reject) => {
            
            const rl = await readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            await rl.question("Глубина поиска (в страницах)? ", (answer) => {
                answer = Number(answer);
                if (answer > 0) {
                    resolve(answer);
                }
                else {
                    reject("Неверные данные");
                }
                rl.close();
            });
        });
        
        var result = await [engProm, grProm, pageProm];
        return result;
    } 

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    } 
}

module.exports = Utils;