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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var no_important_1 = require("aphrodite/no-important");
var InternalLineDrawing = /** @class */ (function (_super) {
    __extends(InternalLineDrawing, _super);
    function InternalLineDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            pathLengths: [],
            paths: [],
            uniqueId: null,
        };
        return _this;
    }
    InternalLineDrawing.prototype.render = function () {
        var _a = this.props, title = _a.title, delay = _a.delay, duration = _a.duration, pathStyle = _a.pathStyle, consistentDirection = _a.consistentDirection, className = _a.className, style = _a.style, width = _a.width, height = _a.height, delayRatio = _a.delayRatio, desc = _a.desc, bare = _a.bare, pathClassName = _a.pathClassName;
        var _b = this.state, paths = _b.paths, pathLengths = _b.pathLengths, uniqueId = _b.uniqueId;
        var durationMultiplier = 1.0 - (delayRatio || 0);
        var contents = paths.map(function (path, i) { return (React.createElement("path", { key: i + "_" + duration + "_" + durationMultiplier + "_" + delay + "_" + pathLengths[i], style: __assign({}, pathStyle, { strokeDasharray: pathLengths[i], strokeDashoffset: (i % 2 === 0 || consistentDirection ? 1 : -1) *
                    pathLengths[i], animationDelay: delay +
                    (i * duration) / paths.length + "ms", animationDuration: (duration * durationMultiplier) /
                    paths.length + "ms" }), className: no_important_1.css(styles.animatedLine) + " " + (pathClassName || ""), d: path })); });
        if (bare) {
            return contents;
        }
        return (React.createElement("svg", { viewBox: width && height ? "0 0 " + width + " " + height : undefined, className: className == null ? no_important_1.css(styles.absoluteOverlay) : className, style: style, preserveAspectRatio: "xMidYMid meet", "aria-hidden": title === null ? true : false, "aria-labelledby": uniqueId + "_title " + uniqueId + "_desc" },
            title && uniqueId ? (React.createElement("title", { id: uniqueId + "_title" }, title)) : null,
            desc && uniqueId ? (React.createElement("desc", { id: uniqueId + "_desc" }, desc)) : null,
            React.createElement("g", null, contents)));
    };
    InternalLineDrawing.prototype.componentDidMount = function () {
        this.setState({
            uniqueId: "_khannotations_LineDrawing_" + Math.random(),
        });
    };
    InternalLineDrawing.getDerivedStateFromProps = function (props, state) {
        var pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var paths = props.d
            .split("M")
            .slice(1)
            .map(function (p) { return "M" + p; });
        var pathLengths = paths.map(function (pathD) {
            pathEl.setAttribute("d", pathD);
            return pathEl.getTotalLength();
        });
        return {
            pathLengths: pathLengths,
            paths: paths,
            uniqueId: state.uniqueId,
        };
    };
    return InternalLineDrawing;
}(React.PureComponent));
exports.default = InternalLineDrawing;
var lineAnimation = {
    to: {
        strokeDashoffset: 0,
    },
};
var styles = no_important_1.StyleSheet.create({
    animatedLine: {
        animationName: lineAnimation,
        animationTimingFunction: "linear",
        animationFillMode: "forwards",
        animationEasingFunction: "ease-in-out",
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
//# sourceMappingURL=_LineDrawing.js.map