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
var React = __importStar(require("react"));
var rough_1 = __importDefault(require("./vendor/rough/src/wrappers/rough"));
var _LineDrawing_1 = __importDefault(require("./_LineDrawing"));
var RoughLine = /** @class */ (function (_super) {
    __extends(RoughLine, _super);
    function RoughLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            d: null,
            pathStyle: {},
        };
        _this._reset = function () {
            var _a = _this.props, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2, duration = _a.duration, delay = _a.delay, stroke = _a.stroke, strokeWidth = _a.strokeWidth, roughJsOptions = __rest(_a, ["x1", "y1", "x2", "y2", "duration", "delay", "stroke", "strokeWidth"]);
            if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                return;
            }
            var roughG = rough_1.default.generator(null, null);
            var line = roughG.line(x1, y1, x2, y2, roughJsOptions);
            _this.setState({
                d: roughG.opsToPath(line.sets[0]),
                pathStyle: {
                    stroke: stroke || "black",
                    strokeWidth: strokeWidth || 1,
                    fill: "none",
                },
            });
        };
        return _this;
    }
    RoughLine.prototype.render = function () {
        var _a = this.props, delay = _a.delay, duration = _a.duration;
        var _b = this.state, d = _b.d, pathStyle = _b.pathStyle;
        return (d && (React.createElement(_LineDrawing_1.default, { title: null, delay: delay, duration: duration, d: d, pathStyle: pathStyle })));
    };
    RoughLine.prototype.componentDidMount = function () {
        this._reset();
    };
    RoughLine.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        if (x1 !== prevProps.x1 ||
            x2 !== prevProps.x2 ||
            y1 !== prevProps.y1 ||
            y2 !== prevProps.y2) {
            this._reset();
        }
    };
    return RoughLine;
}(React.PureComponent));
exports.default = RoughLine;
//# sourceMappingURL=_RoughLine.js.map