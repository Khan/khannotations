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
var generator_1 = require("./generator");
var canvas_base_1 = require("./canvas-base");
var RoughCanvas = /** @class */ (function (_super) {
    __extends(RoughCanvas, _super);
    function RoughCanvas(canvas, config) {
        var _this = _super.call(this, canvas) || this;
        _this.gen = new generator_1.RoughGenerator(config || null, _this.canvas);
        return _this;
    }
    Object.defineProperty(RoughCanvas.prototype, "generator", {
        get: function () {
            return this.gen;
        },
        enumerable: true,
        configurable: true
    });
    RoughCanvas.prototype.getDefaultOptions = function () {
        return this.gen.defaultOptions;
    };
    RoughCanvas.prototype.line = function (x1, y1, x2, y2, options) {
        var d = this.gen.line(x1, y1, x2, y2, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.rectangle = function (x, y, width, height, options) {
        var d = this.gen.rectangle(x, y, width, height, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.ellipse = function (x, y, width, height, options) {
        var d = this.gen.ellipse(x, y, width, height, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.circle = function (x, y, diameter, options) {
        var d = this.gen.circle(x, y, diameter, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.linearPath = function (points, options) {
        var d = this.gen.linearPath(points, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.polygon = function (points, options) {
        var d = this.gen.polygon(points, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.arc = function (x, y, width, height, start, stop, closed, options) {
        if (closed === void 0) { closed = false; }
        var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.curve = function (points, options) {
        var d = this.gen.curve(points, options);
        this.draw(d);
        return d;
    };
    RoughCanvas.prototype.path = function (d, options) {
        var drawing = this.gen.path(d, options);
        this.draw(drawing);
        return drawing;
    };
    return RoughCanvas;
}(canvas_base_1.RoughCanvasBase));
exports.RoughCanvas = RoughCanvas;
//# sourceMappingURL=canvas.js.map