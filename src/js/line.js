var d3 = require('d3');
var Annotation = require('./annotations.js');

var Line = function(opts){
	this.element = opts.element ? opts.element : '#app';
	this.margin = opts.margin ? opts.margin : {top: 15, right: 15, bottom: 15, left: 15};
	this.width = opts.width ? opts.width : 600;
	this.height = opts.height ? opts.height : 400;
	this.parseTime = opts.parseTime ? opts.parseTime : d3.timeParse('%d-%b-%y');
	this.xKey = opts.xKey ? opts.xKey : 'time';
	this.yKey = opts.yKey ? opts.yKey : 'value';
	this.rawData = opts.data;
	this.axes = {
		xPosition: opts.axes.xPosition ? opts.axes.xPosition : d3.axisBottom,
		yPosition: opts.axes.yPosition ? opts.axes.yPosition : d3.axisLeft,
		xLabel: opts.axes.xLabel ? opts.axes.xLabel : '',
		yLabel: opts.axes.yLabel ? opts.axes.yLabel : ''
	}
	this.aOpts = opts.aOpts
}

Line.prototype.drawScaffold = function(){
	var _this = this;
	var margin = this.margin;

	this.container = d3.select(this.element);
	this.svg = this.container.append('svg')
		.attr('width', (this.width - margin.left - margin.right))
		.attr('height', (this.height - margin.top - margin.bottom));
	

	this.assets();
	

	this.g = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	this.data = this.formatData(this.rawData, this.parseTime, this.xKey, this.yKey);

	this.createScales();
}

Line.prototype.assets = function(){
	this.svg.append("svg:defs").append("svg:marker")
	    .attr("id", "arrowhead")
	    .attr("refX", 6)
	    .attr("refY", 6)
	    .attr("markerWidth",15)
	    .attr("markerHeight",15)
	    .attr("orient", "auto")
	    .append("path")
	    .attr("d", "M 0 0 12 6 0 12 3 6")
	    .style("fill", "black");
}

Line.prototype.createScales = function(newOpts){
	if(newOpts){
		this.width = newOpts.width ? (newOpts.width + this.margin.left + this.margin.right) : this.width;
		this.height = newOpts.height ? (newOpts.width + this.margin.top + this.margin.bottom) : this.height;
		this.xDomain = newOpts.xDomain ? newOpts.xDomain : this.xDomain;
		this.yDomain = newOpts.yDomain ? newOpts.yDomain : this.yDomain;
		this.xRange = newOpts.xRange ? newOpts.xRange : this.xRange;
		this.yRange = newOpts.yRange ? newOpts.yRange : this.yRange;
	}

	var _this = this;

	this.x = d3.scaleTime()
	    .rangeRound([0, this.width])
	    .domain(d3.extent(this.data, d => { return d['xKey']; }));

	this.y = d3.scaleLinear()
	    .rangeRound([this.height, 0])
	    .domain(d3.extent(this.data, d => { return d['yKey']; }));

	this.createAxes();
}

Line.prototype.createAxes = function(newOpts){

	this.g.append('g')
		.attr('transform', 'translate(0,' + this.height + ')')
		.attr('class', 'x-axis')
		.call(this.axes.xPosition(this.x));

	this.g.append('g')
		.attr('class', 'y-axis')
		.call(this.axes.yPosition(this.y))
		.append('text')
		.attr('fill', '#000')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text(this.yLabel);

	this.drawLine();
}

Line.prototype.drawLine = function(){
	var _this = this;

	this.line = d3.line()
	    .x(d => { return _this.x(d['xKey']); })
	    .y(d => { return _this.y(d['yKey']); });

	this.g.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('class', 'line')
      .attr('d', this.line);

    if(this.aOpts)this.drawAnnotations();
	// pass in containerSelect, gSelect, scales, dataPoints
}

Line.prototype.drawAnnotations = function(){
	var _this = this;
	this.aOpts = this.aOpts.map(d => {
		return {
			point: _this.data[d.index],
			text: d.text
		}
	});
    new Annotation({
    	container: this.container,
    	g: this.g,
    	xScale: this.x,
    	yScale: this.y,
    	dataPoints: this.aOpts
    });
}

Line.prototype.resize = function(newOpts){
	var margin = this.margin;
	if(newOpts){
		this.width = newOpts.width ? newOpts.width : this.width;
		this.height = newOpts.height ? newOpts.height : this.height;
		this.xDomain = newOpts.xDomain ? newOpts.xDomain : this.xDomain;
		this.yDomain = newOpts.yDomain ? newOpts.yDomain : this.yDomain;
		this.xRange = newOpts.xRange ? newOpts.xRange : this.xRange;
		this.yRange = newOpts.yRange ? newOpts.yRange : this.yRange;
	}

	var _this = this;

	this.svg
		.attr('width', (this.width - margin.left - margin.right))
		.attr('height', (this.height - margin.top - margin.bottom));	
	
	this.g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	this.x
	    .rangeRound([0, this.width])
	    .domain(d3.extent(this.data, d => { return d['xKey']; }));

	this.y
	    .rangeRound([this.height, 0])
	    .domain(d3.extent(this.data, d => { return d['yKey']; }));

	this.g.select('g.x-axis')
		.attr('transform', 'translate(0,' + this.height + ')')
		.call(this.axes.xPosition(this.x));

	this.g.select('g.y-axis')
		.call(this.axes.yPosition(this.y))
		.append('text')
		.attr('fill', '#000')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text(this.yLabel);

	this.line
		.x(d => { return _this.x(d['xKey']); })
	    .y(d => { return _this.y(d['yKey']); });

	this.g.select('.line')
		.attr('d', this.line);
}

Line.prototype.formatData = function(rawData, xParse){
	var _this = this;
	return rawData.map(d =>{
		return {
			xKey: xParse(d[_this.xKey]),
			yKey: +d[_this.yKey]
		}
	});
}

module.exports = Line;