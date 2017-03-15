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
		this.axes.xPosition = this.axes.xPosition ? this.axes.xPosition : d3.axisBottom;
		this.axes.yPosition = this.axes.yPosition ? this.axes.yPosition : d3.axisLeft;
		this.axes.xLabel = this.axes.xLabel ? this.axes.xLabel : '';
		this.axes.yLabel =this.axes.yLabel ? this.axes.yLabel : '';
	this.dataPoints = opts.dataPoints;
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

MultiLine.prototype.assets = function(){
	this.svg.append('svg:defs')
   .append('svg:marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 5)
    .attr('refY', 0)
    .attr('markerWidth', this.markerWidth)
    .attr('markerHeight', this.markerHeight)
    .attr('orient', 'auto')
    .append('svg:path')
	    .attr('fill', '#000')
	    .attr('stroke-width', 1)
	    .attr('stroke', '#000')
    .attr('d', 'M0,-5L10,0L0,5');
	  };

MultiLine.prototype.createScales = function(){
	var _this = this;

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
  this.createAxes();
	this.drawLines();

};

MultiLine.prototype.createAxes = function(){
	this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.axes.xPosition(this.x));

  this.g.append('g')
      .attr('class', 'y-axis')
      .call(this.axes.yPosition(this.y))
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', '#000')
      .text('Temperature, ºF');
}

MultiLine.prototype.drawLines = function(){
	var _this = this;

	this.line = d3.line()
		.x((d) => { return _this.x(d['xKey']); })
    .y((d) => { return _this.y(d['yKey']); });

  this.lineGroups = this.g.selectAll('g.line-group')
    .data(this.data)
    .enter().append('g')
      .attr('class', 'line-group');

  this.lineGroups.append('path')
      .attr('class', 'line')
      .attr('d', (d) => { return _this.line(d.values); })
      .style('stroke', (d) => { return _this.z(d.key); });

   // if(this.dataPoints)this.drawAnnotations();
};

MultiLine.prototype.drawAnnotations = function(){
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

	this.g.select('g.x-axis')
		.attr('transform', 'translate(0,' + this.height + ')')
		.call(this.axes.xPosition(this.x));

	this.g.select('g.y-axis')
		.call(this.axes.yPosition(this.y));

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