var d3 = require('d3');
var Annotation = require('./annotations.js');

var Line = function(element, data, opts){
	this.element = element;
	this.margin = opts.margin ? opts.margin : {top: 15, right: 15, bottom: 15, left: 15};
	this.width = opts.width ? opts.width : 600;
	this.height = opts.height ? opts.height : 400;
	this.parseTime = opts.parseTime ? opts.parseTime : d3.timeParse('%d-%b-%y');
	this.xKey = opts.xKey ? opts.xKey : 'time';
	this.yKey = opts.yKey ? opts.yKey : 'value';
	this.rawData = data;
	this.axes = {
		xPosition: opts.axes.xPosition ? opts.axes.xPosition : d3.axisBottom,
		yPosition: opts.axes.yPosition ? opts.axes.yPosition : d3.axisLeft,
		xLabel: opts.axes.xLabel ? opts.axes.xLabel : '',
		yLabel: opts.axes.yLabel ? opts.axes.yLabel : ''
	}
	this.dataPoints = opts.dataPoints;
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
   this.markerWidth = 10;
   this.markerHeight = 10;
   this.cRadius = 4;

	this.svg.append("svg:defs")
       .append('svg:marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', this.markerWidth)
        .attr('markerHeight', this.markerHeight)
        .attr('orient', 'auto')
        .append('svg:path')
        // .attr('fill', 'none')
        // .attr('stroke-width', 1)
        // .attr('stroke', '#000')
        .attr('d', 'M0,-5L10,0L0,5');
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

    if(this.dataPoints)this.drawAnnotations();
	// pass in containerSelect, gSelect, scales, dataPoints
}

Line.prototype.drawAnnotations = function(){
	var _this = this;
	this.dataPoints = this.dataPoints.map(d => {
		return {
			point: _this.data[d.index],
			text: d.text
		}
	});
    this.annotations = new Annotation({
    	container: this.container,
    	g: this.g,
    	x: this.x,
    	y: this.y,
    	dataPoints: this.dataPoints,
    	margin: this.margin,
    	markers: {
    		markerWidth: this.markerWidth,
    		markerHeight: this.markerHeight,
    		cRadius: this.cRadius
    	}
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

	this.annotations.resize({
		x: this.x,
		y: this.y
	});
}

Line.prototype.formatData = function(rawData, xParse){
	var _this = this;
	return rawData.map(d => {
		return {
			xKey: xParse(d[_this.xKey]),
			yKey: +d[_this.yKey]
		}
	});
}

module.exports = Line;