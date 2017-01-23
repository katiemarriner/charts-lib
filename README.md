###Create a new line chart

1. Create a new instance of a line
`var SP500 = new Line(element, data, [ opts]);`

###Options (with defaults)
`margin: {top:15,right:15,bottom:15,left:15}`

`width: 600`  selector or number

`height: 400` selector or number or ratio equation

`xKey: 'time'` string

`yKey: 'value'` string

`parseTime: d3.timeParse('%d-%b-%y')` See: [D3 time formats](https:github.com/d3/d3-time-format#locale_format)

See: [D3 Axes](https:github.com/d3/d3-axis/blob/master/README.md#axisTop)
`axes: {
    xValue: '' string
    yValue: '' string
    xPosition: d3.axisBottom 
    yPosition: d3.axisLeft see above
}`
See: [Underscore's `_.where()` function](http://underscorejs.org/#where)
By default empty
`aOpts: [
    {
        index: data.length-1,
        text: 'This is an annotation'
    }
]`