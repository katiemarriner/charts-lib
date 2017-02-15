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
    d3.min(this.data, (c) => { return d3.min(c.values, (d) => { return d['xKey']; }); }),
    d3.max(this.data, (c) => { return d3.max(c.values, (d) => { return d['xKey']; }); })
  ]);

  this.y = d3.scaleLinear()
  	.range([this.height, 0]);

  this.y.domain([
    d3.min(this.data, (c) => { return d3.min(c.values, (d) => { return d['yKey']; }); }),
    d3.max(this.data, (c) => { return d3.max(c.values, (d) => { return d['yKey']; }); })
  ]);

  this.z = d3.scaleOrdinal(d3.schemeCategory10);
  this.z.domain(this.data.map((c) => { return c.id; }));
	this.drawLines();

};

MultiLine.prototype.drawLines = function(){
	var _this = this;

	this.line = d3.line()
		.x((d) => {
			return _this.x(d['xKey']); })
    .y((d) => { return _this.y(d['yKey']); });

  this.lineGroups = this.g.selectAll('g.line-group')
    .data(this.data)
    .enter().append('g')
      .attr('class', 'line-group');

  this.lineGroups.append('path')
      .attr('class', 'line')
      .attr('d', (d) => { return _this.line(d.values); })
      .style('stroke', (d) => { return _this.z(d.key); });
  

};

MultiLine.prototype.resize = function(newOpts){
	if(newOpts){
		this.width = newOpts.newWidth; //selector or number
		this.height = newOpts.newHeight; //selector or number or ratio equation
	}

	var _this = this;
	var margin = this.margin;

	this.svg
		.attr('width', (this.width - margin.left - margin.right))
		.attr('height', (this.height - margin.top - margin.bottom));	
	
	this.g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	if(this.newXDomain){
	   x.domain(this.newXDomain);
	}
	if(this.newYDomain){
	   y.domain(this.newYDomain);
	}

	this.x
	    .rangeRound([0, this.width])

	this.y
	    .rangeRound([this.height, 0])

	// this.g.select('g.x-axis')
	// 	.attr('transform', 'translate(0,' + this.height + ')')
	// 	.call(this.axes.xPosition(this.x));

	// this.g.select('g.y-axis')
	// 	.call(this.axes.yPosition(this.y))
	// 	.append('text')
	// 	.attr('fill', '#000')
	// 	.attr('transform', 'rotate(-90)')
	// 	.attr('y', 6)
	// 	.attr('dy', '0.71em')
	// 	.attr('text-anchor', 'end')
	// 	.text(this.yLabel);

	this.line
		.x(d => { return _this.x(d['xKey']); })
	  .y(d => { return _this.y(d['yKey']); });

  this.g.selectAll('.line')
      .attr('d', (d) => { return _this.line(d.values); })
      .style('stroke', (d) => { return _this.z(d.key); });

	

	this.g.select('.line')
		.attr('d', this.line);
}

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