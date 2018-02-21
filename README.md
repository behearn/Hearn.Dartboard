# Hearn.Dartboard

Renders a dartboard in a html canvas using createjs.

Dependencies:

```html
<script src="https://code.createjs.com/1.0.0/easeljs.min.js"></script>
```

Simple usage:

```javascript
var id = "canvas"; //ID of <canvas> element
createDartboard(id);
```

Advanced usage:

```javascript

var settings = {

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
    sizeOfInnerBull: 0.06,
    //sum of above == 1

    //Custom click handler function
    clickHandler: function(score) {
        console.log(score);
    }
};

createDartboard("canvas", settings);
```