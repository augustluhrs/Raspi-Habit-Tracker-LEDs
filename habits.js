//create express server
let port = process.env.PORT || 8080;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function(){
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));
app.use(express.json());

//test
app.get('/test', function(req, res){
	console.log('test get');
	res.send('hello');
});

//led library

var LedMatrix = require("easybotics-rpi-rgb-led-matrix");
var matrix = new LedMatrix(16, 32, 1, 1, 50, 'regular', 'RGB', ['--led-no-hardware-pulse']);

//overall settings
matrix.brightness(20);

//habit variables
let days = [];

//http responses
app.post('/updateraspi', function(req, res) {
	days = req.body;
	console.log("days:");
	console.log(days);
	updateLEDs();
//	console.log("req");
//	console.log(req);
});


function updateLEDs(){
  matrix.clear();
  let rows = 32;
  let x = 0;
  if (days.length < 32) {
    rows = days.length;
  }
  for (let i = 0; i < 16; i++){
    x = 0;
    for (let j = rows - 1; j >= 0; j--){
      if(days[j].habits[i].completed) {
        matrix.setPixel(x, i, days[j].habits[i].colors[0], days[j].habits[i].colors[1], days[j].habits[i].colors[2]);
      }
      x++;
    }
  }
}



setInterval(function(){matrix.update()}, 4);

/*
for (let i = 0; i < 16; i++){
	for (let j = 0; j < 32; j++){
		matrix.setPixel(j, i, 0, 255/15 * i, 255 - (255/15 * i));
	}
}
*/

//matrix.update();
//while(true){x++;};
//while(true){matrix.update();};

