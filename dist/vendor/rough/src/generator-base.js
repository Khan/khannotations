"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hasSelf = typeof self !== 'undefined';
var RoughGeneratorBase = /** @class */ (function () {
    function RoughGeneratorBase(config, surface) {
        this.defaultOptions = {
            maxRandomnessOffset: 2,
            roughness: 1,
            bowing: 1,
            stroke: '#000',
            strokeWidth: 1,
            curveTightness: 0,
            curveStepCount: 9,
            fillStyle: 'hachure',
            fillWeight: -1,
            hachureAngle: -41,
            hachureGap: -1
        };
        this.config = config || {};
        this.surface = surface;
        if (this.config.options) {
            this.defaultOptions = this._options(this.config.options);
        }
    }
    RoughGeneratorBase.prototype._options = function (options) {
        return options ? Object.assign({}, this.defaultOptions, options) : this.defaultOptions;
    };
    RoughGeneratorBase.prototype._drawable = function (shape, sets, options) {
        return { shape: shape, sets: sets || [], options: options || this.defaultOptions };
    };
    RoughGeneratorBase.prototype.getCanvasSize = function () {
        var val = function (w) {
            if (w && typeof w === 'object') {
                if (w.baseVal && w.baseVal.value) {
                    return w.baseVal.value;
                }
            }
            return w || 100;
        };
        if (this.surface) {
            return [val(this.surface.width), val(this.surface.height)];
        }
        return [100, 100];
    };
    RoughGeneratorBase.prototype.computePolygonSize = function (points) {
        if (points.length) {
            var left = points[0][0];
            var right = points[0][0];
            var top_1 = points[0][1];
            var bottom = points[0][1];
            for (var i = 1; i < points.length; i++) {
                left = Math.min(left, points[i][0]);
                right = Math.max(right, points[i][0]);
                top_1 = Math.min(top_1, points[i][1]);
                bottom = Math.max(bottom, points[i][1]);
            }
            return [(right - left), (bottom - top_1)];
        }
        return [0, 0];
    };
    RoughGeneratorBase.prototype.polygonPath = function (points) {
        var d = '';
        if (points.length) {
            d = "M" + points[0][0] + "," + points[0][1];
            for (var i = 1; i < points.length; i++) {
                d = d + " L" + points[i][0] + "," + points[i][1];
            }
        }
        return d;
    };
    RoughGeneratorBase.prototype.computePathSize = function (d) {
        var size = [0, 0];
        if (hasSelf && self.document) {
            try {
                var ns = 'http://www.w3.org/2000/svg';
                var svg = self.document.createElementNS(ns, 'svg');
                svg.setAttribute('width', '0');
                svg.setAttribute('height', '0');
                var pathNode = self.document.createElementNS(ns, 'path');
                pathNode.setAttribute('d', d);
                svg.appendChild(pathNode);
                self.document.body.appendChild(svg);
                var bb = pathNode.getBBox();
                if (bb) {
                    size[0] = bb.width || 0;
                    size[1] = bb.height || 0;
                }
                self.document.body.removeChild(svg);
            }
            catch (err) { }
        }
        var canvasSize = this.getCanvasSize();
        if (!(size[0] * size[1])) {
            size = canvasSize;
        }
        return size;
    };
    RoughGeneratorBase.prototype.toPaths = function (drawable) {
        var sets = drawable.sets || [];
        var o = drawable.options || this.defaultOptions;
        var paths = [];
        for (var _i = 0, sets_1 = sets; _i < sets_1.length; _i++) {
            var drawing = sets_1[_i];
            var path = null;
            switch (drawing.type) {
                case 'path':
                    path = {
                        d: this.opsToPath(drawing),
                        stroke: o.stroke,
                        strokeWidth: o.strokeWidth,
                        fill: 'none'
                    };
                    break;
                case 'fillPath':
                    path = {
                        d: this.opsToPath(drawing),
                        stroke: 'none',
                        strokeWidth: 0,
                        fill: o.fill || 'none'
                    };
                    break;
                case 'fillSketch':
                    path = this.fillSketch(drawing, o);
                    break;
                case 'path2Dfill':
                    path = {
                        d: drawing.path || '',
                        stroke: 'none',
                        strokeWidth: 0,
                        fill: o.fill || 'none'
                    };
                    break;
                case 'path2Dpattern': {
                    var size = drawing.size;
                    var pattern = {
                        x: 0, y: 0, width: 1, height: 1,
                        viewBox: "0 0 " + Math.round(size[0]) + " " + Math.round(size[1]),
                        patternUnits: 'objectBoundingBox',
                        path: this.fillSketch(drawing, o)
                    };
                    path = {
                        d: drawing.path,
                        stroke: 'none',
                        strokeWidth: 0,
                        pattern: pattern
                    };
                    break;
                }
            }
            if (path) {
                paths.push(path);
            }
        }
        return paths;
    };
    RoughGeneratorBase.prototype.fillSketch = function (drawing, o) {
        var fweight = o.fillWeight;
        if (fweight < 0) {
            fweight = o.strokeWidth / 2;
        }
        return {
            d: this.opsToPath(drawing),
            stroke: o.fill || 'none',
            strokeWidth: fweight,
            fill: 'none'
        };
    };
    RoughGeneratorBase.prototype.opsToPath = function (drawing) {
        var path = '';
        for (var _i = 0, _a = drawing.ops; _i < _a.length; _i++) {
            var item = _a[_i];
            var data = item.data;
            switch (item.op) {
                case 'move':
                    path += "M" + data[0] + " " + data[1] + " ";
                    break;
                case 'bcurveTo':
                    path += "C" + data[0] + " " + data[1] + ", " + data[2] + " " + data[3] + ", " + data[4] + " " + data[5] + " ";
                    break;
                case 'qcurveTo':
                    path += "Q" + data[0] + " " + data[1] + ", " + data[2] + " " + data[3] + " ";
                    break;
                case 'lineTo':
                    path += "L" + data[0] + " " + data[1] + " ";
                    break;
            }
        }
        return path.trim();
    };
    return RoughGeneratorBase;
}());
exports.RoughGeneratorBase = RoughGeneratorBase;
//# sourceMappingURL=generator-base.js.map