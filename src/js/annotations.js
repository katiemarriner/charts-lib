var swoopyArrow = require('./swoopy-arrow.js');
var Annotation = function(opts){
	// console.log(data, svg, s);
	this.container = opts.container
    this.g = opts.g;
    this.x = opts.x;
    this.y = opts.y;
    this.margin = opts.margin;
    this.markers  = opts.markers;
    this.dataPoints = opts.dataPoints;

	this.pointAttrs = opts.dataPoints.map(this.draw, this);
	
}

Annotation.prototype.draw = function(pointObj, index){
	var markers = this.markers;
	var margin = this.margin;

	var oneAnnotation = {};
	oneAnnotation['xKey'] = pointObj.point.xKey;
	oneAnnotation['yKey'] = pointObj.point.yKey;

	oneAnnotation.swoopy = swoopyArrow()
		  .angle(Math.PI/4)
		  .x(function(d) { return d[0] - markers.cRadius; })
		  .y(function(d) { return d[1] + markers.cRadius; });

	oneAnnotation.pathGroup = this.g.append('g')
		.attr('transform', 'translate(' + markers.markerWidth + ',' + markers.markerHeight + ')')
	
	oneAnnotation.path = oneAnnotation.pathGroup.append('path')
	  .attr('marker-end', 'url(#arrowhead)')
	  .attr('class', function(d){
	  	return 'annotation-arrow arrow' + 'a' + index;
	  })

  	oneAnnotation.drawLine = oneAnnotation.path
  	.datum([
  		[this.x(pointObj.point.xKey)+15,this.y(pointObj.point.yKey)+15],
  		[this.x(pointObj.point.xKey),this.y(pointObj.point.yKey)]
  	])
  	.attr('d', oneAnnotation.swoopy);

	oneAnnotation.pathCircle = this.g
		.append('circle')
		.attr('r', markers.cRadius);

	oneAnnotation.pathCircle
		.attr('cx', this.x(pointObj.point.xKey))
		.attr('cy', this.y(pointObj.point.yKey));
		


	oneAnnotation.textOffset = oneAnnotation.path.data()[0][1];
	oneAnnotation.textOffset[0] = oneAnnotation.textOffset[0] + 15;
	oneAnnotation.textOffset[1] = oneAnnotation.textOffset[1] + 15;


	oneAnnotation.htmlOverlay = this.container.append('div')
		.attr('class', 'annotation-text')
		.html(pointObj.text);
		
	oneAnnotation.htmlOverlay
		.style('left', oneAnnotation.textOffset[0] + (margin.left + markers.markerWidth) + 'px')
		.style('top', oneAnnotation.textOffset[1] + (margin.top + markers.markerHeight) + 'px');

	return oneAnnotation;
}

Annotation.prototype.resize = function(newOpts){
	this.x = newOpts.x;
	this.y = newOpts.y;

	this.pointAttrs = this.pointAttrs.map(this.redraw, this);
}

Annotation.prototype.redraw = function(pointObj, index){
	var markers = this.markers;
	var margin = this.margin;
	var item = this.pointAttrs[index];

	item.textOffset = item.path.data()[0][1];
	item.textOffset[0] = item.textOffset[0] + 15;
	item.textOffset[1] = item.textOffset[1] + 15;

	item.drawLine
	  .datum([
	  	[this.x(item.xKey)+15,this.y(item.yKey)+15],
	  	[this.x(item.xKey),this.y(item.yKey)]
	  ])	 
	  .attr('d', item.swoopy);

	 item.pathCircle
	 	.attr('cx', this.x(item.xKey))
		.attr('cy', this.y(item.yKey));

	item.htmlOverlay
		.style('left', item.textOffset[0] + (margin.left + markers.markerWidth) + 'px')
		.style('top', item.textOffset[1] + (margin.top + markers.markerHeight) + 'px');

	return item;
}

module.exports = Annotation;