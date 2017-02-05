var d3 = require('d3');
var Annotation = require('./annotations.js');

var MultiLine = function(element, data, opts){
	this.element = element;
	this.margin = opts.margin ? opts.margin : {top: 15, right: 15, bottom: 15, left: 15};
	this.width = opts.width ? opts.width : 600;
	this.height = opts.height ? opts.height : 400;
	this.parseTime = opts.parseTime ? opts.parseTime : d3.timeParse('%d-%b-%y');
	this.xKey = opts.xKey ? opts.xKey : 'time';
	this.yKey = opts.yKey ? opts.yKey : 'value';
	this.rawData = data;
	this.axes = opts.axes ? opts.axes : {};
		this.axes.xPosition = this.axes.xPosition ? this.axes.xPosition : d3.axisBottom,
		this.axes.yPosition = this.axes.yPosition ? this.axes.yPosition : d3.axisLeft,
		this.axes.xLabel = this.axes.xLabel ? this.axes.xLabel : '',
		this.axes.yLabel =this.axes.yLabel ? this.axes.yLabel : ''
	// this.dataPoints = opts.dataPoints;
};

MultiLine.prototype.init = function(){
	var _this = this;
	var margin = this.margin;

	this.container = d3.select(this.element);
	this.svg = this.container.append('svg')
		.attr('width', (this.width - margin.left - margin.right))
		.attr('height', (this.height - margin.top - margin.bottom));
	this.g = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	this.data = this.formatRecords(this.rawData, this.parseTime, this.xKey, this.yKey);
	console.log(this.data);
	// this.assets();
	this.createScales();
};

MultiLine.prototype.createScales = function(){
	var _this = this;

	this.x = d3.scaleTime().range([0, this.width])
  this.y = d3.scaleLinear().range([this.height, 0])
  this.z = d3.scaleOrdinal(d3.schemeCategory10);
};

MultiLine.prototype.formatRecords = function(rawData, xParse, xKey, yKey){
	var _this = this;
	var lineName = Object.keys(rawData);
	
	return lineName.map((d,di) => {
		var xVals = Object.keys(rawData[d]);
		var yVals = rawData[d];
		return {
			key: d,
			values:xVals.map((e,ei) => {
				return {
					xKey: e,
					yKey: yVals[e]
				}
			})
		} 
	});
};

module.exports = MultiLine;