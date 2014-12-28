var canvasWidth =  window.innerWidth,
    canvasHeight = window.innerHeight,
    analyser = tsw.context().createAnalyser(),
    sineWave = tsw.osc(400),
    waveHeight = 200,
    noDataPoints = 10,
    freqData = new Uint8Array(analyser.frequencyBinCount),
    lines = [],
    paper,
    totalLines = canvasHeight / 20,
    svgNamespace = "http://www.w3.org/2000/svg";

/**
 * Create SVG element and add to page.
 */
var createSVGElement = function () {
    paper = document.createElementNS(svgNamespace, 'svg');
    paper.setAttribute('width', canvasWidth);
    paper.setAttribute('height', canvasHeight);
    paper.setAttribute('class', 'waves');
    paper.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    document.body.appendChild(paper); 
};

/**
 * Create a single svg line and add to SVG element.
 */
var createLine = function () {
    var oscLine = document.createElementNS(svgNamespace, 'path');

    oscLine.setAttribute('stroke', 'white');
    oscLine.setAttribute('stroke-width', 2);
    oscLine.setAttribute('fill', 'none');
    paper.appendChild(oscLine);

    lines.push(oscLine);
};

/**
 * Update lines with frequency data.
 */
var updateLines = function () {
    var i,
        graphPoints = [],
        graphStr = '',
        freqDataLength,
        point,
        pixelsPerPoint = 0;

    // Get frequency data.
    analyser.getByteTimeDomainData(freqData);

    freqDataLength = freqData.length;

    // Add start point.
    graphPoints.push('M0, ' + (waveHeight / 2));

    pixelsPerPoint = canvasWidth / freqDataLength;

    for (i = 0; i < freqDataLength; i++) {
        if (i % noDataPoints === 0) {
            pointX = i * pixelsPerPoint;
            pointY = (freqData[i] / 128) * (waveHeight / 2);
            graphPoints.push('L' + pointX + ', ' + pointY); 
        }
    }

    // Add end point.
    graphPoints.push('L' + canvasWidth + ', ' + (waveHeight / 2));

    graphPoints.forEach(function (point) {
        graphStr += point;
    });

    lines.forEach(function (line) {
        line.setAttribute('d', graphStr);
    });
};

var createLines = function () {
    for (var i = 0; i < totalLines; i++) {
        createLine();
    }
};

var drawBeach = function () {
    var sand = color(248, 242, 206);
    noStroke();
    fill(sand);
    triangle(0, 0, canvasWidth / 3, 0, 0, canvasHeight);
};

var setup = function () {
    createSVGElement();
    createCanvas(canvasWidth, canvasHeight);
    createLines();
    drawBeach();

    /*
    tsw.load({surfsUp: 'audio/surfin-usa.mp3'}, function (files) {
        var bufferBox = tsw.bufferBox();
        bufferBox.buffer(files.surfsUp);
        console.log(bufferBox.buffer());
        tsw.connect(bufferBox, analyser, tsw.speakers);
        bufferBox.play(tsw.now());
    }, function (error) {
        console.log(error);    
    });
    */

    tsw.getUserAudio(function (stream) {
        tsw.connect(stream, analyser);
    }, function (error) {
        console.log(error);
    });
};

var draw = function () {
    updateLines();
};
