var fs = require('fs'),
    path = require('path'),
    logger = require('log4js').getLogger("config");

var base_dir = path.resolve(__dirname, "..");
var scrap_dir = path.join('./', ".scrapbooks");

exports.title = 'i.js';
exports.base_dir = base_dir;
exports.scrap_dir = scrap_dir;

exports.setup = function () {
    logger.info("setup()");
    if (fs.existsSync(scrap_dir)) {
        if (!fs.statSync(scrap_dir).isDirectory()) {
            throw new Error(scrap_dir + " should be a directory");
        }
    } else {
        fs.mkdirSync(scrap_dir);
    }
}