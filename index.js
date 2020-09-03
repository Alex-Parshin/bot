'use strict'

/*
Подключение модуля dotenv, позволяющего работать с файлом .env, позволяющем
модифицировать переменные окружения (в перспективе - заменить файлом .env
файл configuration.json)
*/

require('dotenv').config();

/*
Подключение модуля Run, отвечающего за начальную конфигурацию и запуск системы 
*/

const Run = require('./lib/core/run');

const run = new Run();
run.run();
