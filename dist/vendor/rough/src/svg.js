(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./generator", "./svg-base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const generator_1 = require("./generator");
    const svg_base_1 = require("./svg-base");
    class RoughSVG extends svg_base_1.RoughSVGBase {
        constructor(svg, config) {
            super(svg);
            this.gen = new generator_1.RoughGenerator(config || null, this.svg);
        }
        get generator() {
            return this.gen;
        }
        getDefaultOptions() {
            return this.gen.defaultOptions;
        }
        opsToPath(drawing) {
            return this.gen.opsToPath(drawing);
        }
        line(x1, y1, x2, y2, options) {
            const d = this.gen.line(x1, y1, x2, y2, options);
            return this.draw(d);
        }
        rectangle(x, y, width, height, options) {
            const d = this.gen.rectangle(x, y, width, height, options);
            return this.draw(d);
        }
        ellipse(x, y, width, height, options) {
            const d = this.gen.ellipse(x, y, width, height, options);
            return this.draw(d);
        }
        circle(x, y, diameter, options) {
            const d = this.gen.circle(x, y, diameter, options);
            return this.draw(d);
        }
        linearPath(points, options) {
            const d = this.gen.linearPath(points, options);
            return this.draw(d);
        }
        polygon(points, options) {
            const d = this.gen.polygon(points, options);
            return this.draw(d);
        }
        arc(x, y, width, height, start, stop, closed = false, options) {
            const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
            return this.draw(d);
        }
        curve(points, options) {
            const d = this.gen.curve(points, options);
            return this.draw(d);
        }
        path(d, options) {
            const drawing = this.gen.path(d, options);
            return this.draw(drawing);
        }
    }
    exports.RoughSVG = RoughSVG;
});
//# sourceMappingURL=svg.js.map