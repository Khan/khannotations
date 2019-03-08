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
var _RoughLine_1 = __importDefault(require("./_RoughLine"));
var _MeasureLines_1 = __importDefault(require("./_MeasureLines"));
var AnimationGroup_1 = require("./AnimationGroup");
/**
 * Connected implementation of [[RoughUnderline]].
 */
var _RoughUnderline = /** @class */ (function (_super) {
    __extends(_RoughUnderline, _super);
    function _RoughUnderline() {
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
    /** @hidden */
    _RoughUnderline.prototype.componentDidMount = function () {
        if (this.props.group) {
            this.props.group.register(this);
        }
    };
    /** @hidden */
    _RoughUnderline.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.group !== prevProps.group) {
            if (prevProps.group) {
                prevProps.group.unregister(this);
            }
            if (this.props.group) {
                this.props.group.register(this);
            }
        }
    };
    /** @hidden */
    _RoughUnderline.prototype.componentWillUnmount = function () {
        if (this.props.group) {
            this.props.group.unregister(this);
        }
    };
    /** @hidden */
    _RoughUnderline.prototype.render = function () {
        var _this = this;
        var _a = this.props, animation = _a.animation, roughStyle = _a.roughStyle, children = _a.children, group = _a.group;
        return (React.createElement(_MeasureLines_1.default, { text: children }, function (lines) {
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
            var timeSoFar = animation.animation === "none" ? 0 : animation.delay;
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
                var left = _a.left, right = _a.right, bottom = _a.bottom;
                var bowing;
                if (roughStyle.bowing.bowing === "fixed") {
                    bowing = roughStyle.bowing.amount;
                }
                else {
                    bowing =
                        roughStyle.bowing.ratio /
                            (right - left);
                }
                return (React.createElement(_RoughLine_1.default, { key: i, x1: left, x2: right, y1: bottom - roughStyle.lift, y2: bottom - roughStyle.lift, roughness: roughStyle.roughness, stroke: roughStyle.stroke, strokeWidth: roughStyle.strokeWidth, duration: durations[i], delay: delays[i], bowing: bowing }));
            })));
        }));
    };
    return _RoughUnderline;
}(React.Component));
/**
 * Draw an animated underline underneath some inline text.
 *
 * ![Screen capture](media://RoughUnderline.gif)
 *
 * **Props**: [[RoughUnderlineProps]]
 *
 * @noInheritDoc
 */
var RoughUnderline = /** @class */ (function (_super) {
    __extends(RoughUnderline, _super);
    function RoughUnderline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @hidden */
    RoughUnderline.prototype.render = function () {
        var props = this.props;
        return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, function (group) { return React.createElement(_RoughUnderline, __assign({ group: group }, props)); }));
    };
    return RoughUnderline;
}(React.Component));
exports.RoughUnderline = RoughUnderline;
//# sourceMappingURL=RoughUnderline.js.map