/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/animejs/lib/anime.es.js":
/*!**********************************************!*\
  !*** ./node_modules/animejs/lib/anime.es.js ***!
  \**********************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */

// Defaults

var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};

var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};

var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d'];

// Caching

var cache = {
  CSS: {},
  springs: {}
};

// Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) { return Array.isArray(a); },
  obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
  pth: function (a) { return is.obj(a) && a.hasOwnProperty('totalLength'); },
  svg: function (a) { return a instanceof SVGElement; },
  inp: function (a) { return a instanceof HTMLInputElement; },
  dom: function (a) { return a.nodeType || is.svg(a); },
  str: function (a) { return typeof a === 'string'; },
  fnc: function (a) { return typeof a === 'function'; },
  und: function (a) { return typeof a === 'undefined'; },
  nil: function (a) { return is.und(a) || a === null; },
  hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
  rgb: function (a) { return /^rgb/.test(a); },
  hsl: function (a) { return /^hsl/.test(a); },
  col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)); },
  key: function (a) { return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes'; },
};

// Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) { return parseFloat(p); }) : [];
}

// Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js

function spring(string, duration) {

  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity =  minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? (duration * t) / 1000 : t;
    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }
    if (t === 0 || t === 1) { return t; }
    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];
    if (cached) { return cached; }
    var frame = 1/6;
    var elapsed = 0;
    var rest = 0;
    while(true) {
      elapsed += frame;
      if (solver(elapsed) === 1) {
        rest++;
        if (rest >= 16) { break; }
      } else {
        rest = 0;
      }
    }
    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;

}

// Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function

function steps(steps) {
  if ( steps === void 0 ) steps = 10;

  return function (t) { return Math.ceil((minMax(t, 0.000001, 1)) * steps) * (1 / steps); };
}

// BezierEasing https://github.com/gre/bezier-easing

var bezier = (function () {

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }
  function C(aA1)      { return 3.0 * aA1 }

  function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }
  function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) { aB = currentT; } else { aA = currentT; }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) { return aGuessT; }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {

    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) { return; }
    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {

      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;

      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }

    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) { return x; }
      if (x === 0 || x === 1) { return x; }
      return calcBezier(getTForX(x), mY1, mY2);
    }

  }

  return bezier;

})();

var penner = (function () {

  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)

  var eases = { linear: function () { return function (t) { return t; }; } };

  var functionEasings = {
    Sine: function () { return function (t) { return 1 - Math.cos(t * Math.PI / 2); }; },
    Circ: function () { return function (t) { return 1 - Math.sqrt(1 - t * t); }; },
    Back: function () { return function (t) { return t * t * (3 * t - 2); }; },
    Bounce: function () { return function (t) {
      var pow2, b = 4;
      while (t < (( pow2 = Math.pow(2, --b)) - 1) / 11) {}
      return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow(( pow2 * 3 - 2 ) / 22 - t, 2)
    }; },
    Elastic: function (amplitude, period) {
      if ( amplitude === void 0 ) amplitude = 1;
      if ( period === void 0 ) period = .5;

      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return (t === 0 || t === 1) ? t : 
          -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
      }
    }
  };

  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () { return function (t) { return Math.pow(t, i + 2); }; };
  });

  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;
    eases['easeOut' + name] = function (a, b) { return function (t) { return 1 - easeIn(a, b)(1 - t); }; };
    eases['easeInOut' + name] = function (a, b) { return function (t) { return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 
      1 - easeIn(a, b)(t * -2 + 2) / 2; }; };
    eases['easeOutIn' + name] = function (a, b) { return function (t) { return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : 
      (easeIn(a, b)(t * 2 - 1) + 1) / 2; }; };
  });

  return eases;

})();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) { return easing; }
  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);
  switch (name) {
    case 'spring' : return spring(easing, duration);
    case 'cubicBezier' : return applyArguments(bezier, args);
    case 'steps' : return applyArguments(steps, args);
    default : return applyArguments(ease, args);
  }
}

// Strings

function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch(e) {
    return;
  }
}

// Arrays

function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];
  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];
      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }
  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);
}

function toArray(o) {
  if (is.arr(o)) { return o; }
  if (is.str(o)) { o = selectString(o) || o; }
  if (o instanceof NodeList || o instanceof HTMLCollection) { return [].slice.call(o); }
  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) { return a === val; });
}

// Objects

function cloneObject(o) {
  var clone = {};
  for (var p in o) { clone[p] = o[p]; }
  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o1) { o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]; }
  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);
  for (var p in o2) { o[p] = is.und(o1[p]) ? o2[p] : o1[p]; }
  return o;
}

// Colors

function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? ("rgba(" + (rgb[1]) + ",1)") : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; } );
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return ("rgba(" + r + "," + g + "," + b + ",1)");
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;
  function hue2rgb(p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }
    if (t < 1/6) { return p + (q - p) * 6 * t; }
    if (t < 1/2) { return q; }
    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
    return p;
  }
  var r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return ("rgba(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + "," + a + ")");
}

function colorToRgb(val) {
  if (is.rgb(val)) { return rgbToRgba(val); }
  if (is.hex(val)) { return hexToRgba(val); }
  if (is.hsl(val)) { return hslToRgba(val); }
}

// Units

function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
  if (split) { return split[1]; }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') { return 'px'; }
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) { return 'deg'; }
}

// Values

function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) { return val; }
  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);
  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) { return value; }
  var cached = cache.CSS[value + unit];
  if (!is.und(cached)) { return cached; }
  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || (is.svg(el) && el[prop]))) { return 'attribute'; }
  if (is.dom(el) && arrayContains(validTransforms, prop)) { return 'transform'; }
  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) { return 'css'; }
  if (el[prop] != null) { return 'object'; }
}

function getElementTransforms(el) {
  if (!is.dom(el)) { return; }
  var str = el.style.transform || '';
  var reg  = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m; while (m = reg.exec(str)) { transforms.set(m[1], m[2]); }
  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;
  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }
  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform': return getTransformValue(target, propName, animatable, unit);
    case 'css': return getCSSValue(target, propName, unit);
    case 'attribute': return getAttribute(target, propName);
    default: return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);
  if (!operator) { return to; }
  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));
  switch (operator[0][0]) {
    case '+': return x + y + u;
    case '-': return x - y + u;
    case '*': return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) { return colorToRgb(val); }
  if (/\s/g.test(val)) { return val; }
  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;
  if (unit) { return unitLess + unit; }
  return unitLess;
}

// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return (getAttribute(el, 'width') * 2) + (getAttribute(el, 'height') * 2);
}

function getLineLength(el) {
  return getDistance(
    {x: getAttribute(el, 'x1'), y: getAttribute(el, 'y1')}, 
    {x: getAttribute(el, 'x2'), y: getAttribute(el, 'y2')}
  );
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;
  for (var i = 0 ; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);
    if (i > 0) { totalLength += getDistance(previousPos, currentPos); }
    previousPos = currentPos;
  }
  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
}

// Path animation

function getTotalLength(el) {
  if (el.getTotalLength) { return el.getTotalLength(); }
  switch(el.tagName.toLowerCase()) {
    case 'circle': return getCircleLength(el);
    case 'rect': return getRectLength(el);
    case 'line': return getLineLength(el);
    case 'polyline': return getPolylineLength(el);
    case 'polygon': return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
}

// Motion path

function getParentSvgEl(el) {
  var parentEl = el.parentNode;
  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) { break; }
    parentEl = parentEl.parentNode;
  }
  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  }
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function(property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    }
  }
}

function getPathProgress(path, progress, isPathTargetInsideSVG) {
  function point(offset) {
    if ( offset === void 0 ) offset = 0;

    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }
  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);
  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;
  switch (path.property) {
    case 'x': return (p.x - svg.x) * scaleX;
    case 'y': return (p.y - svg.y) * scaleY;
    case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
}

// Decompose value

function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var value = validateValue((is.pth(val) ? val.totalLength : val), unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: (is.str(val) || unit) ? value.split(rgx) : []
  }
}

// Animatables

function parseTargets(targets) {
  var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
  return filterArray(targetsArray, function (item, pos, self) { return self.indexOf(item) === pos; });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {target: t, id: i, total: parsed.length, transforms: { list: getElementTransforms(t) } };
  });
}

// Properties

function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings);
  // Override duration if easing is a spring
  if (/^spring/.test(settings.easing)) { settings.duration = spring(settings.easing); }
  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = (l === 2 && !is.obj(prop[0]));
    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) { settings.duration = tweenSettings.duration / l; }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {value: prop};
    }
  }
  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = (is.obj(v) && !is.pth(v)) ? v : {value: v};
    // Default delay value should only be applied to the first tween
    if (is.und(obj.delay)) { obj.delay = !i ? tweenSettings.delay : 0; }
    // Default endDelay value should only be applied to the last tween
    if (is.und(obj.endDelay)) { obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0; }
    return obj;
  }).map(function (k) { return mergeObjects(k, settings); });
}


function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) { return Object.keys(key); })), function (p) { return is.key(p); })
  .reduce(function (a,b) { if (a.indexOf(b) < 0) { a.push(b); } return a; }, []);
  var properties = {};
  var loop = function ( i ) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};
      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) { newKey.value = key[p]; }
        } else {
          newKey[p] = key[p];
        }
      }
      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop( i );
  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;
  if (keyframes) { params = mergeObjects(flattenKeyframes(keyframes), params); }
  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }
  return properties;
}

// Tweens

function normalizeTweenValues(tween, animatable) {
  var t = {};
  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);
    if (is.arr(value)) {
      value = value.map(function (v) { return getFunctionValue(v, animatable); });
      if (value.length === 1) { value = value[0]; }
    }
    t[p] = value;
  }
  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;
    if (is.und(to)) { to = previousValue; }
    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);
    if (tween.isColor) { tween.round = 1; }
    previousTween = tween;
    return tween;
  });
}

// Tween progress

var setProgressValue = {
  css: function (t, p, v) { return t.style[p] = v; },
  attribute: function (t, p, v) { return t.setAttribute(p, v); },
  object: function (t, p, v) { return t[p] = v; },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);
    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) { str += prop + "(" + value + ") "; });
      t.style.transform = str;
    }
  }
};

// Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
}

// Animations

function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);
  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    }
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) { return !is.und(a); });
}

// Create Instance

function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;
  var getTlOffset = function (anim) { return anim.timelineOffset ? anim.timelineOffset : 0; };
  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration; })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.delay; })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) { return getTlOffset(anim) + anim.duration - anim.endDelay; })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
}

// Core

var activeInstances = [];

var engine = (function () {
  var raf;

  function play() {
    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(step);
    }
  }
  function step(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;
    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];
      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }
    raf = i > 0 ? requestAnimationFrame(step) : undefined;
  }

  function handleVisibilityChange() {
    if (!anime.suspendWhenDocumentHidden) { return; }

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else { // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(
        function (instance) { return instance ._onDocumentVisibility(); }
      );
      engine();
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return play;
})();

function isDocumentHidden() {
  return !!document && document.hidden;
}

// Public Instance

function anime(params) {
  if ( params === void 0 ) params = {};


  var startTime = 0, lastTime = 0, now = 0;
  var children, childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) { return resolve = _resolve; });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;
    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }
    instance.reversed = !instance.reversed;
    children.forEach(function (child) { return child.reversed = instance.reversed; });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) { child.seek(time - child.timelineOffset); }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) { seekChild(time, children[i]); }
    } else {
      for (var i$1 = childrenLength; i$1--;) { seekChild(time, children[i$1]); }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;
    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength];
      // Only check for keyframes if there is more than one tween
      if (tweenLength) { tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween; }
      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = (void 0);
      for (var n = 0; n < toNumbersLength; n++) {
        var value = (void 0);
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;
        if (!tween.isPath) {
          value = fromNumber + (eased * (toNumber - fromNumber));
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }
        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }
        numbers.push(value);
      }
      // Manual Array.reduce for better performances
      var stringsLength = strings.length;
      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];
        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];
          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }
      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) { instance[cb](instance); }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax((insTime / insDuration) * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;
    if (children) { syncInstanceChildren(insTime); }
    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }
    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }
    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }
    if ((insTime >= insEndDelay && instance.currentTime !== insDuration) || !insDuration) {
      setAnimationsProgress(insDuration);
    }
    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }
      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }
    instance.currentTime = minMax(insTime, 0, insDuration);
    if (instance.began) { setCallback('update'); }
    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();
      if (!instance.remaining) {
        instance.paused = true;
        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');
          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;
        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function() {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;
    for (var i = childrenLength; i--;) { instance.children[i].reset(); }
    if (instance.reversed && instance.loop !== true || (direction === 'alternate' && instance.loop === 1)) { instance.remaining++; }
    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  };

  // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)
  instance._onDocumentVisibility = resetTime;

  // Set Value helper

  instance.set = function(targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function(t) {
    now = t;
    if (!startTime) { startTime = now; }
    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function() {
    instance.paused = true;
    resetTime();
  };

  instance.play = function() {
    if (!instance.paused) { return; }
    if (instance.completed) { instance.reset(); }
    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    engine();
  };

  instance.reverse = function() {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };

  instance.restart = function() {
    instance.reset();
    instance.play();
  };

  instance.remove = function(targets) {
    var targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };

  instance.reset();

  if (instance.autoplay) { instance.play(); }

  return instance;

}

// Remove targets from animation

function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargetsFromInstance(targetsArray, instance) {
  var animations = instance.animations;
  var children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);
  for (var c = children.length; c--;) {
    var child = children[c];
    var childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);
    if (!childAnimations.length && !child.children.length) { children.splice(c, 1); }
  }
  if (!animations.length && !children.length) { instance.pause(); }
}

function removeTargetsFromActiveInstances(targets) {
  var targetsArray = parseTargets(targets);
  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
}

// Stagger helpers

function stagger(val, params) {
  if ( params === void 0 ) params = {};

  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) { fromIndex = 0; }
    if (fromCenter) { fromIndex = (t - 1) / 2; }
    if (fromLast) { fromIndex = t - 1; }
    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex%grid[0] : (grid[0]-1)/2;
          var fromY = !fromCenter ? Math.floor(fromIndex/grid[0]) : (grid[1]-1)/2;
          var toX = index%grid[0];
          var toY = Math.floor(index/grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (axis === 'x') { value = -distanceX; }
          if (axis === 'y') { value = -distanceY; }
          values.push(value);
        }
        maxValue = Math.max.apply(Math, values);
      }
      if (easing) { values = values.map(function (val) { return easing(val / maxValue) * maxValue; }); }
      if (direction === 'reverse') { values = values.map(function (val) { return axis ? (val < 0) ? val * -1 : -val : Math.abs(maxValue - val); }); }
    }
    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + (spacing * (Math.round(values[i] * 100) / 100)) + unit;
  }
}

// Timeline

function timeline(params) {
  if ( params === void 0 ) params = {};

  var tl = anime(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;
    if (tlIndex > -1) { activeInstances.splice(tlIndex, 1); }
    function passThrough(ins) { ins.passThrough = true; }
    for (var i = 0; i < children.length; i++) { passThrough(children[i]); }
    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();
    if (tl.autoplay) { tl.play(); }
    return tl;
  };
  return tl;
}

anime.version = '3.2.1';
anime.speed = 1;
// TODO:#review: naming, documentation
anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;
anime.random = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (anime);


/***/ }),

/***/ "./src/beat.js":
/*!*********************!*\
  !*** ./src/beat.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Util = __webpack_require__(/*! ./util */ "./src/util.js");

var DEFAULTS = {
  TYPE: "CLICK",
  LENGTH: 0,
  DIR: 0,
  // 0 to 359
  SEQ: "",
  COLOR: "rgba(255, 255, 255, .75)",
  RADIUS: 50
};

function Beat(options) {
  this.pos = options.pos.slice(0);
  this.startPos = options.pos.slice(0);
  this.time = options.time;
  this.type = options.type || DEFAULTS.TYPE;
  this.length = options.length || DEFAULTS.LENGTH;
  this.dir = options.dir || DEFAULTS.DIR;
  this.seq = options.seq || DEFAULTS.SEQ;
  this.color = options.color || Util.randomColor(0.75) || DEFAULTS.COLOR;
  this.radius = options.radius || DEFAULTS.RADIUS;
  this.opacity = 0;
  this.held = true;
}

Beat.prototype.drawClick = function draw(ctx, opacity) {
  var radiusMul = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var seq = arguments.length > 3 ? arguments[3] : undefined;
  ctx.beginPath();
  ctx.globalAlpha = 0.25 * opacity;
  ctx.arc(this.pos[0], this.pos[1], this.radius * radiusMul, 0, 2 * Math.PI, true);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.globalAlpha = 1 * opacity;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(this.seq.toString(), this.pos[0] - 8, this.pos[1] + 10);
};

Beat.prototype.drawRing = function drawRing(ctx, opacity, radiusMul, color) {
  var hit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  ctx.beginPath();
  ctx.globalAlpha = opacity;
  ctx.arc(this.pos[0], this.pos[1], this.radius * radiusMul, 0, 2 * Math.PI, true);

  if (hit) {
    ctx.lineWidth = 5 * radiusMul;
  }

  ctx.strokeStyle = color || this.color;

  if (hit) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.stroke();
};

Beat.prototype.drawDrag = function drawDrag(ctx, opacity, radiusMul) {
  var rad = this.dir * 2 * Math.PI / 360;
  var x1 = this.startPos[0] - this.radius * Math.sin(rad);
  var y1 = this.startPos[1] - this.radius * Math.cos(rad);
  var x2 = x1 + this.length * Math.cos(rad);
  var y2 = y1 - this.length * Math.sin(rad);
  var x3 = x2 + this.radius * Math.sin(rad);
  var y3 = y2 + this.radius * Math.cos(rad);
  var alphai3 = -rad - 0.5 * Math.PI;
  var alphaf3 = -rad - 1.5 * Math.PI;
  var x4 = this.startPos[0] + this.radius * Math.sin(rad);
  var y4 = this.startPos[1] + this.radius * Math.cos(rad);
  var x5 = x4 - this.radius * Math.sin(rad);
  var y5 = y4 - this.radius * Math.cos(rad);
  var alphai5 = -rad + 0.5 * Math.PI;
  var alphaf5 = -rad + 1.5 * Math.PI;
  ctx.beginPath();
  ctx.globalAlpha = 1 * opacity;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.arc(x3, y3, this.radius, alphai3, alphaf3);
  ctx.lineTo(x4, y4);
  ctx.arc(x5, y5, this.radius, alphai5, alphaf5);
  ctx.stroke();
};

Beat.prototype.getEndPos = function getEndPos() {
  var x = this.startPos[0];
  var y = this.startPos[1];
  var deltaX = this.length * Math.cos(this.dir * 2 * Math.PI / 360);
  var deltaY = this.length * Math.sin(this.dir * 2 * Math.PI / 360);
  this.endPos = [x + deltaX, y + deltaY];
};

Beat.prototype.moveDragBeat = function moveDragBeat(time) {
  var timeDelta = time - this.time;

  if (timeDelta >= 0) {
    var deltaX = Math.cos(this.dir * 2 * Math.PI / 360);
    var deltaY = Math.sin(this.dir * 2 * Math.PI / 360);
    this.pos[0] = this.pos[0] + deltaX;
    this.pos[1] = this.pos[1] - deltaY;
  }
};

module.exports = Beat;

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Beat = __webpack_require__(/*! ./beat */ "./src/beat.js");

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

function Game(options) {
  // this.beatmap = options.beatmap;
  // this.imageURL = options.imageURL;
  // this.beatmap = [
  //   { pos: [20, 20], time: 2000 },
  //   { pos: [460, 40], time: 2500 },
  //   { pos: [850, 200], time: 3000, type: "DRAG", length: 100, dir: 300 },
  //   { pos: [230, 300], time: 4000 },
  //   { pos: [200, 290], time: 5000 },
  //   { pos: [600, 400], time: 6000 },
  //   { pos: [715, 200], time: 8000 },
  //   { pos: [230, 300], time: 9000 },
  // ];
  this.beatmap = [{
    pos: [590, 238],
    time: 800
  }, {
    pos: [250, 308],
    time: 2140,
    type: "DRAG",
    length: 100,
    dir: 300
  }, {
    pos: [466, 92],
    time: 3480
  }, {
    pos: [892, 36],
    time: 4160
  }, {
    pos: [944, 273],
    time: 4790,
    type: "DRAG",
    length: 100,
    dir: 300
  }, {
    pos: [585, 178],
    time: 5480
  }, {
    pos: [343, 504],
    time: 6130.8,
    type: "DRAG",
    length: 100,
    dir: 300
  }, {
    pos: [588, 531],
    time: 7480
  }, {
    pos: [523, 207],
    time: 9136
  }, {
    pos: [53, 82],
    time: 9809.2
  }, {
    pos: [594, 135],
    time: 10129.6,
    type: "DRAG",
    length: 100,
    dir: 300
  }, {
    pos: [0, 519],
    time: 10789.2
  }, {
    pos: [177, 499],
    time: 11465.2
  }, {
    pos: [131, 302],
    time: 11790.8
  }, {
    pos: [268, 428],
    time: 12803.6
  }, {
    pos: [531, 485],
    time: 13466
  }, {
    pos: [105, 342],
    time: 14130.8
  }, {
    pos: [930, 81],
    time: 15461.2
  }, {
    pos: [501, 191],
    time: 16126
  }, {
    pos: [762, 571],
    time: 16800
  }, {
    pos: [592, 121],
    time: 18131.2
  }, {
    pos: [463, 214],
    time: 18800
  }, {
    pos: [529, 263],
    time: 19804.4
  }, {
    pos: [495, 95],
    time: 20058.4
  }, {
    pos: [535, 464],
    time: 20800
  }, {
    pos: [859, 375],
    time: 21460.4
  }, {
    pos: [31, 277],
    time: 23480
  }, {
    pos: [328, 283],
    time: 24137.2
  }, {
    pos: [825, 332],
    time: 24804.8
  }, {
    pos: [938, 86],
    time: 26124
  }, {
    pos: [299, 263],
    time: 26792
  }, {
    pos: [984, 286],
    time: 27460
  }, {
    pos: [702, 90],
    time: 28744
  }, {
    pos: [648, 310],
    time: 29449.6
  }, {
    pos: [20, 520],
    time: 30131.2
  }, {
    pos: [455, 135],
    time: 31456
  }, {
    pos: [266, 243],
    time: 32126.4
  }, {
    pos: [551, 270],
    time: 32778
  }, {
    pos: [355, 256],
    time: 34132.4
  }, {
    pos: [469, 109],
    time: 34789.6
  }, {
    pos: [300, 399],
    time: 35343.2
  }, {
    pos: [976, 324],
    time: 35785.2
  }, {
    pos: [992, 494],
    time: 36790.4
  }, {
    pos: [886, 1],
    time: 37454.8
  }, {
    pos: [709, 428],
    time: 38122.8
  }, {
    pos: [630, 247],
    time: 39404
  }, {
    pos: [893, 99],
    time: 40069.2
  }, {
    pos: [939, 418],
    time: 40802.4
  }, {
    pos: [472, 324],
    time: 42110.8
  }, {
    pos: [383, 468],
    time: 42784
  }, {
    pos: [765, 484],
    time: 43440.8
  }, {
    pos: [661, 535],
    time: 43788.8
  }, {
    pos: [777, 227],
    time: 44806.8
  }, {
    pos: [169, 76],
    time: 45463.6
  }, {
    pos: [978, 448],
    time: 46126
  }, {
    pos: [310, 492],
    time: 46465.2
  }, {
    pos: [988, 23],
    time: 47462
  }, {
    pos: [526, 518],
    time: 48143.2
  }, {
    pos: [650, 313],
    time: 48787.6
  }, {
    pos: [304, 270],
    time: 50143.2
  }, {
    pos: [6, 343],
    time: 51468.4
  }, {
    pos: [90, 133],
    time: 52812.4
  }, {
    pos: [197, 104],
    time: 54143.2
  }, {
    pos: [771, 302],
    time: 55466.4
  }, {
    pos: [767, 233],
    time: 56129.2
  }, {
    pos: [511, 74],
    time: 56800.4
  }, {
    pos: [561, 59],
    time: 57148
  }, {
    pos: [307, 153],
    time: 58018
  }, {
    pos: [316, 339],
    time: 58803.2
  }, {
    pos: [550, 478],
    time: 61126.4
  }, {
    pos: [895, 376],
    time: 61455.6
  }, {
    pos: [530, 515],
    time: 62460
  }, {
    pos: [762, 40],
    time: 63609.6
  }, {
    pos: [175, 110],
    time: 65049.2
  }, {
    pos: [385, 570],
    time: 66480.4
  }, {
    pos: [692, 203],
    time: 67810.8
  }, {
    pos: [237, 36],
    time: 69452.8
  }, {
    pos: [568, 543],
    time: 70111.2
  }, {
    pos: [769, 563],
    time: 70462.8
  }, {
    pos: [16, 558],
    time: 71774
  }, {
    pos: [606, 192],
    time: 72802.8
  }, {
    pos: [845, 4],
    time: 73440.4
  }, {
    pos: [638, 584],
    time: 73763.6
  }, {
    pos: [382, 27],
    time: 74379.2
  }, {
    pos: [167, 555],
    time: 75462
  }, {
    pos: [738, 500],
    time: 76048.8
  }, {
    pos: [548, 115],
    time: 76379.6
  }, {
    pos: [300, 546],
    time: 77091.6
  }, {
    pos: [586, 503],
    time: 78124
  }, {
    pos: [429, 121],
    time: 79445.6
  }, {
    pos: [108, 421],
    time: 79779.6
  }, {
    pos: [302, 348],
    time: 80812.4
  }, {
    pos: [109, 550],
    time: 81361.2
  }, {
    pos: [300, 191],
    time: 81785.2
  }, {
    pos: [821, 545],
    time: 82127.6
  }, {
    pos: [978, 175],
    time: 82480.8
  }, {
    pos: [78, 305],
    time: 83614
  }, {
    pos: [651, 264],
    time: 84380.4
  }, {
    pos: [491, 192],
    time: 85092
  }, {
    pos: [883, 500],
    time: 86468.8
  }, {
    pos: [196, 600],
    time: 89128.8
  }, {
    pos: [909, 115],
    time: 91132.4
  }, {
    pos: [384, 259],
    time: 91389.6
  }, {
    pos: [689, 170],
    time: 91966.8
  }, {
    pos: [633, 400],
    time: 93168
  }, {
    pos: [692, 563],
    time: 93647.6
  }, {
    pos: [673, 29],
    time: 93808.8
  }, {
    pos: [556, 151],
    time: 94134.8
  }, {
    pos: [350, 75],
    time: 95464.8
  }, {
    pos: [18, 326],
    time: 96124.4
  }, {
    pos: [864, 48],
    time: 96788
  }, {
    pos: [877, 172],
    time: 97216.4
  }, {
    pos: [901, 553],
    time: 97739.2
  }, {
    pos: [482, 581],
    time: 98138.8
  }, {
    pos: [840, 278],
    time: 99486.8
  }, {
    pos: [734, 441],
    time: 99909.6
  }, {
    pos: [794, 61],
    time: 100413.2
  }, {
    pos: [348, 39],
    time: 100788
  }, {
    pos: [107, 157],
    time: 101458.8
  }, {
    pos: [355, 385],
    time: 102143.2
  }, {
    pos: [671, 269],
    time: 103471.2
  }, {
    pos: [170, 353],
    time: 104124.4
  }, {
    pos: [876, 15],
    time: 104762
  }, {
    pos: [606, 492],
    time: 106126.4
  }, {
    pos: [143, 156],
    time: 106779.6
  }, {
    pos: [248, 476],
    time: 107454.8
  }, {
    pos: [583, 307],
    time: 108805.2
  }, {
    pos: [162, 273],
    time: 109467.2
  }, {
    pos: [368, 145],
    time: 110129.2
  }, {
    pos: [283, 291],
    time: 111454.8
  }, {
    pos: [992, 227],
    time: 112370.8
  }, {
    pos: [770, 22],
    time: 112685.6
  }, {
    pos: [114, 64],
    time: 113503.2
  }, {
    pos: [518, 169],
    time: 115132.4
  }, {
    pos: [947, 473],
    time: 117784.8
  }, {
    pos: [319, 135],
    time: 120480.4
  }, {
    pos: [634, 341],
    time: 122764
  }, {
    pos: [184, 380],
    time: 123342.4
  }, {
    pos: [760, 569],
    time: 123789.6
  }, {
    pos: [127, 239],
    time: 124071.6
  }, {
    pos: [860, 56],
    time: 125131.6
  }, {
    pos: [416, 131],
    time: 126082.8
  }, {
    pos: [399, 483],
    time: 126812.4
  }, {
    pos: [219, 535],
    time: 127040.8
  }, {
    pos: [663, 283],
    time: 127747.2
  }, {
    pos: [495, 387],
    time: 128787.6
  }, {
    pos: [750, 270],
    time: 129063.6
  }, {
    pos: [934, 86],
    time: 129454.8
  }, {
    pos: [410, 571],
    time: 129729.6
  }, {
    pos: [554, 491],
    time: 130482
  }, {
    pos: [614, 491],
    time: 131464
  }, {
    pos: [766, 99],
    time: 131786.8
  }, {
    pos: [774, 445],
    time: 132030.8
  }, {
    pos: [262, 570],
    time: 132730
  }, {
    pos: [71, 40],
    time: 134129.6
  }, {
    pos: [454, 533],
    time: 134280
  }, {
    pos: [840, 587],
    time: 134739.2
  }, {
    pos: [933, 568],
    time: 135787.6
  }, {
    pos: [562, 479],
    time: 137379.2
  }, {
    pos: [376, 504],
    time: 137840
  }, {
    pos: [221, 306],
    time: 138408.8
  }, {
    pos: [732, 346],
    time: 138722.4
  }, {
    pos: [961, 335],
    time: 139457.2
  }, {
    pos: [639, 268],
    time: 139800.4
  }, {
    pos: [703, 70],
    time: 140136.4
  }, {
    pos: [481, 230],
    time: 140507.6
  }, {
    pos: [803, 47],
    time: 141177.6
  }, {
    pos: [556, 50],
    time: 141462
  }, {
    pos: [776, 518],
    time: 142140.8
  }, {
    pos: [94, 234],
    time: 142450
  }, {
    pos: [954, 76],
    time: 145101.6
  }, {
    pos: [760, 205],
    time: 145652
  }, {
    pos: [949, 16],
    time: 146457.2
  }, {
    pos: [678, 410],
    time: 147142.8
  }, {
    pos: [247, 417],
    time: 147760
  }, {
    pos: [636, 53],
    time: 148544.8
  }];
}

Game.prototype.draw = function draw(ctx) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalAlpha = 1; //   background = new Image();
  //   background.src = this.imageURL;
  //   ctx.drawImage(background,0,0)
  //   ctx.fillStyle = Game.BG_COLOR;
  //   ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
};

Game.prototype.checkSeq = function checkSeq() {
  var _this = this;

  var count = 1;
  var downTime = 1000;
  this.beatmap.forEach(function (beat, idx) {
    if (idx === 0) {
      var nextBeat = _this.beatmap[idx + 1];

      if (nextBeat.time - beat.time < downTime) {
        beat.seq = count;
        count++;
      }
    } else if (idx === _this.beatmap.length - 1) {
      var prevBeat = _this.beatmap[idx - 1];

      if (beat.time - prevBeat.time < downTime) {
        beat.seq = count;
      }
    } else {
      var _prevBeat = _this.beatmap[idx - 1];
      var _nextBeat = _this.beatmap[idx + 1];

      if (_nextBeat.time - beat.time < downTime) {
        beat.seq = count;
        count++;
      } else if (beat.time - _prevBeat.time < downTime) {
        beat.seq = count;
        count = 1;
      } else {
        count = 1;
      }
    }
  });
};

Game.prototype.makeBeats = function makeBeats() {
  this.beats = this.beatmap.map(function (beat) {
    return new Beat(beat);
  });
};

module.exports = Game;

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Util = __webpack_require__(/*! ./util */ "./src/util.js");

var anime = __webpack_require__(/*! animejs */ "./node_modules/animejs/lib/anime.es.js");

function GameView(game, ctx, options) {
  this.ctx = ctx;
  this.game = game;
  this.click = [0, 0];
  this.mousedown = false;
  this.activeBeats = [];
  this.hitBeats = {};
  this.score = 0;
  this.audioURL = options.audioURL;
  this.volume = options.volume / 100 || 0.5; //create audio for game

  this.audioObj = new Audio(this.audioURL);
  this.audioObj.volume = this.volume;
}

GameView.prototype.bindKeyHandlers = function bindKeyHandlers() {
  var _this = this;

  document.getElementById("game-canvas").addEventListener("mousemove", function (e) {
    var canvasElement = document.getElementById("game-canvas");
    _this.x = e.clientX - (window.innerWidth - canvasElement.width) / 2;
    _this.y = e.clientY - (window.innerHeight - canvasElement.height) / 2;
  });
  window.addEventListener("keydown", function (e) {
    if (e.keyCode === 32) {
      _this.click[0] = _this.x;
      _this.click[1] = _this.y;

      _this.activeBeats.forEach(function (activeBeat, idx) {
        _this.checkClick(activeBeat, idx);
      });
    }
  });
  window.addEventListener("keyup", function (e) {
    if (e.keyCode === 32) {
      _this.mousedown = false;
    }
  });
  window.addEventListener("mousedown", function (e) {
    var canvasElement = document.getElementById("game-canvas");
    _this.click[0] = e.clientX - (window.innerWidth - canvasElement.width) / 2;
    _this.click[1] = e.clientY - (window.innerHeight - canvasElement.height) / 2;
    _this.mousedown = true;

    _this.activeBeats.forEach(function (activeBeat, idx) {
      _this.checkClick(activeBeat, idx);
    });
  });
  window.addEventListener("mouseup", function (e) {
    _this.mousedown = false;
  });
  var volumeInput = document.getElementById("volume-GV");
  volumeInput.addEventListener("change", function (e) {
    _this.audioObj.volume = e.target.value / 100;
    console.log("gameview volume: ".concat(e.target.value));
  });
};

GameView.prototype.isActiveBeat = function isActiveBeat(beat, idx, time) {
  if (Math.abs(beat.time - time) <= 1000) {
    if (Math.abs(beat.time - time) <= 800) {
      if (idx >= this.beatIdx) {
        this.activeBeats.push(beat);
        this.beatIdx++;
      }
    } else if (time - beat.time > 800) {
      var _idx = this.activeBeats.indexOf(beat);

      if (_idx !== -1) {
        this.activeBeats.splice(_idx, 1);
      }
    }
  }
};

GameView.prototype.checkClick = function checkClick(activeBeat, idx) {
  if (Util.dist(this.click, activeBeat.pos) < activeBeat.radius) {
    var hitBeat = this.activeBeats.splice(idx, 1)[0];
    var hitBeatStr = JSON.stringify(hitBeat);
    this.hitBeats[hitBeatStr] = this.lastTime;
    this.scoreHit(hitBeat);
  }
};

GameView.prototype.checkDrag = function checkDrag(dragBeat, time) {
  var timeDelta = time - dragBeat.time;
  var dragTime = dragBeat.length * 1000 / 60;
  var activeBeatT = 500;

  if (timeDelta > activeBeatT && timeDelta <= dragTime) {
    if (Util.dist([this.x, this.y], dragBeat.pos) < dragBeat.radius) {
      if (!this.mousedown) {
        this.scoreDrag(false);
        dragBeat.held = false;
      }
    } else {
      this.scoreDrag(false);
      dragBeat.held = false;
    }
  } else if (dragBeat.held && timeDelta > dragTime) {
    this.scoreDrag(true);
    dragBeat.held = false;
  }
};

GameView.prototype.drawHitBeat = function drawHitBeat(ctx, beat, hitTime, time) {
  var timeDelta = time - hitTime; // 1000-2000

  var timeToFade = 1000;

  if (timeDelta < timeToFade) {
    var beatRadMul = timeDelta / (2 * timeToFade) + 1;
    var ringRadMul = timeDelta / timeToFade + 1;
    var opacity = 1 - timeDelta / timeToFade;
    beat.drawClick(this.ctx, opacity, beatRadMul);
    beat.drawRing(this.ctx, opacity, ringRadMul, null, true);
  }
};

GameView.prototype.drawBeat = function drawBeat(beat, time) {
  var timeDelta = time - beat.time;
  var beatTime = 1000;
  var activeBeatT = 500;
  var inactiveBeatT = beatTime - activeBeatT;

  if (Math.abs(timeDelta) <= beatTime) {
    if (Object.keys(this.hitBeats).includes(JSON.stringify(beat))) {
      var hitTime = this.hitBeats[JSON.stringify(beat)];
      this.drawHitBeat(this.ctx, beat, hitTime, time);
    } else if (timeDelta < -activeBeatT) {
      var radiusMul = -(timeDelta + inactiveBeatT) / inactiveBeatT + 2;
      var opacity = 1 + (timeDelta + inactiveBeatT) / inactiveBeatT;
      beat.drawClick(this.ctx, opacity);
      beat.drawRing(this.ctx, opacity, radiusMul, "white");
    } else if (timeDelta < 0) {
      var _radiusMul = -(timeDelta + activeBeatT) / activeBeatT + 2;

      var _opacity = 1;
      beat.drawClick(this.ctx, _opacity);
      beat.drawRing(this.ctx, _opacity, _radiusMul, "white");
    } else if (timeDelta < activeBeatT) {
      var _radiusMul2 = 1;
      var _opacity2 = 1;
      beat.drawClick(this.ctx, _opacity2);
      beat.drawRing(this.ctx, _opacity2, _radiusMul2, "white");
    } else {
      var _radiusMul3 = 1;

      var _opacity3 = 1 - (timeDelta - inactiveBeatT) / inactiveBeatT;

      beat.drawClick(this.ctx, _opacity3);
      beat.drawRing(this.ctx, _opacity3, _radiusMul3, "white");
    }
  }
};

GameView.prototype.drawDrag = function drawDrag(beat, time) {
  var timeDelta = time - beat.time;
  var inactiveBeatT = 500;
  var activeBeatT = 500;
  var dragTime = beat.length * 1000 / 60;
  var beatTime = inactiveBeatT + activeBeatT + dragTime;
  var radiusMul;
  var opacity;

  if (-timeDelta <= inactiveBeatT + activeBeatT && timeDelta <= inactiveBeatT + dragTime) {
    if (timeDelta < -activeBeatT) {
      radiusMul = -(timeDelta + inactiveBeatT) / inactiveBeatT + 2;
      opacity = 1 + (timeDelta + inactiveBeatT) / inactiveBeatT;
    } else if (timeDelta < 0) {
      radiusMul = -(timeDelta + activeBeatT) / activeBeatT + 2;
      opacity = 1;
      beat.moveDragBeat(time);
    } else if (timeDelta < dragTime) {
      radiusMul = 1;
      opacity = 1;
      beat.moveDragBeat(time);
    } else {
      radiusMul = 1;
      opacity = 1 - (timeDelta - inactiveBeatT) / inactiveBeatT;
    }

    beat.drawDrag(this.ctx, opacity, radiusMul);
    beat.drawClick(this.ctx, opacity);
    beat.drawRing(this.ctx, opacity, radiusMul, "white");
  }
};

GameView.prototype.scoreHit = function scoreHit(beat) {
  var fullScore = 100;
  var activeBeatT = 500;
  var hitTime = this.hitBeats[JSON.stringify(beat)];
  this.score += fullScore * (activeBeatT - Math.abs(hitTime - beat.time)) / activeBeatT;
};

GameView.prototype.scoreDrag = function scoreDrag(hit) {
  if (hit) {
    this.score += 100;
  }
};

GameView.prototype.playAudio = function playAudio() {
  var _this2 = this;

  this.audioObj.addEventListener("canplaythrough", function (e) {
    _this2.audioObj.play();
  });
}; // GameView.prototype.changeAudioVol = function changeAudioVol(){
//     this.audioObj.addEventListener("canplaythrough", (e) => {
//         this.audioObj.play();
//     })
// }


GameView.prototype.start = function start() {
  this.playAudio();
  this.game.checkSeq();
  this.game.makeBeats();
  this.bindKeyHandlers();
  this.lastTime = 0;
  this.startTime = performance.now();
  this.beatIdx = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function animate(time) {
  var _this3 = this;

  this.lastTime = time - this.startTime;
  this.game.draw(this.ctx);

  if (this.game.beats.length !== 0) {
    this.game.beats.forEach(function (beat, idx) {
      _this3.isActiveBeat(beat, idx, _this3.lastTime);

      if (beat.type === "CLICK") {
        _this3.drawBeat(beat, _this3.lastTime);
      } else {
        _this3.drawDrag(beat, _this3.lastTime);

        if (beat.held) {
          _this3.checkDrag(beat, _this3.lastTime);
        }
      }
    });
  }

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/***/ ((module) => {

var Util = {
  // Find distance between two points.
  dist: function dist(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
  },
  randomColor: function randomColor() {
    var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);
    return "rgba(" + red + "," + green + "," + blue + "," + opacity + " )";
  }
};
module.exports = Util;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_require__ */
var Game = __webpack_require__(/*! ./game */ "./src/game.js");

var GameView = __webpack_require__(/*! ./game_view */ "./src/game_view.js");

document.addEventListener("DOMContentLoaded", function () {
  var startMenu = document.querySelector(".start-menu");
  var startButton = document.getElementById("start-btn");
  var songsButton = document.getElementById("songs-btn");
  var instructButton = document.getElementById("instructions-btn");
  var volumeButton = document.getElementById("volume-btn");
  var volumeInputStart = document.getElementById("volume-start");
  var songsMenu = document.querySelector(".songs-menu");
  var startMenuButton = document.getElementById("start-menu-btn");
  var volumeInputSongs = document.getElementById("volume-songs");
  var gameContainer = document.querySelector(".game");
  var canvasElement = document.getElementById("game-canvas");
  var ctx = canvasElement.getContext("2d");
  window.ctx = ctx;
  anime({
    targets: ".start-option",
    width: "100%",
    easing: "easeInOutQuad",
    direction: "normal",
    delay: anime.stagger(1000)
  });
  anime({
    targets: ".title",
    scale: 1.02,
    direction: "alternate",
    easing: 'easeInOutSine',
    loop: true
  }); //volume

  var volumeLvl;
  volumeButton.addEventListener("click", function () {
    console.log("volume-pop-up");
  });
  volumeInputStart.addEventListener("change", function (e) {
    volumeLvl = e.target.value;
    volumeInputSongs.value = volumeLvl;
  });
  volumeInputSongs.addEventListener("change", function (e) {
    volumeLvl = e.target.value;
    volumeInputStart.value = volumeLvl;
  });
  instructButton.addEventListener("click", function () {
    console.log("instructions");
  }); //song selection

  songsButton.addEventListener("click", function () {
    startMenu.classList.add("hidden");
    songsMenu.classList.remove("hidden");
    gameContainer.classList.add("hidden");
    canvasElement.className = "song-choice-1"; // startButton.disabled = true;
  });
  anime({
    targets: "#start-btn",
    scale: 1.1,
    direction: "alternate",
    easing: 'easeInOutSine',
    loop: true
  }); // const delay = 3000; //ms

  var songs = document.querySelector(".song-options");
  var songCount = songs.childElementCount;
  var maxLeft = (songCount - 1) * 100 * -1;
  var current = 0;
  var audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
  ;

  function changeSong() {
    var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (next) {
      current += current > maxLeft ? -100 : current * -1;
    } else {
      current = current < 0 ? current + 100 : maxLeft;
    }

    songs.style.left = current + "%";

    if (current === 0) {
      canvasElement.className = "song-choice-1";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -100) {
      canvasElement.className = "song-choice-2";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -200) {
      canvasElement.className = "song-choice-3";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -300) {
      canvasElement.className = "song-choice-4";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -400) {
      canvasElement.className = "song-choice-5";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -500) {
      canvasElement.className = "song-choice-6";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -600) {
      canvasElement.className = "song-choice-7";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -700) {
      canvasElement.className = "song-choice-8";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -800) {
      canvasElement.className = "song-choice-9";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -900) {
      canvasElement.className = "song-choice-10";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
  } // let autoChange = setInterval(changeSong, delay);
  // const restart = function () {
  //   clearInterval(autoChange);
  //   autoChange = setInterval(changeSong, delay);
  // };


  var nextSongButton = document.getElementById("next-btn");
  nextSongButton.addEventListener("click", function () {
    changeSong(); // restart();
  });
  var prevSongButton = document.getElementById("prev-btn");
  prevSongButton.addEventListener("click", function () {
    changeSong(false); // restart();
  });
  var song1 = document.getElementById("song1");
  song1.addEventListener("click", function () {
    canvasElement.className = "song-choice-1"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("1");
  });
  var song2 = document.getElementById("song2");
  song2.addEventListener("click", function () {
    canvasElement.className = "song-choice-2"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("2");
  });
  var song3 = document.getElementById("song3");
  song3.addEventListener("click", function () {
    canvasElement.className = "song-choice-3"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("3");
  });
  var song4 = document.getElementById("song4");
  song4.addEventListener("click", function () {
    canvasElement.className = "song-choice-4"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("4");
  });
  var song5 = document.getElementById("song5");
  song5.addEventListener("click", function () {
    canvasElement.className = "song-choice-5"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("5");
  });
  var song6 = document.getElementById("song6");
  song6.addEventListener("click", function () {
    canvasElement.className = "song-choice-6"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("6");
  });
  var song7 = document.getElementById("song7");
  song7.addEventListener("click", function () {
    canvasElement.className = "song-choice-7"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("7");
  });
  var song8 = document.getElementById("song8");
  song8.addEventListener("click", function () {
    canvasElement.className = "song-choice-8"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("8");
  });
  var song9 = document.getElementById("song9");
  song9.addEventListener("click", function () {
    canvasElement.className = "song-choice-9"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("9");
  });
  var song10 = document.getElementById("song10");
  song10.addEventListener("click", function () {
    canvasElement.className = "song-choice-10"; // startButton.disabled = false;

    audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("10");
  });
  startMenuButton.addEventListener("click", function () {
    startMenu.classList.remove("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.add("hidden");
  }); //set game area

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight; //start new game

  startButton.addEventListener("click", function () {
    startMenu.classList.add("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    var game = new Game();
    var options = {
      audioURL: audioURL,
      volume: volumeLvl
    };
    var gameview = new GameView(game, ctx, options).start();
  });
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map