"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var generator_base_1 = require("./generator-base");
var renderer_1 = require("./renderer");
var RoughGenerator = /** @class */ (function (_super) {
    __extends(RoughGenerator, _super);
    function RoughGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RoughGenerator.prototype.line = function (x1, y1, x2, y2, options) {
        var o = this._options(options);
        return this._drawable('line', [renderer_1.line(x1, y1, x2, y2, o)], o);
    };
    RoughGenerator.prototype.rectangle = function (x, y, width, height, options) {
        var o = this._options(options);
        var paths = [];
        if (o.fill) {
            var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
            if (o.fillStyle === 'solid') {
                paths.push(renderer_1.solidFillPolygon(points, o));
            }
            else {
                paths.push(renderer_1.patternFillPolygon(points, o));
            }
        }
        paths.push(renderer_1.rectangle(x, y, width, height, o));
        return this._drawable('rectangle', paths, o);
    };
    RoughGenerator.prototype.ellipse = function (x, y, width, height, options) {
        var o = this._options(options);
        var paths = [];
        if (o.fill) {
            if (o.fillStyle === 'solid') {
                var shape = renderer_1.ellipse(x, y, width, height, o);
                shape.type = 'fillPath';
                paths.push(shape);
            }
            else {
                paths.push(renderer_1.patternFillEllipse(x, y, width, height, o));
            }
        }
        paths.push(renderer_1.ellipse(x, y, width, height, o));
        return this._drawable('ellipse', paths, o);
    };
    RoughGenerator.prototype.circle = function (x, y, diameter, options) {
        var ret = this.ellipse(x, y, diameter, diameter, options);
        ret.shape = 'circle';
        return ret;
    };
    RoughGenerator.prototype.linearPath = function (points, options) {
        var o = this._options(options);
        return this._drawable('linearPath', [renderer_1.linearPath(points, false, o)], o);
    };
    RoughGenerator.prototype.arc = function (x, y, width, height, start, stop, closed, options) {
        if (closed === void 0) { closed = false; }
        var o = this._options(options);
        var paths = [];
        if (closed && o.fill) {
            if (o.fillStyle === 'solid') {
                var shape = renderer_1.arc(x, y, width, height, start, stop, true, false, o);
                shape.type = 'fillPath';
                paths.push(shape);
            }
            else {
                paths.push(renderer_1.patternFillArc(x, y, width, height, start, stop, o));
            }
        }
        paths.push(renderer_1.arc(x, y, width, height, start, stop, closed, true, o));
        return this._drawable('arc', paths, o);
    };
    RoughGenerator.prototype.curve = function (points, options) {
        var o = this._options(options);
        return this._drawable('curve', [renderer_1.curve(points, o)], o);
    };
    RoughGenerator.prototype.polygon = function (points, options) {
        var o = this._options(options);
        var paths = [];
        if (o.fill) {
            if (o.fillStyle === 'solid') {
                paths.push(renderer_1.solidFillPolygon(points, o));
            }
            else {
                var size = this.computePolygonSize(points);
                var fillPoints = [
                    [0, 0],
                    [size[0], 0],
                    [size[0], size[1]],
                    [0, size[1]]
                ];
                var shape = renderer_1.patternFillPolygon(fillPoints, o);
                shape.type = 'path2Dpattern';
                shape.size = size;
                shape.path = this.polygonPath(points);
                paths.push(shape);
            }
        }
        paths.push(renderer_1.linearPath(points, true, o));
        return this._drawable('polygon', paths, o);
    };
    RoughGenerator.prototype.path = function (d, options) {
        var o = this._options(options);
        var paths = [];
        if (!d) {
            return this._drawable('path', paths, o);
        }
        if (o.fill) {
            if (o.fillStyle === 'solid') {
                var shape = { type: 'path2Dfill', path: d, ops: [] };
                paths.push(shape);
            }
            else {
                var size = this.computePathSize(d);
                var points = [
                    [0, 0],
                    [size[0], 0],
                    [size[0], size[1]],
                    [0, size[1]]
                ];
                var shape = renderer_1.patternFillPolygon(points, o);
                shape.type = 'path2Dpattern';
                shape.size = size;
                shape.path = d;
                paths.push(shape);
            }
        }
        paths.push(renderer_1.svgPath(d, o));
        return this._drawable('path', paths, o);
    };
    return RoughGenerator;
}(generator_base_1.RoughGeneratorBase));
exports.RoughGenerator = RoughGenerator;
//# sourceMappingURL=generator.js.map