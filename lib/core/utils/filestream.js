const fs = require('fs');
const FILE_PATH = '/srv/newser/logs.txt';

class FileStream {

	async append(data) {
		this.data = data;

		try {
			await fs.appendFile(FILE_PATH, this.data + '\n', (err) => {
			  	if (err) {
			  		console.log(err);
			  	}
			});
		} catch (e) {
			await console.log(e);
		}
	}
}

module.exports = FileStream;