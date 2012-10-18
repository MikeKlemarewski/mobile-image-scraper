var system = require('system');
var page = require('webpage').create();


page.settings.userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5'
page.viewportSize = { width: 640, height: 960 }
page.paperSize    = { width: 640, height: 960 } 

var url;

if(system.args.length > 1){
	url = system.args[1];
}
else{
	console.log("Usage: phantomjs capture.js <url>");
	phantom.exit();
}

page.open(url, function (status) {
	var pic_name = url.replace(/\/$/, "");
	pic_name = pic_name.replace(/(http|https):\/\//,"");
	pic_name = "images/" + pic_name.replace(/\//g,".") + ".png";
	setTimeout(function(){getShot(pic_name)}, 3000);
});

function getShot(pic_name){
	console.log("Saving " + pic_name);
    page.render(pic_name);
    phantom.exit();
}