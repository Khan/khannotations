"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("../canvas");
const generator_1 = require("../generator");
const svg_1 = require("../svg");
exports.default = {
    canvas(canvas, config) {
        return new canvas_1.RoughCanvas(canvas, config);
    },
    svg(svg, config) {
        return new svg_1.RoughSVG(svg, config);
    },
    generator(config, surface) {
        return new generator_1.RoughGenerator(config, surface);
    }
};
//# sourceMappingURL=rough.js.map