'use strict'
const clc = require('cli-color');
const fs = require('fs');

const FileStream = require('./filestream.js');
const fileStream = new FileStream();

class Messages {

	async showStart(now) {
		this.now = now;

        await console.log(clc.green("Working!"));
        await console.log(clc.green(this.now + " Получена команда START (ver. dev/1.0)"));
        await fileStream.append(this.now + " Получена команда START (ver. dev/1.0)");
	}

	async showConfig(engine, options, pages, isThreads) {
		this.engine = engine;
		this.options = options;
		this.pages = pages;
		this.isThreads = isThreads;

		if (this.options == true) {
			this.options = "нет";
		}
		else {
			this.options = "да";
		}

		if (this.isThreads == true) {
			this.isThreads = "да";
		}
		else {
			this.isThreads = "нет";
		}

		await console.log(clc.yellow("---------------------------------"));
        await console.log("Полученная конфигурация:");
        await console.log("1. поисковая система: " + this.engine);	
        await console.log("2. глубина поиска, страниц: " + this.pages);
        await console.log("3. графический интерфейс: " + this.options);
        await console.log("4. параллельный поиск: " + this.isThreads);
        await console.log(clc.yellow("---------------------------------"));

        // await fileStream.append("---------------------------------");
        // await fileStream.append("Полученная конфигурация:");
        // await fileStream.append("1. глубина поиска, страниц: " + this.pages);
        // await fileStream.append("2. поисковая система: News.Yandex.ru");
        // await fileStream.append("3. ....");
        // await fileStream.append("---------------------------------");
	}

	async loadComplete(now) {
		this.now = now;

		await console.log(clc.green(this.now + " Запрос прогрузился!"));
		fileStream.append(this.now + " Запрос прогрузился!");
	}

	async showEnd(now) {
		this.now = now;

		await console.log(clc.green(this.now + " ***********Browser session end!**************"));
		fileStream.append(this.now + " ***********Browser session end!**************");	
	}

	async showRelated() {
		await console.log(clc.yellow("Начинаю обработку похожих новостей"));
		await fileStream.append("Начинаю обработку похожих новостей");
	}

	async cantUrl(now, url) {
		this.now = now;
		this.url = url;

		await console.log(clc.red(this.now + " Не могу перейти по ссылке " + this.url));
		await fileStream.append(this.now + " Не могу перейти по ссылке " + this.url);
	}

	async countRelated(length) {
		this.length = length;

		await console.log(clc.green("Похожих новостей: " + this.length));
		await fileStream.append("Похожих новостей: " + this.length);
	}

	async cantGetQuery(now) {
		this.now = now;

		await console.log(clc.red(this.now + " Не могу получить запрос!"));
		await fileStream.append(this.now + " Не могу получить запрос!");
	}

	async showError(now, error) {
		this.now = now;
		this.error = error;

		await console.log(clc.red(this.now + " " + this.error));
		await fileStream.append(this.now + " " + this.error)
	}

	async nextPage(now, page) {
		this.now = now;
		this.page = page;

		await console.log(clc.yellow(this.now + " Переход на страницу " + (this.page + 2)));
		await fileStream.append(this.now + " Переход на страницу " + (this.page + 2));
	}

	async noNextPage(now) {
		this.now = now;

		await console.log(clc.red(this.now + " Нет других страниц"));
		await fileStream.append(this.now + " Нет других страниц");
	}

	async onPage(url) {
		this.url = url;

		await console.log("На странице " + this.url);
		await fileStream.append("На странице " + this.url);
	}

	async captchaCheck(now) {
		this.now = now;
		await console.log(clc.yellow(this.now + " Проверка капчи"));
		await fileStream.append(this.now + " Проверка капчи");
	} 

	async captchaAlert(now) {
		this.now = now;

		await console.log(clc.red(this.now + " КАПЧА!"));
	}

	async captchaResolve(now, c_response) {
		this.now = now;
		this.c_response = c_response;
		if (this.c_response.indexOf("Ошибка") != -1) {
			await console.log(clc.red(this.now + " " + c_response));
		}
		else {
			await console.log(clc.green(this.now + " Капча обработана! " + this.c_response));
			await fileStream.append(this.now + " Капча обработана! " + this.c_response);
		}
	}

	async noCaptcha(now) {
		this.now = now;

		await console.log(now + " Капчи нет");
		await fileStream.append(now + " Капчи нет!");
	}

	async showStatistics(time, data, count) {
		if (time > 60) {
            await console.log(clc.yellow("Общее время работы бота составляет " + (time / 60).toFixed(0) + " минут " + (time - 60).toFixed(0) + " секунд"));
            await fileStream.append("Общее время работы бота составляет " + (time / 60).toFixed(0) + " минут " + (time - 60).toFixed(0) + " секунд");
        }
        else {
            await console.log(clc.yellow("Общее время работы бота составляет " + time.toFixed(0) + " секунд"));
            await fileStream.append("Общее время работы бота составляет " + time.toFixed(0) + " секунд");
        }
        await console.log(clc.yellow("Всего получено новостей " + data));
        await fileStream.append("Всего получено новостей " + data);
        await console.log(clc.yellow("Среднее время обработки запроса " + (time / count).toFixed(0) + " секунд"));
        await fileStream.append("Среднее время обработки запроса " + (time / count).toFixed(0) + " секунд");
        await console.log(clc.yellow("Среднее время обработки одной новости " + (time / data).toFixed(2) + " секунд"));
        await fileStream.append("Среднее время обработки одной новости " + (time / data).toFixed(2) + " секунд");
        await console.log("***************************************************");
	} 

	async showInitStat(finishTime, startTime) {
		this.finishTime = finishTime;
		this.startTime = startTime;

		var proceedTime = (this.finishTime - this.startTime) / 1000;
		
		await console.log("***************************************************");
        await console.log(clc.yellow("Обработка запроса заняла " + proceedTime + " секунд"));
        await fileStream.append("Обработка запроса заняла " + proceedTime + " секунд");
	}

	async showDialog(now) {
		this.now = now;
		await console.log(this.now + " Добро пожаловать в меню первоначальной настройки работы поискового бота");
	}
}

module.exports = Messages;