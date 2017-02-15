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

	// this.assets();
	this.createScales();
};

MultiLine.prototype.createScales = function(){
	var _this = this;
	console.log(this.data);

	this.x = d3.scaleTime()
		.range([0, this.width])

  this.x.domain([
    d3.min(this.data, function(c) { return d3.min(c.values, function(d) { return d['xKey']; }); }),
    d3.max(this.data, function(c) { return d3.max(c.values, function(d) { return d['xKey']; }); })
  ]);

  this.y = d3.scaleLinear()
  	.range([this.height, 0]);

  this.y.domain([
    d3.min(this.data, function(c) { return d3.min(c.values, function(d) { return d['yKey']; }); }),
    d3.max(this.data, function(c) { return d3.max(c.values, function(d) { return d['yKey']; }); })
  ]);

  this.z = d3.scaleOrdinal(d3.schemeCategory10);
  this.z.domain(this.data.map(function(c) { return c.id; }));
	this.drawLines();

};

MultiLine.prototype.drawLines = function(){
	var _this = this;

	this.line = d3.line()
		.x(function(d) {
			return _this.x(d['xKey']); })
    .y(function(d) { return _this.y(d['yKey']); });

  this.lineGroups = this.g.selectAll('g.line-group')
    .data(this.data)
    .enter().append('g')
      .attr('class', 'line-group');

  this.lineGroups.append('path')
      .attr('class', 'line')
      .attr('d', function(d) { return _this.line(d.values); })
      .style('stroke', function(d) { return _this.z(d.key); });
  

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
					xKey: this.parseTime ? this.parseTime(e) : e,
					yKey: yVals[e]
				}
			})
		} 
	});
};

module.exports = MultiLine;