"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("../canvas");
var generator_1 = require("../generator");
var svg_1 = require("../svg");
exports.default = {
    canvas: function (canvas, config) {
        return new canvas_1.RoughCanvas(canvas, config);
    },
    svg: function (svg, config) {
        return new svg_1.RoughSVG(svg, config);
    },
    generator: function (config, surface) {
        return new generator_1.RoughGenerator(config, surface);
    }
};
//# sourceMappingURL=rough.js.map