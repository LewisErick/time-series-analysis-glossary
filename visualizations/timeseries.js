// Data obtained from Jupyter notebook.
// Imported via data.

function getStationaryData() {
    return stationarySeries;
}

function getStationaryRollingMean() {
    return stationarySeriesRollingMean;
}

function getStationaryRollingStddev() {
    return stationarySeriesRollingStddev;
}

function getStationaryCovariance() {
    return stationarySeriesCov;
}

function applyLog(data) {
    var log_data = [];
    for (let index = 0; index < data.length; index++) {
        const val = data[index];
        
        log_data.push({
            x: val.x,
            y: Math.log(val.y)
        });
    }
    return log_data;
}

function exponentialDecay(values, halfLife) {
    var decayed_values = [];
    var life = 0;
    for (let index = 0; index < values.length; index++) {
        const val = values[index];
        
        var x = val.x;
        var y = val.y;

        var decay = 1 - Math.exp(Math.log(0.5)/life);
        life += halfLife / values.length; 

        decayed_values.push({x: x, y: y * decay});
    }
    console.log(decayed_values);
    return decayed_values;
}

function subtractRollingMean(data, rollingMeans) {
    result_data = [];
    for (let index = 0; index < data.length; index++) {
        const val = data[index];
        const rollingMean = rollingMeans[index];
        if (isNaN(rollingMean)) {
            result_data.push(val);
        } else {
            result.data.push({
                x: val.x,
                y: val.y - rollingMean
            });
        }
    }
    return result_data;
}

function timeShift(data) {
    shiftedValues = [];
    for (let index = 1; index < data.length; index--) {
        const element1 = data[index].y - 1;
        const element2 = data[index].y;
        shiftedValues.push({
            x: data[index].x, 
            y: element2-element1
        });
    }
    return shiftedValues;
}

function getMovingData(func) {
    var data = movingSeries;
    if (func == "log") {
        data = applyLog(data);
    } else if (func == "exp_decay") {
        data = exponentialDecay(/* values */data, /* halfLife */12);
    } else if (func == "sub_rolling_mean") {
        data = subtractRollingMean(data, movingSeriesRollingMean);
    } else if (func == "time shifting") {
        data = timeShift(data);
    }
    return data;
}

function getMovingRollingMean() {
    return movingSeriesRollingMean;
}

function getMovingRollingStddev() {
    return movingSeriesRollingStddev;
}

function getMovingCovariance() {
    return movingSeriesCov;
}


var w = 800;
var h = 500;

// variables and setting up the svg element
var margin = {top: 20, right: 20, bottom: 100, left: 100},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

stationaryWidth = width/2;
movingWidth = width/2;

/* STATIONARY TIME-SERIES SVG START */

var x = d3.scale.linear()
        .range([0, stationaryWidth]);

var y = d3.scale.linear()
        .range([height, 0]);

var mySVG = d3.select("#graph-div")
        .append("svg")
        .attr("width", stationaryWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var background =
    mySVG.append("rect")
        .attr("width", stationaryWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("fill-opacity", "0")
        .attr("fill", "white")
        .on("mousemove", point)
        .on("mouseover", over)
        .on("mouseleave", leave)
        .on("click", click);

var myLine = mySVG.append("path");
var myLine2 = mySVG.append("path");
var myLine3 = mySVG.append("path");
var circle = mySVG.append("circle")
                .attr("r", 4)
                .attr("fill", "rgb(205,23,25)")
                .style("opacity", "0")
                .attr("pointer-events", "none")
                .attr("stroke-width", "2.5")
                .attr("stroke", "white");

var yaxislabel = mySVG.append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 0 - margin.left)
                      .attr("x",0 - (height / 2))
                      .attr("dy", "1em")
                      .style("text-anchor", "middle");

var titleSVG = mySVG.append("text")
        .attr("x", stationaryWidth / 2)
        .attr("y",  0)
        .style("text-anchor", "middle");

var tooltipX = mySVG.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", "0");
        
var tooltipY = mySVG.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", "0");

var xlabelaxis = mySVG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height/2 + ")") //sets the vertical axis in the middle;

var ylabelaxis = mySVG.append("g")
    .attr("class", "y axis");

var xaxislabel = mySVG.append("text")             
                      .attr("transform",
                            "translate(" + (stationaryWidth / 2) + " ," + 
                                           (height + margin.top + 20) + ")")
                      .style("text-anchor", "middle")
                      .text("Date");

/* STATIONARY TIME-SERIES SVG END */

/* MOVING TIME-SERIES SVG START */

var xMoving = d3.scale.linear()
        .range([0, movingWidth]);

var yMoving = d3.scale.linear()
        .range([height, 0]);

var svgMoving = d3.select("#graph-div")
                  .append("svg")
                  .attr("width", movingWidth + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + (margin.left + stationaryWidth) + "," + margin.top + ")");

var backgroundMoving =
    svgMoving.append("rect")
             .attr("width", movingWidth + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .attr("fill-opacity", "0")
             .attr("fill", "white");
            //  .on("mousemove", pointMoving)
            //  .on("mouseover", overMoving)
            //  .on("mouseleave", leaveMoving)
            //  .on("click", clickMoving);

// mv -> moving
var mvLine = svgMoving.append("path");
var mvLine2 = svgMoving.append("path");
var mvLine3 = svgMoving.append("path");
var mvCircle = svgMoving.append("circle")
                    .attr("r", 4)
                    .attr("fill", "rgb(205,23,25)")
                    .style("opacity", "0")
                    .attr("pointer-events", "none")
                    .attr("stroke-width", "2.5")
                    .attr("stroke", "white");

var mvYaxislabel = svgMoving.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - margin.left)
                        .attr("x",0 - (height / 2))
                        .attr("dy", "1em")
                        .style("text-anchor", "middle");

var mvTitleSVG = svgMoving.append("text")
                      .attr("x", movingWidth / 2)
                      .attr("y",  0)
                      .style("text-anchor", "middle");

var mvTooltipX = svgMoving.append("text")
                      .attr("x", 0)
                      .attr("y", 0)
                      .style("opacity", "0");
        
var mvTooltipY = svgMoving.append("text")
                            .attr("x", 0)
                            .attr("y", 0)
                            .style("opacity", "0");

var mvXLabelaxis = svgMoving.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height/2 + ")") //sets the vertical axis in the middle;

var mvYLabelaxis = svgMoving.append("g")
    .attr("class", "y axis");

var mvXAxislabel = svgMoving.append("text")             
                      .attr("transform",
                            "translate(" + (movingWidth / 2) + " ," + 
                                           (height + margin.top + 20) + ")")
                      .style("text-anchor", "middle")
                      .text("Date");

/* STATIONARY TIME-SERIES SVG END */

function point(){
    var pathEl = myLine.node();
    var pathLength = pathEl.getTotalLength();

    var _x = d3.mouse(this)[0];
    var beginning = _x , end = pathLength, target;
    while (true) {
        target = Math.floor((beginning + end) / 2);
        pos = pathEl.getPointAtLength(target);

        if ((target === end || target === beginning) && pos.x !== _x) {
            break;
        }
        if (pos.x > _x){
            end = target;
        }else if(pos.x < _x){
            beginning = target;
        }else{
            break; //position found
        }
    }
    
    // Update tooltip position and values.
    tooltipX.attr("y", pos.y - 16);
    tooltipX.attr("x", pos.x + 16);
    idx = Math.round((pos.x / stationaryWidth) * xValues.length);
    tooltipX.text("x: " + xValues[idx].toFixed(4));
    
    tooltipY.attr("y", pos.y);
    tooltipY.attr("x", pos.x + 16);
    idx = Math.round((pos.x / stationaryWidth) * xValues.length);
    tooltipY.text("y: " + yValues[idx].toFixed(4));
    
    circle
    .attr("opacity", 1)
    .attr("cx", _x)
    .attr("cy", pos.y);
}

var currentFunction = "normal";

function updateValues(func) {
    xValues = xAxisValues(func);
    yValues = yAxisValues(func);
}

function yAxisValues(func)
{ 
    var answer = [];
    var answer_data = getStationaryData(func);
    answer_data.forEach(function(d) {
        answer.push(+d.y);
    })
    return answer;
};

function xAxisValues(func)
{
    var answer = [];
    var answer_data = getStationaryData(func);
    answer_data.forEach(function(d) {
        answer.push(+d.x);
    })
    return answer;
};

var freq = 1;

function click() {
    // Update the function to display.
    var _x = d3.mouse(this)[0];
    updateValues(_x, currentFunction);
    plotLine(xValues, yValues);
}

function over(){
    circle.transition().duration(200).style("opacity", "1");
    tooltipX.style("opacity", "1");
    tooltipY.style("opacity", "1");
}
function leave(){
    circle.transition().duration(200).style("opacity", "0");
    tooltipX.style("opacity", "0");
    tooltipY.style("opacity", "0");
}

var plotstart = -3, 
    stepsize = 0.012, // in use in this script
    plotrange_real = 3,
    plotrange = plotrange_real + stepsize; // adjusted for the "range" method using stepsize as a 3rd parameter

var yValues, xValues; // declares the values



xValues = [];
yValues = [];
updateValues(currentFunction);

function plotGraph(newXValues, newYValues) {
    var title;
    title = "Stationary Time-Series of Births";
    yaxislabel.text("Days");
    xaxislabel.text("Births");

    titleSVG
        .transition().duration(1000)
        .text(title);

    var rangeX = [d3.min(newXValues), d3.max(newXValues)];
    var rangeY = [d3.min(newYValues), d3.max(newYValues)];

    // now need to put both xValues and yValues in the same object to be able to send them to the "line" above in a method we will create below:
    var ourValues = [];

    newXValues.forEach( function (item, index) {     
        ourValues.push( { x: newXValues[index], y: newYValues[index] });   
    });

    //appends the axis to what doesn't exist yet
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");

    //Make the axis, have defined x and y at the top already
    x.domain([d3.min(ourValues, function(d) 
    { 
        return d.x; 
        
    }), d3.max(ourValues, function(d) 
    { 
        return d.x; 
    })]);


    // y goes from a negative to a positive value
    y.domain([d3.min(ourValues, function(d) 
        {
            return d.y; 
            
    }), d3.max(ourValues, function(d)
        { 
            return d.y;
        }
    )]);

    //The axis and some labels - apparenly there comes some default values from 0.0-1.0 when the axis are added without binding them to some values
    xlabelaxis
        .transition().duration(1000)
        .call(xAxis)

    
    ylabelaxis
        .transition().duration(1000)
        .call(yAxis)

    return [rangeX, rangeY];
}

function plotLine(newXValues, newYValues, color, lineSVG, rangeX, rangeY) {
    console.log(rangeX);
    console.log(rangeY);
    // create the domain for the values
    // scale the data to fit in our svg
    var scaleX = d3.scale.linear()
        .domain(rangeX)
        .range([0, stationaryWidth]);

    var scaleY = d3.scale.linear()
        .domain(rangeY)
        .range([height, 0]); //remember the order of this one! otherwise you'll get an opposite sinus curve

    // picks out the data for the line
    var line = d3.svg.line()
        .x(function(d) { return scaleX(d.x); }) //we define x and y in the foreach function below (a little unorderly yes, admitted)
        .y(function(d) { return scaleY(d.y); });

    // now need to put both xValues and yValues in the same object to be able to send them to the "line" above in a method we will create below:
    var ourValues = [];

    newXValues.forEach( function (item, index) {   
        if (!isNaN(newYValues[index])) {
            ourValues.push( { x: newXValues[index], y: newYValues[index] });   
        }
    });

    console.log("Our values", ourValues);

    // now puts the data into the line function
    // creates the line
    lineSVG
        .attr("class", "line")
        .datum(ourValues)
        .attr("stroke", function (d) {return color;})
        .transition().duration(1000)
        .attr("d", line);
    
    return [scaleX, scaleY];
}

var rollingMeanValues = getStationaryRollingMean();
var rollingMeanX = [];
for (const idx in rollingMeanValues) {
    let val = rollingMeanValues[idx];
    rollingMeanX.push(val.x);
}
var rollingMeanY = [];
for (const idx in rollingMeanValues) {
    let val = rollingMeanValues[idx];
    rollingMeanY.push(val.y);
}

var rollingStddevValues = getStationaryRollingStddev();
var rollingStddevX = [];
for (const idx in rollingStddevValues) {
    let val = rollingStddevValues[idx];
    rollingStddevX.push(val.x);
}
var rollingStddevY = [];
for (const idx in rollingStddevValues) {
    let val = rollingStddevValues[idx];
    rollingStddevY.push(val.y);
}

// TODO(LewisErick): Find a better way to unify input to identify x and y axis
var allX = [];
allX = allX.concat(xValues, rollingMeanX, rollingStddevX);

var allY = [];
allY = allY.concat(yValues, rollingMeanY, rollingStddevY);

var ranges = plotGraph(allX, allY);

// Plot lines.
plotLine(xValues, yValues, "red", myLine, ranges[0], ranges[1]);
plotLine(rollingMeanX, rollingMeanY, "blue", myLine2, ranges[0], ranges[1]);
plotLine(rollingStddevX, rollingStddevY, "green", myLine3, ranges[0], ranges[1]);