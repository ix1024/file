var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var fileType = ['image/png', 'image/gif', 'image/jpeg', 'application/x-zip-compressed', 'application/vnd.ms-excel', 'video/mp4'];

var utils = require('npm-utils-kingwell');
var upload = multer({
	limits: {
		fieldNameSize: 100, //field 名字最大长度
		fieldSize: 100, //field 值的最大长度
		files: 5,
		//fileSize: 1024 * 1024,
	},
	filename: function(req, file, cb) {
		console.log(1023);
		cb(null, file.fieldname + '-' + Date.now());
	},
	fileFilter: function(req, file, c) {

		console.log(file);
		var mimetype = file.mimetype;
		if (utils.inArray(mimetype, fileType) !== -1) {
			c(null, true);
		} else {
			c(null, false);
		}

	},
	dest: '../public/uploads/'
});

var mime = {
	"css": "text/css",

	"gif": "image/gif",

	"html": "text/html",

	"ico": "image/x-icon",

	"jpeg": "image/jpeg",

	"jpg": "image/jpeg",

	"js": "text/javascript",

	"json": "application/json",

	"pdf": "application/pdf",

	"png": "image/png",

	"svg": "image/svg+xml",

	"swf": "application/x-shockwave-flash",

	"tiff": "image/tiff",

	"txt": "text/plain",

	"wav": "audio/x-wav",

	"wma": "audio/x-ms-wma",

	"wmv": "video/x-ms-wmv",

	"xml": "text/xml",
	"mp4": "video/mp4"
};
/* GET home page. */
router.get('/get/:id', function(req, res, next) {
	var id = req.params.id;
	var _path = '../public/uploads/';
	var realPath = _path + id;
	var lastIndexOf = realPath.lastIndexOf('.');
	var type = realPath.slice(lastIndexOf + 1);
	realPath = realPath.slice(0, lastIndexOf);
	console.log('path\n\n', realPath, lastIndexOf, type);
	fs.stat(realPath, function(err, stat) {
		if (err) {
			res.send(err);
		} else {
			if (stat.isFile()) {

				var stream = fs.createReadStream(realPath);
				var ext = path.extname(realPath);

				// console.log(realPath, ext, 2222222222222);
				// ext = ext ? ext.slice(1) : 'unknown';
				ext = ext ? ext.slice(1) : type;
				console.log(ext, mime[ext]);
				var contentType = mime[ext] || "text/plain";
				res.setHeader("Content-Type", contentType);
				stream.pipe(res);
			}
		}

	});

});
var uploads = upload.any();
router.post('/upload', function(req, res, next) {
	uploads(req, res, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.send(req.files);
		}

	});

});
module.exports = router;