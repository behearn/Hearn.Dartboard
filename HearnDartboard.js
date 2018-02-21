//Hearn.Dartboard (c) 2018 Brian Hearn

function createDartboard(canvasId, settings) {

    var canvas = document.getElementById(canvasId);

    if (canvas == null) {
        throw "canvas with the id '" + canvasId + "' not found";
    }

    var stage = new createjs.Stage(canvas);

    var defaultSettings = {

        //Dimensions of canvas
        width: 600,
        height: 600,

        //Font for number ring
        fontFamily: "sans-serif",
        fontSize: 30,
        number: "silver",

        //Default colour scheme for segments
        darkSingle: "black",
        darkRing: "red",
        lightSingle: "cornsilk",
        lightRing: "darkgreen",

        //Wire info
        wire: "gold",
        wireWidth: 3,

        //proportion of board radius each segment takes up
        sizeOfDouble: 0.1,
        sizeOfOuterSingle: 0.275,
        sizeOfTreble: 0.1,
        sizeOfInnerSingle: 0.375,
        sizeOfOuterBull: 0.09,
        sizeOfInnerBull: 0.06
        //sum of above == 1
    };

    //Merge the defaultSettings into settings
    var settings = settings || {};
    var keys = Object.keys(defaultSettings);
    for (var i = 0; i < keys.length; i++) {
        settings[keys[i]] = settings[keys[i]] || defaultSettings[keys[i]];
    }

    //centre co-ords
    var x = settings.width / 2;
    var y = settings.height / 2;

    //dartboard is drawn as a percentage of the radius
    var radius = x * .85;
    var numberRadius = x * .93;

    var offset = (-11 / 40) * (2 * Math.PI); //Take it back 1/4 (-10/40) then another 1/2 of a turn (-1/40)

    var startAngle = 0 + offset; //Note : 0 radians is at the 3 o'clock position
    var radians = (1 / 10) * Math.PI; //PI = half a circle therefore this is 1/20 of 2xPI (ie. 18 degrees)
    var endAngle = startAngle + radians;

    var boardCiricle = createBoard();
    stage.addChild(boardCiricle);

    var wireRadius = getWireRadius(settings);

    var segments = [{
        double: createSegment(wireRadius[5], wireRadius[4], settings.darkRing),
        outerSingle: createSegment(wireRadius[4], wireRadius[3], settings.darkSingle),
        treble: createSegment(wireRadius[3], wireRadius[2], settings.darkRing),
        innerSingle: createSegment(wireRadius[2], wireRadius[1], settings.darkSingle),
    }, {
        double: createSegment(wireRadius[5], wireRadius[4], settings.lightRing),
        outerSingle: createSegment(wireRadius[4], wireRadius[3], settings.lightSingle),
        treble: createSegment(wireRadius[3], wireRadius[2], settings.lightRing),
        innerSingle: createSegment(wireRadius[2], wireRadius[1], settings.lightSingle),
    }];
    
    var numbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

    for (var i = 0; i < numbers.length; i++) {
        (function() {
            var score = numbers[i];

            var s = i % 2;

            var rotation = 18 * i;

            var doubleSegment = segments[s].double.clone();
            doubleSegment.rotation = rotation;

            var outerSingleSegment = segments[s].outerSingle.clone();
            outerSingleSegment.rotation = rotation;

            var trebleSegment = segments[s].treble.clone();
            trebleSegment.rotation = rotation;

            var innerSingleSegment = segments[s].innerSingle.clone();
            innerSingleSegment.rotation = rotation;

            var numberText = new createjs.Text(score, settings.fontSize + "px " + settings.fontFamily, settings.number);
            numberText.textAlign = "center";
            numberText.textBaseline = "middle";
            numberText.x = x;
            numberText.y = y;
            numberText.regY = numberRadius;
            numberText.rotation = rotation;

            stage.addChild(doubleSegment, outerSingleSegment, trebleSegment, innerSingleSegment, numberText);

            if (settings.clickHandler) {
                    doubleSegment.addEventListener("click", function() { settings.clickHandler(2 * score); });
                    outerSingleSegment.addEventListener("click", function() { settings.clickHandler(score); }); 
                    trebleSegment.addEventListener("click", function() { settings.clickHandler(3 * score); }); 
                    innerSingleSegment.addEventListener("click", function() { settings.clickHandler(score); });    
            }
        })();
    }

    var outerBull = createBull(wireRadius[1], settings.lightRing);
    var innerBull = createBull(wireRadius[0], settings.darkRing);
    
    if (settings.clickHandler) {
        outerBull.addEventListener("click", function() { settings.clickHandler(25); });
        innerBull.addEventListener("click", function() { settings.clickHandler(50); });    
    }

    stage.addChild(outerBull, innerBull);

    var highlight = createBoardHighligt();
    stage.addChild(highlight);

    stage.update();

    function createBoard() {

        var g = new createjs.Graphics();
        g.beginFill("#000000");
        g.drawCircle(x, y, x);

        var boardCiricle = new createjs.Shape(g);
        
        return boardCiricle;

    }

    function createBull(outerWire, colour) {

        var outer = radius * outerWire;

        var g = new createjs.Graphics();
        g.setStrokeStyle(settings.wireWidth);
        g.beginStroke(settings.wire)
        g.beginFill(colour)
        g.drawCircle(x, y, outer)

        var shape = new createjs.Shape(g);

        return shape;

    }

    function createSegment(outerWire, innerWire, colour) {

        var outer = radius * outerWire;
        var inner = radius * innerWire;

        var g = new createjs.Graphics();
        g.setStrokeStyle(settings.wireWidth);
        g.beginStroke(settings.wire)
        g.beginFill(colour)
        g.arc(0, 0, outer, startAngle, endAngle, false);
        g.arc(0, 0, inner, endAngle, startAngle, true);
        g.closePath();

        var shape = new createjs.Shape(g);

        shape.x = x;
        shape.y = y;

        return shape;

    }

    function createBoardHighligt() {

        var offset = -.15;
        var widthRatio = 0.98;

        var startAngle = Math.PI - offset;
        var endAngle = 0 + offset;

        var endX = (x * widthRatio) * Math.cos(endAngle);
        var endY = (x * widthRatio) * Math.sin(endAngle);

        var g = new createjs.Graphics();
        g.beginLinearGradientFill(["#333333", "#ffffff"], [0, 1], 0, -x, 0, 0);
        g.arc(0, 0, x * widthRatio, startAngle, endAngle, false);
        g.quadraticCurveTo(0, 100, -endX, endY);
        g.closePath();

        var highlight = new createjs.Shape(g);

        highlight.alpha = 0.1;

        highlight.x = x;
        highlight.y = y;

        return highlight;

    }

    function getWireRadius(settings) {
        var sizeOrder = [settings.sizeOfInnerBull, settings.sizeOfOuterBull, settings.sizeOfInnerSingle,
                        settings.sizeOfTreble, settings.sizeOfOuterSingle, settings.sizeOfDouble];
        wireRadius = [];
        for (wireNo = 1; wireNo <= 6; wireNo++) {
            var radius = 0;
            for (i = 0; i < wireNo; i++) {
                radius += sizeOrder[i];
            }
            wireRadius.push(radius);
        }
        return wireRadius;
    }

}