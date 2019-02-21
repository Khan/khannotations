"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const rough_1 = __importDefault(require("./vendor/rough/src/wrappers/rough"));
const _LineDrawing_1 = __importDefault(require("./_LineDrawing"));
class RoughLine extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            d: null,
            pathStyle: {},
        };
        this._reset = () => {
            let _a = this.props, { x1, y1, x2, y2, duration, delay, stroke, strokeWidth } = _a, roughJsOptions = __rest(_a, ["x1", "y1", "x2", "y2", "duration", "delay", "stroke", "strokeWidth"]);
            if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                return;
            }
            let roughG = rough_1.default.generator(null, null);
            let line = roughG.line(x1, y1, x2, y2, roughJsOptions);
            this.setState({
                d: roughG.opsToPath(line.sets[0]),
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
        return (d && (React.createElement(_LineDrawing_1.default, { title: null, delay: delay, duration: duration, d: d, pathStyle: pathStyle })));
    }
    componentDidMount() {
        this._reset();
    }
    componentDidUpdate(prevProps) {
        let { x1, y1, x2, y2 } = this.props;
        if (x1 !== prevProps.x1 ||
            x2 !== prevProps.x2 ||
            y1 !== prevProps.y1 ||
            y2 !== prevProps.y2) {
            this._reset();
        }
    }
}
exports.default = RoughLine;
//# sourceMappingURL=_RoughLine.js.map