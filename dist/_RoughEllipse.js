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
var RoughEllipse = /** @class */ (function (_super) {
    __extends(RoughEllipse, _super);
    function RoughEllipse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            d: null,
            pathStyle: {},
        };
        _this._reset = function () {
            var _a = _this.props, x = _a.x, y = _a.y, width = _a.width, height = _a.height, duration = _a.duration, delay = _a.delay, stroke = _a.stroke, strokeWidth = _a.strokeWidth, roughJsOptions = __rest(_a, ["x", "y", "width", "height", "duration", "delay", "stroke", "strokeWidth"]);
            if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                return;
            }
            var roughG = rough_1.default.generator(null, null);
            var ellipse = roughG.ellipse(x, y, width, height, roughJsOptions);
            _this.setState({
                d: roughG.opsToPath(ellipse.sets[0]),
                pathStyle: {
                    stroke: stroke || "black",
                    strokeWidth: strokeWidth || 1,
                    fill: "none",
                },
            });
        };
        return _this;
    }
    RoughEllipse.prototype.render = function () {
        var _a = this.props, delay = _a.delay, duration = _a.duration;
        var _b = this.state, d = _b.d, pathStyle = _b.pathStyle;
        return (d && (React.createElement(_LineDrawing_1.default, { title: null, delay: delay, duration: duration, d: d, pathStyle: pathStyle, consistentDirection: true })));
    };
    RoughEllipse.prototype.componentDidMount = function () {
        this._reset();
    };
    RoughEllipse.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        if (x !== prevProps.x ||
            y !== prevProps.y ||
            width !== prevProps.width ||
            height !== prevProps.height) {
            this._reset();
        }
    };
    return RoughEllipse;
}(React.PureComponent));
exports.default = RoughEllipse;
//# sourceMappingURL=_RoughEllipse.js.map