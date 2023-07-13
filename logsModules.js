const fs = require('fs');
const path = require('path');

const logsFile = path.join(__dirname, 'logs.txt');

module.exports = {
  writeLog: function (request, response, status) {
    const method = request.method;
    const url = request.originalUrl;
    const currentTime = new Date().toLocaleString();
    const logLine = `${method} "${url}" at ${currentTime}, Status: ${status}\n`;

    fs.appendFile(logsFile, logLine, (err) => {
      if (err) throw err;
    });
  }
};
