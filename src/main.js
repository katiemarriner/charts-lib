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
	// In order to create a line chart with this library, the dataformat must be an array of objects with two key:value pairs. One for the xAxis and one for the yAxis
	//Example: [{time:'YYYY-MM-DD',value:142.53}...]
	var SP = new Line({
		element: '#app', //string (required)
		data: data, //data (required)
		margin: {top:15,right:15,bottom:15,left:15}, //object
		width: document.getElementById('app').clientWidth, //selector or number
		height: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
		xKey: 'time', //string
		yKey: 'value', //string
		parseTime: d3.timeParse('%d-%b-%y'), //d3 time format https://github.com/d3/d3-time-format#locale_format
		axes: {
			xValue: '', //string
			yValue: '', //string
			xPosition: d3.axisBottom, //follow the format to the left and go here for reference https://github.com/d3/d3-axis/blob/master/README.md#axisTop
			yPosition: d3.axisLeft //see above
		},
		aOpts: [
			{
				index: data.length-1, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
    			text: data[data.length-1].time + ' ' + data[data.length-1].value //pass in text or a template
			}
		]
	});
	SP.drawScaffold();

	function resize(){
		SP.resize({
			width: document.getElementById('app').clientWidth, //selector or number
			height: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
		});
	}

	window.onresize = resize;
});