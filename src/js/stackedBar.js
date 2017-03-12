var d3 = require('d3');
var Annotation = require('./annotations.js');
var _ = require('underscore');

var StackedBar = function(element, data, opts){
	this.element = element;
	this.margin = opts.margin || {top: 15, right: 15, bottom: 15, left: 15};
	this.width = opts.width || 600;
	this.height = opts.height || 400;
	this.parseTime = opts.parseTime || d3.timeParse('%d-%b-%y');
	this.xKey = opts.xKey || 'time';
	this.yKey = opts.yKey || 'value';
	this.keys = opts.keys || null;
	this.axes = opts.axes || {};
		this.axes.xPosition = this.axes.xPosition || d3.axisBottom;
		this.axes.yPosition = this.axes.yPosition || d3.axisLeft;
		this.axes.xLabel = this.axes.xLabel || '';
		this.axes.yLabel = this.axes.yLabel || '';
	this.dataPoints = opts.dataPoints || [];
	this.rowKey = opts.rowKey;
	this.data = data;
	// this.dataPoints = opts.dataPoints;
};

StackedBar.prototype.init = function(){
	var _this = this;
	var margin = this.margin;

	this.container = d3.select(this.element);
	this.svg = this.container.append('svg')
		.attr('width', (this.width - margin.left - margin.right))
		.attr('height', (this.height - margin.top - margin.bottom));
	this.g = this.svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// this.assets();
	this.createScales();
};

StackedBar.prototype.stackMax = function(serie){
	  return d3.max(serie, function(d) { return d[1]; });
}

StackedBar.prototype.stackMin = function(serie){
	  return d3.min(serie, function(d) { return d[0]; });
}

StackedBar.prototype.stackOffsetDiverging = function(series, order){
	if (!((n = series.length) > 1)) return;
  for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
    for (yp = yn = 0, i = 0; i < n; ++i) {
      if ((dy = (d = series[order[i]][j])[1] - d[0]) >= 0) {
        d[0] = yp, d[1] = yp += dy;
      } else if (dy < 0) {
        d[1] = yn, d[0] = yn += dy;
      } else {
        d[0] = yp;
      }
    }
  }
}

StackedBar.prototype.createScales = function(){
	var _this = this;

	this.series = d3.stack()
    .keys(this.keys)
    .offset(this.stackOffsetDiverging)
    (this.data);

	this.x = d3.scaleLinear()
	   .rangeRound([0, this.width]);
  this.y = d3.scaleBand()
	   .rangeRound([0, this.height])
	   .paddingInner(0.05)
	   .align(0.1);
	this.z = d3.scaleOrdinal(d3.schemeCategory10);

	// the keys are the column headers, which is the first row in a csv when loaded in by d3.csv();


	this.x.domain([d3.min(this.series, this.stackMin), d3.max(this.series, this.stackMax)]);
	this.y.domain(this.data.map(function(d) {
		return d[_this.rowKey];
	}));
	this.z.domain(this.keys);
  
  this.createAxes();
	this.drawBars();
	// this.createLegend();

};

StackedBar.prototype.createAxes = function(){
	var m = this.margin;

	this.xAxis = this.svg.append('g')
	    .attr('transform', 'translate(0,' + this.height + ')')
	    .call(d3.axisBottom(this.x));

	this.yAxis = this.svg.append('g')
	    .attr('transform', 'translate(' + m.left + ',0)')
	    .call(d3.axisLeft(this.y));
}

StackedBar.prototype.drawBars = function(){
	var _this = this;

	this.g = this.svg.append('g')
	  .selectAll('g')
	  .data(this.series)
	  .enter().append('g')
	    .attr('fill', function(d) { return _this.z(d.key); })
	  .selectAll('rect')
	  .data(function(d) { return d; })
	  .enter().append('rect')
	    .attr('height', this.y.bandwidth)
	    .attr('y', function(d) {
	    	return _this.y(d.data.month);
	    })
	    .attr('x', function(d) { return _this.x(d[0]); }) // changed to d[0] from d[1]
	    .attr('width', function(d) { return _this.x(d[1]) - _this.x(d[0]); }); // reversed order of d[0] and d[1]
   // if(this.dataPoints)this.drawAnnotations();
};

StackedBar.prototype.drawAnnotations = function(){
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
};

StackedBar.prototype.createLegend = function(){
		  var legend = g.append('g')
	      .attr('font-family', 'sans-serif')
	      .attr('font-size', 10)
	      .attr('text-anchor', 'end')
	    .selectAll('g')
	    .data(keys.slice().reverse())
	    .enter().append('g')
	      .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

	  legend.append('rect')
	      .attr('x', width - 19)
	      .attr('width', 19)
	      .attr('height', 19)
	      .attr('fill', z);

	  legend.append('text')
	      .attr('x', width - 24)
	      .attr('y', 9.5)
	      .attr('dy', '0.32em')
	      .text(function(d) { return d; });
};

StackedBar.prototype.resize = function(newOpts){
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


StackedBar.prototype.formatData = function(error, data){
	StackedBar.data = data;
}

module.exports = StackedBar;