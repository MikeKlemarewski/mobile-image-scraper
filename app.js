var express = require('express');
var http = require('http');
var fs = require('fs');
var child_process = require('child_process');
var async = require('async');
var app = express();

app.get('/', function(req, res){
	var params = {
		  host:'portal.dev'
		, port: 8000
		, path: '/randomlivesite/'
		, method:'GET'
	}

	var request = http.request(params, function(response){
		var body = "";
		response.on('data', function(chunk){
			body += chunk;
		});

		response.on('end', function(){
			url = JSON.parse(body)['url'];
			getPic(url, function(path){
				var img = fs.readFileSync(path);
				res.writeHead(200, {'Content-Type':'image/png'});
				res.end(img, 'binary');
			});
		})
	});

	request.on('error', function(e){
			console.log("ERROR: " + e.message);
	})
	request.end();
});

// Spawns a phantomjs process to take screenshot of the given url
function getPic(url, callback){
	ps = child_process.spawn('phantomjs', ['capture.js', url]);

	var blob = '';
	ps.stdout.on('data', function(data){
		blob += data;
	});

	ps.stdout.on('end', function(){
		console.log(blob);
	})

	ps.stderr.on('data', function(data){
		console.log('stderr: ' + data);
	});


	// Once screenshot is taken, crop it using imageMagick
	ps.on('exit', function(code){
		if(code === 0){
			var pic_name = url.replace(/\/$/, "");
			pic_name = pic_name.replace(/(http|https):\/\//,"");
			pic_name = "images/" + pic_name.replace(/\//g,".") + ".png";
			console.log(url);
			ps = child_process.spawn('convert'
				, [pic_name
					, '-crop', '640x960+0+0'
					, '-gravity', 'South'
					, '-background', 'black'
					, '-fill', 'white'
					, '-pointsize', '18'
					, '-splice', '0x18'
					, '-annotate', '-100+0'
					, url
					, pic_name]);

			ps.stdout.on('data', function(data){
				console.log(data);
			});

			ps.stderr.on('data', function(data){
				console.log('stderr: ' + data);
			});

			ps.on('exit', callback.bind(null,pic_name));

		}
	});
}

app.listen(3000);