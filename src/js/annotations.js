/*Things required for an annotation
	1. A data pointObj.point (hardcoded or programmatic)
	2. Text for that data point
	3. The position of the data point based on the data
	4. all of this without svg in order to have a more flexible template
*/

var swoopyArrow = require('./swoopy-arrow.js');
var Annotation = function(opts){
	// console.log(data, svg, scales);
	var markers = opts.markers;

	var swoopy = swoopyArrow()
		  .angle(Math.PI/4)
		  .x(function(d) { return d[0] - markers.cRadius; })
		  .y(function(d) { return d[1] + markers.cRadius; });

	opts.dataPoints.forEach((pointObj, index) => {
		opts.g.append('g')
			.attr('transform', 'translate(' + markers.markerWidth + ',' + markers.markerHeight + ')')
		.append('path')
		  .attr('marker-end', 'url(#arrowhead)')
		  .datum([
		  	[opts.xScale(pointObj.point.xKey)+15,opts.yScale(pointObj.point.yKey)+15],
		  	[opts.xScale(pointObj.point.xKey),opts.yScale(pointObj.point.yKey)]
		  ])
		  .attr('class', function(d){
		  	return 'annotation-arrow arrow' + index;
		  })
		  .attr('d', swoopy);

		opts.g.append('g')
			.append('circle')
			.attr('cx', opts.xScale(pointObj.point.xKey))
			.attr('cy', opts.yScale(pointObj.point.yKey))
			.attr('r', markers.cRadius);

		var textOffset = opts.g.select('.annotation-arrow.arrow' + index).data()[0][1];
		textOffset[0] = textOffset[0] + 15;
		textOffset[1] = textOffset[1] + 15;


		opts.container.append('div')
			.attr('class', 'annotation-text')
			.style('left', textOffset[0] + (opts.margin.left + opts.markers.markerWidth) + 'px')
			.style('top', textOffset[1] + (opts.margin.top + opts.markers.markerHeight) + 'px')
			.html(pointObj.text);
	});
	
}

module.exports = Annotation;