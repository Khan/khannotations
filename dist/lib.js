(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./AnimatedLineDrawing", "./AnimationGroup", "./RoughCircledBox", "./RoughHighlight", "./RoughUnderline"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./AnimatedLineDrawing"));
    __export(require("./AnimationGroup"));
    __export(require("./RoughCircledBox"));
    __export(require("./RoughHighlight"));
    __export(require("./RoughUnderline"));
});
//# sourceMappingURL=lib.js.map