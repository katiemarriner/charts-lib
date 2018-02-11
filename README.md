* [Data formats](#data-formats)
* [Charts](#charts)
    - [Line](#line)
    - [Multiline](#multiline)
    - [Diverging bar chart](#diverging-bar-chart)
* [Start development on this library](#development)

#### Data formats
Terminology is based on the [Pandas `.to_json` function](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.to_json.html)

1. split – `{'index': [index, index, ...], 'columns': [column, column, ...], 'data': [value, value, ...]}`
2. records – `[{column: value}, {column: value}, ...]`
3. index – `{index: {column: value}, index: {column: value}, index: {...}}`
4. columns – `{column: {index: value, index: value, ...}, column: {...}}`
5. values – `[[value, value, ...], [value, value, ...], [...]]`

## Charts
### Line chart
[D3 example](https://bl.ocks.org/mbostock/3883245)

#### Recommended data formats
* records
    - xValue – key
    - yValue – value
* values
    - xValue = column (array) index
    - yValue = column (array) index

#### New instance

1. Create a new instance of a chart
```
var SP500 = new Line(element, data [, opts]);
```

##### Options (`opts`) (with defaults)
```
{
    margin: {top:15,right:15,bottom:15,left:15} //object
    width: 600  //selector or number
    height: 400 selector or number or ratio equation
    xKey: 'time' //string
    yKey: 'value' //string
    parseTime: d3.timeParse('%d-%b-%y') //See: [D3 time formats](https:github.com/d3/d3-time-format#locale_format)
}
```

See: [D3 Axes](https:github.com/d3/d3-axis/blob/master/README.md#axisTop)

```
axes: {
    xValue: '' //string
    yValue: '' //string
    xPosition: d3.axisBottom //see D3 axes link above
    yPosition: d3.axisLeft //see D3 axes link above
}
```

See: [Underscore's _.where() function](http://underscorejs.org/#where)
By default empty
```
aOpts: [
    {
        index: data.length-1,
        text: 'This is an annotation'
    }
]
```

### Multiline chart
[D3 example](https://bl.ocks.org/mbostock/3884955)
#### Recommended data formats


### Diverging stacked bar chart
[D3 example](https://bl.ocks.org/mbostock/b5935342c6d21928111928401e2c8608)
#### Recommended data formats

### Development
#### Install
Run `npm install` to install all the requirements. This project runs on webpack and node.js because...
* it keeps the code modular
* it uses JSHint to find JS errors
* running uglify minifies before production deployment
* it reduces ajax calls by compiling third-party libraries with your script
