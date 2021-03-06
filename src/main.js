var d3 = require('d3');
// var $ = require('jquery');
var _ = require('lodash/core');
var Data = require('./js/data.js');
var Line = require('./js/line.js');
// var MultiLine = require('./js/multiLine.js');
// var StackedBar = require('./js/stackedBar.js');

d3.json('src/data/line.json', (data) => {
	// var rowKey = 'month';

	// var Stacked = new StackedBar('#app', data, {
	// 	width: document.getElementById('app').clientWidth, //selector or number
	// 	height: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
	// 	rowKey: rowKey,
	// 	keys: Object.keys(data[0]).filter(d => { return d != rowKey; })
		// dataPoints: [
		// 	{
		// 		index: data.length-1, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
  //   		text: 'last' //pass in text or a template
		// 	},
		// 	{
		// 		index: 0, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
  //   		text: 'first' //pass in text or a template
		// 	}
		// ]
	// });
	// Stacked.init();
	var AAPL = new Line('#app', data, {
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
	AAPL.init();

	// var Weather = new MultiLine('#app', data, {
	// 	width: document.getElementById('app').clientWidth, //selector or number
	// 	height: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
	// 	parseTime: d3.timeParse('%Y%m%d'),
	// 	dataPoints: [
	// 		{
	// 			index: data.length-1, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
 //    		text: 'last' //pass in text or a template
	// 		},
	// 		{
	// 			index: 0, //this can be an underscore function or hardcoded as long as it's an object with an x and y value in the same format as the data passed into the chart
 //    		text: 'first' //pass in text or a template
	// 		}
	// 	]
	// });
	// Weather.init();

	
	function resize(){
		// Weather.resize({
		// 	newWidth: document.getElementById('app').clientWidth, //selector or number
		// 	newHeight: document.getElementById('app').clientWidth/1.5, //selector or number or ratio equation
		// });
	}

	window.onresize = function(){
		setTimeout(resize, 500);
	};
});