"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isType(token, type) {
    return token.type === type;
}
var PARAMS = {
    A: 7,
    a: 7,
    C: 6,
    c: 6,
    H: 1,
    h: 1,
    L: 2,
    l: 2,
    M: 2,
    m: 2,
    Q: 4,
    q: 4,
    S: 4,
    s: 4,
    T: 4,
    t: 2,
    V: 1,
    v: 1,
    Z: 0,
    z: 0
};
var ParsedPath = /** @class */ (function () {
    function ParsedPath(d) {
        this.COMMAND = 0;
        this.NUMBER = 1;
        this.EOD = 2;
        this.segments = [];
        this.parseData(d);
        this.processPoints();
    }
    ParsedPath.prototype.tokenize = function (d) {
        var tokens = new Array();
        while (d !== '') {
            if (d.match(/^([ \t\r\n,]+)/)) {
                d = d.substr(RegExp.$1.length);
            }
            else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
                tokens[tokens.length] = { type: this.COMMAND, text: RegExp.$1 };
                d = d.substr(RegExp.$1.length);
            }
            else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
                tokens[tokens.length] = { type: this.NUMBER, text: "" + parseFloat(RegExp.$1) };
                d = d.substr(RegExp.$1.length);
            }
            else {
                console.error('Unrecognized segment command: ' + d);
                return [];
            }
        }
        tokens[tokens.length] = { type: this.EOD, text: '' };
        return tokens;
    };
    ParsedPath.prototype.parseData = function (d) {
        var tokens = this.tokenize(d);
        var index = 0;
        var token = tokens[index];
        var mode = 'BOD';
        this.segments = new Array();
        while (!isType(token, this.EOD)) {
            var param_length = void 0;
            var params = new Array();
            if (mode === 'BOD') {
                if (token.text === 'M' || token.text === 'm') {
                    index++;
                    param_length = PARAMS[token.text];
                    mode = token.text;
                }
                else {
                    this.parseData('M0,0' + d);
                    return;
                }
            }
            else {
                if (isType(token, this.NUMBER)) {
                    param_length = PARAMS[mode];
                }
                else {
                    index++;
                    param_length = PARAMS[token.text];
                    mode = token.text;
                }
            }
            if ((index + param_length) < tokens.length) {
                for (var i = index; i < index + param_length; i++) {
                    var numbeToken = tokens[i];
                    if (isType(numbeToken, this.NUMBER)) {
                        params[params.length] = +numbeToken.text;
                    }
                    else {
                        console.error('Parameter type is not a number: ' + mode + ',' + numbeToken.text);
                        return;
                    }
                }
                if (typeof PARAMS[mode] === 'number') {
                    var segment = { key: mode, data: params };
                    this.segments.push(segment);
                    index += param_length;
                    token = tokens[index];
                    if (mode === 'M')
                        mode = 'L';
                    if (mode === 'm')
                        mode = 'l';
                }
                else {
                    console.error('Unsupported segment type: ' + mode);
                    return;
                }
            }
            else {
                console.error('Path data ended before all parameters were found');
            }
        }
    };
    Object.defineProperty(ParsedPath.prototype, "closed", {
        get: function () {
            if (typeof this._closed === 'undefined') {
                this._closed = false;
                for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                    var s = _a[_i];
                    if (s.key.toLowerCase() === 'z') {
                        this._closed = true;
                    }
                }
            }
            return this._closed;
        },
        enumerable: true,
        configurable: true
    });
    ParsedPath.prototype.processPoints = function () {
        var first = null;
        var currentPoint = [0, 0];
        for (var i = 0; i < this.segments.length; i++) {
            var s = this.segments[i];
            switch (s.key) {
                case 'M':
                case 'L':
                case 'T':
                    s.point = [s.data[0], s.data[1]];
                    break;
                case 'm':
                case 'l':
                case 't':
                    s.point = [s.data[0] + currentPoint[0], s.data[1] + currentPoint[1]];
                    break;
                case 'H':
                    s.point = [s.data[0], currentPoint[1]];
                    break;
                case 'h':
                    s.point = [s.data[0] + currentPoint[0], currentPoint[1]];
                    break;
                case 'V':
                    s.point = [currentPoint[0], s.data[0]];
                    break;
                case 'v':
                    s.point = [currentPoint[0], s.data[0] + currentPoint[1]];
                    break;
                case 'z':
                case 'Z':
                    if (first) {
                        s.point = [first[0], first[1]];
                    }
                    break;
                case 'C':
                    s.point = [s.data[4], s.data[5]];
                    break;
                case 'c':
                    s.point = [s.data[4] + currentPoint[0], s.data[5] + currentPoint[1]];
                    break;
                case 'S':
                    s.point = [s.data[2], s.data[3]];
                    break;
                case 's':
                    s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
                    break;
                case 'Q':
                    s.point = [s.data[2], s.data[3]];
                    break;
                case 'q':
                    s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
                    break;
                case 'A':
                    s.point = [s.data[5], s.data[6]];
                    break;
                case 'a':
                    s.point = [s.data[5] + currentPoint[0], s.data[6] + currentPoint[1]];
                    break;
            }
            if (s.key === 'm' || s.key === 'M') {
                first = null;
            }
            if (s.point) {
                currentPoint = s.point;
                if (!first) {
                    first = s.point;
                }
            }
            if (s.key === 'z' || s.key === 'Z') {
                first = null;
            }
        }
    };
    return ParsedPath;
}());
var RoughPath = /** @class */ (function () {
    function RoughPath(d) {
        this._position = [0, 0];
        this._first = null;
        this.bezierReflectionPoint = null;
        this.quadReflectionPoint = null;
        this.parsed = new ParsedPath(d);
    }
    Object.defineProperty(RoughPath.prototype, "segments", {
        get: function () {
            return this.parsed.segments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoughPath.prototype, "closed", {
        get: function () {
            return this.parsed.closed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoughPath.prototype, "linearPoints", {
        get: function () {
            if (!this._linearPoints) {
                var lp = [];
                var points = [];
                for (var _i = 0, _a = this.parsed.segments; _i < _a.length; _i++) {
                    var s = _a[_i];
                    var key = s.key.toLowerCase();
                    if (key === 'm' || key === 'z') {
                        if (points.length) {
                            lp.push(points);
                            points = [];
                        }
                        if (key === 'z') {
                            continue;
                        }
                    }
                    if (s.point) {
                        points.push(s.point);
                    }
                }
                if (points.length) {
                    lp.push(points);
                    points = [];
                }
                this._linearPoints = lp;
            }
            return this._linearPoints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoughPath.prototype, "first", {
        get: function () {
            return this._first;
        },
        set: function (v) {
            this._first = v;
        },
        enumerable: true,
        configurable: true
    });
    RoughPath.prototype.setPosition = function (x, y) {
        this._position = [x, y];
        if (!this._first) {
            this._first = [x, y];
        }
    };
    Object.defineProperty(RoughPath.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoughPath.prototype, "x", {
        get: function () {
            return this._position[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoughPath.prototype, "y", {
        get: function () {
            return this._position[1];
        },
        enumerable: true,
        configurable: true
    });
    return RoughPath;
}());
exports.RoughPath = RoughPath;
// Algorithm as described in https://www.w3.org/TR/SVG/implnote.html
// Code adapted from nsSVGPathDataParser.cpp in Mozilla 
// https://hg.mozilla.org/mozilla-central/file/17156fbebbc8/content/svg/content/src/nsSVGPathDataParser.cpp#l887
var RoughArcConverter = /** @class */ (function () {
    function RoughArcConverter(from, to, radii, angle, largeArcFlag, sweepFlag) {
        this._segIndex = 0;
        this._numSegs = 0;
        this._rx = 0;
        this._ry = 0;
        this._sinPhi = 0;
        this._cosPhi = 0;
        this._C = [0, 0];
        this._theta = 0;
        this._delta = 0;
        this._T = 0;
        this._from = from;
        if (from[0] === to[0] && from[1] === to[1]) {
            return;
        }
        var radPerDeg = Math.PI / 180;
        this._rx = Math.abs(radii[0]);
        this._ry = Math.abs(radii[1]);
        this._sinPhi = Math.sin(angle * radPerDeg);
        this._cosPhi = Math.cos(angle * radPerDeg);
        var x1dash = this._cosPhi * (from[0] - to[0]) / 2.0 + this._sinPhi * (from[1] - to[1]) / 2.0;
        var y1dash = -this._sinPhi * (from[0] - to[0]) / 2.0 + this._cosPhi * (from[1] - to[1]) / 2.0;
        var root = 0;
        var numerator = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * y1dash * y1dash - this._ry * this._ry * x1dash * x1dash;
        if (numerator < 0) {
            var s = Math.sqrt(1 - (numerator / (this._rx * this._rx * this._ry * this._ry)));
            this._rx = this._rx * s;
            this._ry = this._ry * s;
            root = 0;
        }
        else {
            root = (largeArcFlag === sweepFlag ? -1.0 : 1.0) *
                Math.sqrt(numerator / (this._rx * this._rx * y1dash * y1dash + this._ry * this._ry * x1dash * x1dash));
        }
        var cxdash = root * this._rx * y1dash / this._ry;
        var cydash = -root * this._ry * x1dash / this._rx;
        this._C = [0, 0];
        this._C[0] = this._cosPhi * cxdash - this._sinPhi * cydash + (from[0] + to[0]) / 2.0;
        this._C[1] = this._sinPhi * cxdash + this._cosPhi * cydash + (from[1] + to[1]) / 2.0;
        this._theta = this.calculateVectorAngle(1.0, 0.0, (x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry);
        var dtheta = this.calculateVectorAngle((x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry, (-x1dash - cxdash) / this._rx, (-y1dash - cydash) / this._ry);
        if ((!sweepFlag) && (dtheta > 0)) {
            dtheta -= 2 * Math.PI;
        }
        else if (sweepFlag && (dtheta < 0)) {
            dtheta += 2 * Math.PI;
        }
        this._numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
        this._delta = dtheta / this._numSegs;
        this._T = (8 / 3) * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2);
    }
    RoughArcConverter.prototype.getNextSegment = function () {
        if (this._segIndex === this._numSegs) {
            return null;
        }
        var cosTheta1 = Math.cos(this._theta);
        var sinTheta1 = Math.sin(this._theta);
        var theta2 = this._theta + this._delta;
        var cosTheta2 = Math.cos(theta2);
        var sinTheta2 = Math.sin(theta2);
        var to = [
            this._cosPhi * this._rx * cosTheta2 - this._sinPhi * this._ry * sinTheta2 + this._C[0],
            this._sinPhi * this._rx * cosTheta2 + this._cosPhi * this._ry * sinTheta2 + this._C[1]
        ];
        var cp1 = [
            this._from[0] + this._T * (-this._cosPhi * this._rx * sinTheta1 - this._sinPhi * this._ry * cosTheta1),
            this._from[1] + this._T * (-this._sinPhi * this._rx * sinTheta1 + this._cosPhi * this._ry * cosTheta1)
        ];
        var cp2 = [
            to[0] + this._T * (this._cosPhi * this._rx * sinTheta2 + this._sinPhi * this._ry * cosTheta2),
            to[1] + this._T * (this._sinPhi * this._rx * sinTheta2 - this._cosPhi * this._ry * cosTheta2)
        ];
        this._theta = theta2;
        this._from = [to[0], to[1]];
        this._segIndex++;
        return {
            cp1: cp1,
            cp2: cp2,
            to: to
        };
    };
    RoughArcConverter.prototype.calculateVectorAngle = function (ux, uy, vx, vy) {
        var ta = Math.atan2(uy, ux);
        var tb = Math.atan2(vy, vx);
        if (tb >= ta)
            return tb - ta;
        return 2 * Math.PI - (ta - tb);
    };
    return RoughArcConverter;
}());
exports.RoughArcConverter = RoughArcConverter;
var PathFitter = /** @class */ (function () {
    function PathFitter(sets, closed) {
        this.sets = sets;
        this.closed = closed;
    }
    PathFitter.prototype.fit = function (simplification) {
        var outSets = [];
        for (var _i = 0, _a = this.sets; _i < _a.length; _i++) {
            var set = _a[_i];
            var length_1 = set.length;
            var estLength = Math.floor(simplification * length_1);
            if (estLength < 5) {
                if (length_1 <= 5) {
                    continue;
                }
                estLength = 5;
            }
            outSets.push(this.reduce(set, estLength));
        }
        var d = '';
        for (var _b = 0, outSets_1 = outSets; _b < outSets_1.length; _b++) {
            var set = outSets_1[_b];
            for (var i = 0; i < set.length; i++) {
                var point = set[i];
                if (i === 0) {
                    d += 'M' + point[0] + ',' + point[1];
                }
                else {
                    d += 'L' + point[0] + ',' + point[1];
                }
            }
            if (this.closed) {
                d += 'z ';
            }
        }
        return d;
    };
    PathFitter.prototype.distance = function (p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    };
    PathFitter.prototype.reduce = function (set, count) {
        if (set.length <= count) {
            return set;
        }
        var points = set.slice(0);
        while (points.length > count) {
            var areas = [];
            var minArea = -1;
            var minIndex = -1;
            for (var i = 1; i < (points.length - 1); i++) {
                var a = this.distance(points[i - 1], points[i]);
                var b = this.distance(points[i], points[i + 1]);
                var c = this.distance(points[i - 1], points[i + 1]);
                var s = (a + b + c) / 2.0;
                var area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                areas.push(area);
                if ((minArea < 0) || (area < minArea)) {
                    minArea = area;
                    minIndex = i;
                }
            }
            if (minIndex > 0) {
                points.splice(minIndex, 1);
            }
            else {
                break;
            }
        }
        return points;
    };
    return PathFitter;
}());
exports.PathFitter = PathFitter;
//# sourceMappingURL=path.js.map