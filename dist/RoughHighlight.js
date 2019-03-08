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
var _MeasureLines_1 = __importDefault(require("./_MeasureLines"));
var _RoughRectangle_1 = __importDefault(require("./_RoughRectangle"));
var AnimationGroup_1 = require("./AnimationGroup");
/**
 * Connected implementation of [[RoughHighlight]]
 */
var _RoughHighlight = /** @class */ (function (_super) {
    __extends(_RoughHighlight, _super);
    function _RoughHighlight() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @hidden */
        _this.state = {
            triggered: false,
        };
        _this.trigger = function () {
            _this.setState({
                triggered: true,
            });
        };
        _this.estimatedDuration = null;
        return _this;
    }
    _RoughHighlight.prototype.componentWillUnmount = function () {
        if (this.props.group) {
            this.props.group.unregister(this);
        }
    };
    /** @hidden */
    _RoughHighlight.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, animation = _a.animation, roughStyle = _a.roughStyle, group = _a.group;
        return (React.createElement("span", null,
            React.createElement(_MeasureLines_1.default, { text: children }, function (lines) {
                var durations;
                var gap;
                var totalLength = lines.reduce(function (memo, line) { return memo + line.right - line.left; }, 0);
                if (animation.animation === "none") {
                    durations = lines.map(function () { return 0; });
                }
                else if (animation.animation === "duration") {
                    gap = Math.min(100, (animation.duration / lines.length) * 0.05);
                    var animateTime_1 = animation.duration - gap * (lines.length - 1);
                    durations = lines.map(function (line) {
                        return ((line.right - line.left) / totalLength) *
                            animateTime_1;
                    });
                }
                else if (animation.animation === "speed") {
                    gap = 100;
                    durations = lines.map(function (line) {
                        return ((line.right - line.left) * 10) /
                            animation.speed;
                    });
                }
                else {
                    throw new Error("Invalid animation type.");
                }
                var timeSoFar = animation.animation === "none"
                    ? 0
                    : animation.delay;
                var delays = lines.map(function (line, i) {
                    var myDelay = timeSoFar;
                    timeSoFar += durations[i] + gap;
                    return myDelay;
                });
                if (group && !_this.state.triggered) {
                    _this.estimatedDuration = timeSoFar;
                    group.register(_this);
                    return null;
                }
                return (React.createElement(React.Fragment, null, lines.map(function (_a, i) {
                    var left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
                    return (React.createElement(_RoughRectangle_1.default, { key: i, x1: left, x2: right, y1: top, y2: bottom, roughness: roughStyle.roughness, fill: roughStyle.fill, fillStyle: "solid", stroke: "none", duration: durations[i], delay: delays[i] }));
                })));
            })));
    };
    return _RoughHighlight;
}(React.Component));
/**
 * Draw an animated highlight behind some inline text.
 *
 * ![Screen capture](media://RoughHighlight.gif)
 *
 * **Props**: [[RoughHighlightProps]]
 *
 * @noInheritDoc
 */
var RoughHighlight = /** @class */ (function (_super) {
    __extends(RoughHighlight, _super);
    function RoughHighlight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @hidden */
    RoughHighlight.prototype.render = function () {
        var props = this.props;
        return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, function (group) { return React.createElement(_RoughHighlight, __assign({ group: group }, props)); }));
    };
    return RoughHighlight;
}(React.Component));
exports.RoughHighlight = RoughHighlight;
//# sourceMappingURL=RoughHighlight.js.map