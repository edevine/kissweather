import * as d3 from 'd3';
import * as units from 'units';

const margins = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 40,
}
const width = 400;
const height = 300;

export function drawHourly(chart: SVGSVGElement, conditions: HourlyConditions[]) {
    
    let temps = conditions.map(conditions => units.toFahrenheit(conditions.temp));
    let minTemp = Math.min(...temps);
    let maxTemp = Math.max(...temps);
    let tempMargin = (maxTemp - minTemp) / 8;
    
    let xScale = d3.time.scale()
        .range([margins.left, width - margins.right])
        .domain([new Date(conditions[0].time * 1000), new Date(conditions[7].time * 1000)]);
        
    let yScale = d3.scale.linear()
        .range([height - margins.bottom, margins.top])
        .domain([minTemp - tempMargin, maxTemp + tempMargin]);
    let xAxis = d3.svg.axis().scale(xScale);
    let yAxis = d3.svg.axis().scale(yScale).orient("left");
    
    let toLine = d3.svg.line<HourlyConditions>()
        .x((conditions, i) => xScale(new Date(conditions.time * 1000)))
        .y(conditions => yScale(units.toFahrenheit(conditions.temp)))
        .interpolate("basis");
    
    let vis = d3.select(chart)
    
    vis.html('');
    
    vis.append('g')
        .classed('axis', true)
        .attr('transform', 'translate(0,' + (height - margins.bottom) + ')')
        .call(xAxis);
        
    vis.append('g')
        .classed('axis', true)
        .attr('transform', 'translate(' + (margins.left) + ',0)')
        .call(yAxis);
        
    vis.append('path')
        .classed('temp', true)
        .attr('d', toLine(conditions));
}