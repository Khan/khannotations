var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "aphrodite/no-important", "./vendor/rough/src/wrappers/rough", "./_LineDrawing"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = __importStar(require("react"));
    const no_important_1 = require("aphrodite/no-important");
    const rough_1 = __importDefault(require("./vendor/rough/src/wrappers/rough"));
    const _LineDrawing_1 = __importDefault(require("./_LineDrawing"));
    class RoughEllipse extends React.PureComponent {
        constructor() {
            super(...arguments);
            this.state = {
                d: null,
                pathStyle: {},
            };
            this._reset = () => {
                let _a = this.props, { x, y, width, height, duration, delay, stroke, strokeWidth } = _a, roughJsOptions = __rest(_a, ["x", "y", "width", "height", "duration", "delay", "stroke", "strokeWidth"]);
                if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                    return;
                }
                let roughG = rough_1.default.generator(null, null);
                const ellipse = roughG.ellipse(x, y, width, height, roughJsOptions);
                this.setState({
                    d: roughG.opsToPath(ellipse.sets[0]),
                    pathStyle: {
                        stroke: stroke || "black",
                        strokeWidth: strokeWidth || 1,
                        fill: "none",
                    },
                });
            };
        }
        render() {
            const { delay, duration } = this.props;
            const { d, pathStyle } = this.state;
            return (d && (React.createElement(_LineDrawing_1.default, { delay: delay, duration: duration, d: d, pathStyle: pathStyle, consistentDirection: true })));
        }
        componentDidMount() {
            this._reset();
        }
        componentDidUpdate(prevProps) {
            let { x, y, width, height } = this.props;
            if (x !== prevProps.x ||
                y !== prevProps.y ||
                width !== prevProps.width ||
                height !== prevProps.height) {
                this._reset();
            }
        }
    }
    exports.default = RoughEllipse;
    const lineAnimation = {
        to: {
            strokeDashoffset: 0,
        },
    };
    const styles = no_important_1.StyleSheet.create({
        animatedLine: {
            animationName: lineAnimation,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
        },
    });
});
//# sourceMappingURL=_RoughEllipse.js.map