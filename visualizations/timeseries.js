var w = 800;
var h = 500;


// variables and setting up the svg element
var margin = {top: 20, right: 20, bottom: 100, left: 100},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

var x = d3.scale.linear()
        .range([0, width]);

var y = d3.scale.linear()
        .range([height, 0]);

// the svg element
var mySVG = d3.select("#graph-div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var background =
    mySVG.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("fill-opacity", "0")
        .attr("fill", "white")
        .on("mousemove", point)
        .on("mouseover", over)
        .on("mouseleave", leave)
        .on("click", click);

var myLine = mySVG.append("path");
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
        .attr("x", width / 2)
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
                            "translate(" + (width/2) + " ," + 
                                           (height + margin.top + 20) + ")")
                      .style("text-anchor", "middle")
                      .text("Date");

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
    idx = Math.round((pos.x / width) * xValues.length);
    tooltipX.text("x: " + xValues[idx].toFixed(4));
    
    tooltipY.attr("y", pos.y);
    tooltipY.attr("x", pos.x + 16);
    idx = Math.round((pos.x / width) * xValues.length);
    tooltipY.text("y: " + yValues[idx].toFixed(4));
    
    circle
    .attr("opacity", 1)
    .attr("cx", _x)
    .attr("cy", pos.y);
}

var currentFunction = "fft";

function updateYValues(freq) {
    if (currentFunction == "fft") {
        yValues = fftFunction(plotstart, plotrange, stepsize);
    } else if (currentFunction == "integrand") {
        yValues = integrandFunction(plotstart, plotrange, stepsize, freq);
    } else if (currentFunction == "original") {
        yValues = originalFunction(plotstart, plotrange, stepsize);
    }
    xValues = xAxisValues(plotstart, plotrange, stepsize);
}

var freq = 1;

function click() {
    // Update the function to display.
    if (currentFunction == "fft") {
        var _x = d3.mouse(this)[0];
        freq = Math.round((_x/width)*50);
        currentFunction = "integrand";
    } else if (currentFunction == "integrand") {
        currentFunction = "original";
    } else {
        currentFunction = "fft";
    }
    updateYValues(freq);
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

function fftFunction(startinput, stopinput, steprange)
{ 
    var answer = [];
    var answer_data = [{'x': 0.0, 'y': 1.6783729961389328e-13}, {'x': 1.0, 'y': 1.5487235825058293e-12}, {'x': 2.0, 'y': 2.4389963324822062e-11}, {'x': 3.0, 'y': 3.2833748081490455e-10}, {'x': 4.0, 'y': 3.7710754974927514e-09}, {'x': 5.0, 'y': 3.6951064802241215e-08}, {'x': 6.0, 'y': 3.088921317365515e-07}, {'x': 7.0, 'y': 2.2029507148913913e-06}, {'x': 8.0, 'y': 1.340357890053119e-05}, {'x': 9.000000000000002, 'y': 6.957525818527252e-05}, {'x': 10.0, 'y': 0.0003081108099644676}, {'x': 11.0, 'y': 0.0011640646536165867}, {'x': 12.0, 'y': 0.003752021569635216}, {'x': 13.000000000000002, 'y': 0.010317431830553593}, {'x': 14.0, 'y': 0.024204490615861916}, {'x': 15.0, 'y': 0.04844381580166142}, {'x': 16.0, 'y': 0.08271776634259062}, {'x': 17.0, 'y': 0.12049729852701643}, {'x': 18.000000000000004, 'y': 0.1497524305385166}, {'x': 19.0, 'y': 0.1587773345088293}, {'x': 20.0, 'y': 0.14362207318660675}, {'x': 21.0, 'y': 0.11083372601419213}, {'x': 22.0, 'y': 0.07296939295598288}, {'x': 23.0, 'y': 0.040985250190946336}, {'x': 24.0, 'y': 0.019639593989152455}, {'x': 25.0, 'y': 0.008028889441622918}, {'x': 26.000000000000004, 'y': 0.002800248076565688}, {'x': 27.0, 'y': 0.0008332121515333897}, {'x': 28.0, 'y': 0.0002115108935991222}, {'x': 29.0, 'y': 4.580658789363139e-05}, {'x': 30.0, 'y': 8.463328590637672e-06}, {'x': 31.0, 'y': 1.3340512690477326e-06}, {'x': 32.0, 'y': 1.7939977604178526e-07}, {'x': 33.0, 'y': 2.058208280416891e-08}, {'x': 34.0, 'y': 2.0145353345201045e-09}, {'x': 35.0, 'y': 1.6821997883438255e-10}, {'x': 36.00000000000001, 'y': 1.1984242960785684e-11}, {'x': 37.0, 'y': 7.280783051077987e-13}, {'x': 38.0, 'y': 3.803046734047889e-14}, {'x': 39.0, 'y': 1.4274020419254591e-15}, {'x': 40.0, 'y': 3.003438763032575e-16}, {'x': 41.0, 'y': 2.1652123591103134e-16}, {'x': 42.0, 'y': 2.1087689996778625e-16}, {'x': 43.0, 'y': 1.922214095778986e-16}, {'x': 44.0, 'y': 1.862217258768948e-16}, {'x': 45.0, 'y': 1.6956825880925352e-16}, {'x': 46.0, 'y': 1.6789709956343432e-16}, {'x': 47.0, 'y': 1.5191308309458978e-16}, {'x': 48.0, 'y': 1.5685358271094222e-16}, {'x': 49.0, 'y': 1.3367974713977395e-16}, {'x': 50.0, 'y': 1.4364881827966036e-16}, {'x': 51.00000000000001, 'y': 1.2263418317615683e-16}, {'x': 52.00000000000001, 'y': 1.2324857952616539e-16}, {'x': 53.0, 'y': 1.0838496385938315e-16}, {'x': 54.0, 'y': 1.439556441397653e-16}, {'x': 55.0, 'y': 3.9920622240881665e-17}, {'x': 56.0, 'y': 2.231192840714982e-16}, {'x': 57.0, 'y': 7.350018576140709e-17}, {'x': 58.0, 'y': 2.961897031280619e-16}, {'x': 59.00000000000001, 'y': 1.2871335620634406e-16}, {'x': 60.0, 'y': 2.8528247707966126e-16}, {'x': 61.0, 'y': 8.238224308950847e-17}, {'x': 62.0, 'y': 1.8765853642693287e-16}, {'x': 63.0, 'y': 2.1099394739909966e-17}, {'x': 64.0, 'y': 8.903066574801421e-17}, {'x': 65.0, 'y': 7.581715278431592e-17}, {'x': 66.0, 'y': 5.626645918779726e-17}, {'x': 67.0, 'y': 8.273328089998602e-17}, {'x': 68.0, 'y': 5.685233952056547e-17}, {'x': 69.0, 'y': 6.74916720960793e-17}, {'x': 70.0, 'y': 5.292453094258445e-17}, {'x': 71.00000000000001, 'y': 6.49332841660332e-17}, {'x': 72.00000000000001, 'y': 4.105431310810399e-17}, {'x': 73.0, 'y': 6.794825804503309e-17}, {'x': 74.0, 'y': 4.238301780535196e-17}, {'x': 75.0, 'y': 6.192513075132539e-17}, {'x': 76.0, 'y': 4.587503766605676e-17}, {'x': 77.0, 'y': 4.919867921618881e-17}, {'x': 78.0, 'y': 4.1689038353992097e-17}, {'x': 79.0, 'y': 4.538836329325275e-17}, {'x': 80.0, 'y': 3.79636880841148e-17}, {'x': 81.0, 'y': 4.6659667719628054e-17}, {'x': 82.0, 'y': 3.9817917992253647e-17}, {'x': 83.0, 'y': 3.911390455782568e-17}, {'x': 84.0, 'y': 4.998381352898535e-17}, {'x': 85.0, 'y': 3.962439958161728e-17}, {'x': 86.0, 'y': 3.617740898161747e-17}, {'x': 87.00000000000001, 'y': 4.832623010564914e-17}, {'x': 88.0, 'y': 2.0150298559154656e-17}, {'x': 89.0, 'y': 4.920211690962241e-17}, {'x': 90.0, 'y': 2.2130542087872278e-17}, {'x': 91.0, 'y': 4.489074964925129e-17}, {'x': 92.0, 'y': 1.3410781685680881e-17}, {'x': 93.0, 'y': 8.764573915544344e-17}, {'x': 94.0, 'y': 6.605372148922713e-17}, {'x': 95.0, 'y': 1.688182112315088e-16}, {'x': 96.0, 'y': 1.480831284964827e-16}, {'x': 97.0, 'y': 2.1998640496693037e-16}, {'x': 98.0, 'y': 1.6352624513293968e-16}, {'x': 99.0, 'y': 1.9159065474652526e-16}];
    answer_data.forEach(function(d) {
        answer.push(+d.y);
    })
    return answer;
};

function integrandFunction(startinput, stopinput, steprange, freq) 
{ 
    return d3.range(startinput, stopinput, steprange).map(function(i) 
    {
        return Math.exp(-2 * Math.PI * (freq * i)) * (Math.cos(2 * Math.PI * 3 * i) * Math.exp(-Math.PI * i * i));
    });
};

function originalFunction(startinput, stopinput, steprange) 
{ 
    return d3.range(-3, 3, steprange).map(function(i) 
    {
        return (Math.cos(2 * Math.PI * 3 * i) * Math.exp(-Math.PI * i * i));
        
    })
};

function fftXAxisValues() {
    var answer = [];
    var answer_data = [{'x': 0.0, 'y': 1.6783729961389328e-13}, {'x': 1.0, 'y': 1.5487235825058293e-12}, {'x': 2.0, 'y': 2.4389963324822062e-11}, {'x': 3.0, 'y': 3.2833748081490455e-10}, {'x': 4.0, 'y': 3.7710754974927514e-09}, {'x': 5.0, 'y': 3.6951064802241215e-08}, {'x': 6.0, 'y': 3.088921317365515e-07}, {'x': 7.0, 'y': 2.2029507148913913e-06}, {'x': 8.0, 'y': 1.340357890053119e-05}, {'x': 9.000000000000002, 'y': 6.957525818527252e-05}, {'x': 10.0, 'y': 0.0003081108099644676}, {'x': 11.0, 'y': 0.0011640646536165867}, {'x': 12.0, 'y': 0.003752021569635216}, {'x': 13.000000000000002, 'y': 0.010317431830553593}, {'x': 14.0, 'y': 0.024204490615861916}, {'x': 15.0, 'y': 0.04844381580166142}, {'x': 16.0, 'y': 0.08271776634259062}, {'x': 17.0, 'y': 0.12049729852701643}, {'x': 18.000000000000004, 'y': 0.1497524305385166}, {'x': 19.0, 'y': 0.1587773345088293}, {'x': 20.0, 'y': 0.14362207318660675}, {'x': 21.0, 'y': 0.11083372601419213}, {'x': 22.0, 'y': 0.07296939295598288}, {'x': 23.0, 'y': 0.040985250190946336}, {'x': 24.0, 'y': 0.019639593989152455}, {'x': 25.0, 'y': 0.008028889441622918}, {'x': 26.000000000000004, 'y': 0.002800248076565688}, {'x': 27.0, 'y': 0.0008332121515333897}, {'x': 28.0, 'y': 0.0002115108935991222}, {'x': 29.0, 'y': 4.580658789363139e-05}, {'x': 30.0, 'y': 8.463328590637672e-06}, {'x': 31.0, 'y': 1.3340512690477326e-06}, {'x': 32.0, 'y': 1.7939977604178526e-07}, {'x': 33.0, 'y': 2.058208280416891e-08}, {'x': 34.0, 'y': 2.0145353345201045e-09}, {'x': 35.0, 'y': 1.6821997883438255e-10}, {'x': 36.00000000000001, 'y': 1.1984242960785684e-11}, {'x': 37.0, 'y': 7.280783051077987e-13}, {'x': 38.0, 'y': 3.803046734047889e-14}, {'x': 39.0, 'y': 1.4274020419254591e-15}, {'x': 40.0, 'y': 3.003438763032575e-16}, {'x': 41.0, 'y': 2.1652123591103134e-16}, {'x': 42.0, 'y': 2.1087689996778625e-16}, {'x': 43.0, 'y': 1.922214095778986e-16}, {'x': 44.0, 'y': 1.862217258768948e-16}, {'x': 45.0, 'y': 1.6956825880925352e-16}, {'x': 46.0, 'y': 1.6789709956343432e-16}, {'x': 47.0, 'y': 1.5191308309458978e-16}, {'x': 48.0, 'y': 1.5685358271094222e-16}, {'x': 49.0, 'y': 1.3367974713977395e-16}, {'x': 50.0, 'y': 1.4364881827966036e-16}, {'x': 51.00000000000001, 'y': 1.2263418317615683e-16}, {'x': 52.00000000000001, 'y': 1.2324857952616539e-16}, {'x': 53.0, 'y': 1.0838496385938315e-16}, {'x': 54.0, 'y': 1.439556441397653e-16}, {'x': 55.0, 'y': 3.9920622240881665e-17}, {'x': 56.0, 'y': 2.231192840714982e-16}, {'x': 57.0, 'y': 7.350018576140709e-17}, {'x': 58.0, 'y': 2.961897031280619e-16}, {'x': 59.00000000000001, 'y': 1.2871335620634406e-16}, {'x': 60.0, 'y': 2.8528247707966126e-16}, {'x': 61.0, 'y': 8.238224308950847e-17}, {'x': 62.0, 'y': 1.8765853642693287e-16}, {'x': 63.0, 'y': 2.1099394739909966e-17}, {'x': 64.0, 'y': 8.903066574801421e-17}, {'x': 65.0, 'y': 7.581715278431592e-17}, {'x': 66.0, 'y': 5.626645918779726e-17}, {'x': 67.0, 'y': 8.273328089998602e-17}, {'x': 68.0, 'y': 5.685233952056547e-17}, {'x': 69.0, 'y': 6.74916720960793e-17}, {'x': 70.0, 'y': 5.292453094258445e-17}, {'x': 71.00000000000001, 'y': 6.49332841660332e-17}, {'x': 72.00000000000001, 'y': 4.105431310810399e-17}, {'x': 73.0, 'y': 6.794825804503309e-17}, {'x': 74.0, 'y': 4.238301780535196e-17}, {'x': 75.0, 'y': 6.192513075132539e-17}, {'x': 76.0, 'y': 4.587503766605676e-17}, {'x': 77.0, 'y': 4.919867921618881e-17}, {'x': 78.0, 'y': 4.1689038353992097e-17}, {'x': 79.0, 'y': 4.538836329325275e-17}, {'x': 80.0, 'y': 3.79636880841148e-17}, {'x': 81.0, 'y': 4.6659667719628054e-17}, {'x': 82.0, 'y': 3.9817917992253647e-17}, {'x': 83.0, 'y': 3.911390455782568e-17}, {'x': 84.0, 'y': 4.998381352898535e-17}, {'x': 85.0, 'y': 3.962439958161728e-17}, {'x': 86.0, 'y': 3.617740898161747e-17}, {'x': 87.00000000000001, 'y': 4.832623010564914e-17}, {'x': 88.0, 'y': 2.0150298559154656e-17}, {'x': 89.0, 'y': 4.920211690962241e-17}, {'x': 90.0, 'y': 2.2130542087872278e-17}, {'x': 91.0, 'y': 4.489074964925129e-17}, {'x': 92.0, 'y': 1.3410781685680881e-17}, {'x': 93.0, 'y': 8.764573915544344e-17}, {'x': 94.0, 'y': 6.605372148922713e-17}, {'x': 95.0, 'y': 1.688182112315088e-16}, {'x': 96.0, 'y': 1.480831284964827e-16}, {'x': 97.0, 'y': 2.1998640496693037e-16}, {'x': 98.0, 'y': 1.6352624513293968e-16}, {'x': 99.0, 'y': 1.9159065474652526e-16}];
    answer_data.forEach(function(d) {
        answer.push(+d.x);
    })
    return answer;
}

function xAxisValues(startinput, stopinput, steprange) 
{
    if (currentFunction == "fft") {
        return fftXAxisValues();
    } else {
        return d3.range(-3, 3, steprange).map(function(i) 
        {
            return i;
        })
    }
};

xValues = xAxisValues(plotstart, plotrange, stepsize); // the generates x-values
yValues = fftFunction(); //these are the y-values, the up and down of the sinuscurve

function plotLine(newXValues, newYValues) {
    var title;
    if (currentFunction == "fft") {
        title = "Fourier Transform of Original Function";
        yaxislabel.text("FFT value");
        xaxislabel.text("Frequency (Hz)")
    } else if (currentFunction == "integrand") {
        title = "Integrand of FFT with frequency " + freq; 
        yaxislabel.text("Integrand value"); 
        xaxislabel.text("t")
    } else {
        yaxislabel.text("Original function value"); 
        title = "Original Function";
        xaxislabel.text("t")
    }
    titleSVG
        .transition().duration(1000)
        .text(title);

    // create the domain for the values
    // scale the data to fit in our svg
    var scaleX = d3.scale.linear()
        .domain([d3.min(newXValues), d3.max(newXValues)])
        .range([0, width]);

    var scaleY = d3.scale.linear()
        .domain([d3.min(newYValues), d3.max(newYValues)])
        .range([height, 0]); //remember the order of this one! otherwise you'll get an opposite sinus curve

    // picks out the data for the line
    var line = d3.svg.line()
        .x(function(d) { return scaleX(d.x); }) //we define x and y in the foreach function below (a little unorderly yes, admitted)
        .y(function(d) { return scaleY(d.y); });

    // now need to put both xValues and yValues in the same object to be able to send them to the "line" above in a method we will create below:
    var ourValues = [];

    newXValues.forEach( function (item, index) {     
        ourValues.push( { x: newXValues[index], y: newYValues[index] });   
    });

    // now puts the data into the line function
    // creates the line
    myLine
        .attr("class", "line")
        .datum(ourValues)
        .attr("stroke", function (d) {console.log("what is this"); console.log(d); return "red";})
        .transition().duration(1000)
        .attr("d", line);

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
        if (currentFunction ==  "integrand") {
            return (d.y).toExponential()
        }
        return d.y; 
        
    }), 

    d3.max(ourValues, function(d) 
    { 
        if (currentFunction ==  "integrand") {
            return (d.y).toExponential()
        }
        return d.y;
    })]);

    //The axis and some labels - apparenly there comes some default values from 0.0-1.0 when the axis are added without binding them to some values
    xlabelaxis
        .transition().duration(1000)
        .call(xAxis)

    
    ylabelaxis
        .transition().duration(1000)
        .call(yAxis)
}

plotLine(xValues, yValues);