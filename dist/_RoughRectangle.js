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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var no_important_1 = require("aphrodite/no-important");
var rough_1 = __importDefault(require("./vendor/rough/src/wrappers/rough"));
var RoughRectangle = /** @class */ (function (_super) {
    __extends(RoughRectangle, _super);
    function RoughRectangle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            paths: [],
            pathLengths: [],
            pathStyle: {},
        };
        _this._svg = null;
        _this._reset = function () {
            var _a = _this.props, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2, roughness = _a.roughness, stroke = _a.stroke, strokeWidth = _a.strokeWidth, fill = _a.fill, fillStyle = _a.fillStyle;
            if (!_this._svg) {
                return;
            }
            var rsvg = rough_1.default.svg(_this._svg);
            var sline = rsvg.rectangle(x1, y1, x2 - x1, y2 - y1, {
                roughness: roughness,
                stroke: stroke,
                strokeWidth: strokeWidth,
                fill: fill,
                fillStyle: fillStyle,
                fillWeight: 4,
            });
            var pathEl = sline.querySelector("path");
            if (!pathEl) {
                return;
            }
            var paths = (pathEl.getAttribute("d") || "")
                .split("M")
                .slice(1)
                .map(function (v) { return "M" + v; });
            var pathLengths = paths.map(function (pathD) {
                pathEl.setAttribute("d", paths[0]);
                return pathEl.getTotalLength();
            });
            var pathStyle = {};
            for (var i = 0; i < pathEl.style.length; ++i) {
                var name_1 = pathEl.style[i];
                // HACK: TS doesn't support indexing style by string.
                var value = pathEl.style[pathEl.style[i]];
                var reactName = name_1.replace(/-([a-z])/g, function (g) {
                    return g[1].toUpperCase();
                });
                pathStyle[reactName] = value;
            }
            _this.setState({
                paths: paths,
                pathLengths: pathLengths,
                pathStyle: pathStyle,
            });
        };
        return _this;
    }
    RoughRectangle.prototype.render = function () {
        var _this = this;
        var _a = this.props, delay = _a.delay, duration = _a.duration, x1 = _a.x1, y1 = _a.y1, fillStyle = _a.fillStyle;
        var _b = this.state, paths = _b.paths, pathLengths = _b.pathLengths, pathStyle = _b.pathStyle;
        return (React.createElement("svg", { ref: function (svg) { return (_this._svg = svg); }, className: no_important_1.css(styles.absoluteOverlay), "aria-hidden": true },
            React.createElement("g", null, paths.map(function (path, i) { return (React.createElement("path", { style: __assign({}, pathStyle, { strokeDasharray: pathLengths[i] + 10, strokeDashoffset: (i % 2 ? -1 : 1) * (pathLengths[i] + 10), transformOrigin: x1 + "px " + y1 + "px", animationDelay: delay +
                        (i * duration) / paths.length + "ms", animationDuration: duration /
                        paths.length + "ms", transform: fillStyle === "solid"
                        ? "scaleX(0)"
                        : undefined }), className: no_important_1.css(fillStyle === "solid"
                    ? styles.animatedFill
                    : styles.animatedStroke), key: i, d: path })); }))));
    };
    RoughRectangle.prototype.componentDidMount = function () {
        this._reset();
    };
    RoughRectangle.prototype.shouldComponentUpdate = function (newProps, newState) {
        var _a = this.props, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        var paths = this.state.paths;
        return (x1 !== newProps.x1 ||
            x2 !== newProps.x2 ||
            y1 !== newProps.y1 ||
            y2 !== newProps.y2 ||
            paths.length !== newState.paths.length ||
            paths.some(function (path, idx) { return path !== newState.paths[idx]; }));
    };
    RoughRectangle.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
        if (x1 !== prevProps.x1 ||
            x2 !== prevProps.x2 ||
            y1 !== prevProps.y1 ||
            y2 !== prevProps.y2) {
            this._reset();
        }
    };
    return RoughRectangle;
}(React.Component));
exports.default = RoughRectangle;
var lineAnimation = {
    to: {
        strokeDashoffset: 0,
    },
};
var scaleAnimation = {
    from: {
        transform: "scaleX(0)",
    },
    to: {
        transform: "scaleX(1)",
    },
};
var styles = no_important_1.StyleSheet.create({
    animatedStroke: {
        animationName: lineAnimation,
        animationTimingFunction: "linear",
        animationFillMode: "forwards",
    },
    animatedFill: {
        animationName: scaleAnimation,
        animationTimingFunction: "learner",
        animationFillMode: "forwards",
    },
    absoluteOverlay: {
        overflow: "visible",
        position: "absolute",
        left: 0,
        top: 0,
        // Chrome/Safari do not render anything with width/height 0
        width: 1,
        height: 1,
        pointerEvents: "none",
    },
});
//# sourceMappingURL=_RoughRectangle.js.map