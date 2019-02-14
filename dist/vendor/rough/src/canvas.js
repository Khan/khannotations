(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./generator", "./canvas-base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const generator_1 = require("./generator");
    const canvas_base_1 = require("./canvas-base");
    class RoughCanvas extends canvas_base_1.RoughCanvasBase {
        constructor(canvas, config) {
            super(canvas);
            this.gen = new generator_1.RoughGenerator(config || null, this.canvas);
        }
        get generator() {
            return this.gen;
        }
        getDefaultOptions() {
            return this.gen.defaultOptions;
        }
        line(x1, y1, x2, y2, options) {
            const d = this.gen.line(x1, y1, x2, y2, options);
            this.draw(d);
            return d;
        }
        rectangle(x, y, width, height, options) {
            const d = this.gen.rectangle(x, y, width, height, options);
            this.draw(d);
            return d;
        }
        ellipse(x, y, width, height, options) {
            const d = this.gen.ellipse(x, y, width, height, options);
            this.draw(d);
            return d;
        }
        circle(x, y, diameter, options) {
            const d = this.gen.circle(x, y, diameter, options);
            this.draw(d);
            return d;
        }
        linearPath(points, options) {
            const d = this.gen.linearPath(points, options);
            this.draw(d);
            return d;
        }
        polygon(points, options) {
            const d = this.gen.polygon(points, options);
            this.draw(d);
            return d;
        }
        arc(x, y, width, height, start, stop, closed = false, options) {
            const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
            this.draw(d);
            return d;
        }
        curve(points, options) {
            const d = this.gen.curve(points, options);
            this.draw(d);
            return d;
        }
        path(d, options) {
            const drawing = this.gen.path(d, options);
            this.draw(drawing);
            return drawing;
        }
    }
    exports.RoughCanvas = RoughCanvas;
});
//# sourceMappingURL=canvas.js.map