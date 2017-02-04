var d3 = require('d3');
var $ = require('jquery');
var Data = require('./js/data.js');
var Line = require('./js/line.js');
// require('./js/swoopy-arrow.js');


function loadData(){
	// var X = new Data({
	// 	urls: [
	// 		{
	// 			name: 'markets',
	// 			ref: ,
	// 			method: 'Michelangelo',
	// 		}
	// 	]
	// });
}

d3.tsv('src/data/data.tsv', (data) => {
	var SP500 = new Line('#app', data, {
		width: document.getElementById('app').clientWidth, //selector or number
		height: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
		dataPoints: [
			{
				index: data.length-1, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
    			text: data[data.length-1].time + ' ' + data[data.length-1].value //pass in text or a template
			},
			{
				index: 0, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
    			text: data[0].time + ' ' + data[0].value //pass in text or a template
			}
		]
	});
	SP500.init();

	function resize(){
		SP500.resize({
			newWidth: document.getElementById('app').clientWidth, //selector or number
			newHeight: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
		});
	}

	window.onresize = function(){
		setTimeout(resize, 500);
	};
});