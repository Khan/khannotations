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
var AnimationGroup_1 = require("./AnimationGroup");
var _LineDrawing_1 = __importDefault(require("./_LineDrawing"));
/**
 * Connected implementation of [[AnimatedLineDrawing]].
 */
var _AnimatedLineDrawing = /** @class */ (function (_super) {
    __extends(_AnimatedLineDrawing, _super);
    function _AnimatedLineDrawing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @hidden */
        _this.state = {
            triggered: false,
            width: 0,
            height: 0,
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
    _AnimatedLineDrawing.prototype.componentDidMount = function () {
        if (this.props.group) {
            this.props.group.register(this);
        }
    };
    /** @hidden */
    _AnimatedLineDrawing.prototype.componentDidUpdate = function (prevProps) {
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
    _AnimatedLineDrawing.prototype.componentWillUnmount = function () {
        if (this.props.group) {
            this.props.group.unregister(this);
        }
    };
    /** @hidden */
    _AnimatedLineDrawing.getDerivedStateFromProps = function (props, state) {
        var pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var paths = props.d
            .split("M")
            .slice(1)
            .map(function (p) { return "M" + p; });
        var tempDiv = document.createElement("div");
        tempDiv.setAttribute("style", "position:absolute; visibility:hidden; width:0; height:0");
        document.body.appendChild(tempDiv);
        var tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tempDiv.appendChild(tempSvg);
        tempSvg.appendChild(pathEl);
        var strokeWidth = parseInt(String(props.pathStyle.strokeWidth)) || 1;
        var _a = paths.reduce(function (memo, pathD) {
            pathEl.setAttribute("d", pathD);
            var bbox = pathEl.getBBox();
            memo.width = Math.max(memo.width, bbox.x + bbox.width + strokeWidth);
            memo.height = Math.max(memo.height, bbox.y + bbox.height + strokeWidth);
            return memo;
        }, { width: 0, height: 0 }), width = _a.width, height = _a.height;
        document.body.removeChild(tempDiv);
        return __assign({}, state, { width: width, height: height });
    };
    /** @hidden */
    _AnimatedLineDrawing.prototype.render = function () {
        var _a = this.props, animation = _a.animation, className = _a.className, delayRatio = _a.delayRatio, title = _a.title, bare = _a.bare;
        var _b = this.state, width = _b.width, height = _b.height;
        var duration;
        var delay;
        if (animation.animation === "none") {
            duration = 0;
            delay = 0;
        }
        else if (animation.animation === "duration") {
            duration = animation.duration;
            delay = animation.delay;
        }
        else {
            var x = document.createElementNS("http://www.w3.org/2000/svg", "path");
            x.setAttribute("d", this.props.d);
            var len = x.getTotalLength();
            duration = (len * 10) / animation.speed;
            delay = animation.delay;
        }
        if (duration !== this.estimatedDuration && this.props.group) {
            this.estimatedDuration = duration + delay;
            this.props.group.register(this);
        }
        if (!this.state.triggered && this.props.group) {
            return React.createElement("div", { className: className });
        }
        return (React.createElement(_LineDrawing_1.default, { title: title, className: className || "", delay: delay, duration: duration, d: this.props.d, pathStyle: this.props.pathStyle, pathClassName: this.props.pathClassName, width: width, height: height, consistentDirection: true, delayRatio: delayRatio, bare: bare }));
    };
    return _AnimatedLineDrawing;
}(React.Component));
/**
 * Animate the stroke of an SVG path.
 *
 * This is generally a block element, but that can be changed by passing in
 * a `className`.
 *
 * **AnimatedLineDrawing** renders an `<svg>` element with a viewport from
 * (0, 0) to the bottom right of the provided path.
 *
 * Assuming a non-empty `d` parameter, the `<svg>` element will have one or
 * more `<path>` children, one for every `M` command.
 *
 * This component animates using the stroke-dasharray/stroke-dashoffset
 * hack described at https://css-tricks.com/svg-line-animation-works
 *
 * ![Screen capture](media://AnimatedLineDrawing.gif)
 *
 * **Props**: [[AnimatedLineDrawingProps]]
 *
 * @noInheritDoc
 */
var AnimatedLineDrawing = /** @class */ (function (_super) {
    __extends(AnimatedLineDrawing, _super);
    function AnimatedLineDrawing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @hidden */
    AnimatedLineDrawing.prototype.render = function () {
        var props = this.props;
        return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, function (group) { return React.createElement(_AnimatedLineDrawing, __assign({ group: group }, props)); }));
    };
    return AnimatedLineDrawing;
}(React.Component));
exports.AnimatedLineDrawing = AnimatedLineDrawing;
//# sourceMappingURL=AnimatedLineDrawing.js.map