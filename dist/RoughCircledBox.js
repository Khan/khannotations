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
var _MeasureLines_1 = require("./_MeasureLines");
var _RoughEllipse_1 = __importDefault(require("./_RoughEllipse"));
var no_important_1 = require("aphrodite/no-important");
var durand_kerner_1 = __importDefault(require("durand-kerner"));
var AnimationGroup_1 = require("./AnimationGroup");
/**
 * Calculate the dimensions of an ellipse that bounds the provided rectangle.
 *
 * (w, h) represents the width and height of a rectangle centered around an
 * arbitrary point.
 *
 * The values (a, b) represent the horizontal and vertical *RADII* of an
 * ellipse that, if centered around the same point, bounds the rectangle.
 *
 * This is somewhat slow to calculate because it uses durand-kerner, and
 * so the result should be memozied.
 */
function getEllipseBoundingRectangle(w, h) {
    // This simplifies our arithmetic.
    var d = h - w;
    // From https://math.stackexchange.com/questions/623922/ellipse-bounding-rectangle/623933#623933 we know that:
    //
    //  [1] b = a + 1/2 * d
    //  [2] w^2/(2a^2) + h^2/(2a+d)^2 = 1
    // Expanding and rearranging [2], we get:
    //  16*a^4 + 16*d*a^3 + (4*d^2 - 4*b^2 - 4*w^2)*a^2 - 4*d*w^2*a - w^2*d^2
    //  = 0
    // This can be rearranged into a quartic, which we can get the roots for.
    // (Note: x^0 is the first coefficient and x^4 is the last)
    var roots = durand_kerner_1.default([
        -w * w * d * d,
        -4 * d * w * w,
        4 * d * d - 4 * h * h - 4 * w * w,
        16 * d,
        16,
    ]);
    // The real parts are stored in roots[0] and the imaginary parts are stored
    // in roots[1]. I think there is only ever one real positive solution. If
    // I'm wrong, we pick the wider one.
    var a = 0;
    for (var i = 0; i < roots[0].length; ++i) {
        if (Math.abs(roots[1][i]) < 1e5) {
            a = Math.max(a, roots[0][i]);
        }
    }
    var b = a + 0.5 * d;
    return {
        a: a,
        b: b,
    };
}
/**
 * Connected implementation of [[RoughCircledBox]].
 */
var _RoughCircledBox = /** @class */ (function (_super) {
    __extends(_RoughCircledBox, _super);
    function _RoughCircledBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @ignore */
        _this.state = {
            triggered: false,
            x: NaN,
            y: NaN,
            width: NaN,
            height: NaN,
            a: NaN,
            b: NaN,
            marginLeft: NaN,
            marginRight: NaN,
            marginTop: NaN,
            marginBottom: NaN,
        };
        _this.trigger = function () {
            _this.setState({
                triggered: true,
            });
        };
        _this.estimatedDuration = null;
        _this._node = null;
        _this._interval = null;
        return _this;
    }
    /** @ignore */
    _RoughCircledBox.prototype.componentDidMount = function () {
        var _this = this;
        this._interval = setInterval(function () {
            if (_this._node) {
                var offset = _MeasureLines_1.cumulativeOffset(_this._node);
                var boundingRect = _this._node.getBoundingClientRect();
                var marginBottom = _this.props.marginBottom || 0;
                var marginLeft = _this.props.marginLeft || 0;
                var marginRight = _this.props.marginRight || 0;
                var marginTop = _this.props.marginTop || 0;
                var x = offset.left +
                    boundingRect.width / 2 -
                    marginLeft / 2 +
                    marginRight / 2;
                var y = offset.top +
                    boundingRect.height / 2 -
                    marginTop / 2 +
                    marginBottom / 2;
                var width = boundingRect.width + marginLeft + marginRight;
                var height = boundingRect.height + marginTop + marginBottom;
                if (x !== _this.state.x ||
                    y !== _this.state.y ||
                    width !== _this.state.width ||
                    height !== _this.state.height ||
                    marginBottom !== _this.state.marginBottom ||
                    marginLeft !== _this.state.marginLeft ||
                    marginRight !== _this.state.marginRight ||
                    marginTop !== _this.state.marginTop) {
                    var bb = getEllipseBoundingRectangle(width, height);
                    _this.setState({
                        x: x,
                        y: y,
                        width: width,
                        height: height,
                        a: bb.a,
                        b: bb.b,
                        marginBottom: marginBottom,
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        marginTop: marginTop,
                    });
                }
            }
        }, 500);
    };
    /** @ignore */
    _RoughCircledBox.prototype.componentWillUnmount = function () {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        if (this.props.group) {
            this.props.group.unregister(this);
        }
    };
    /** @ignore */
    _RoughCircledBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, delay = _a.delay, roughStyle = _a.roughStyle, group = _a.group;
        var _b = this.state, x = _b.x, y = _b.y, a = _b.a, b = _b.b;
        if (group && !this.state.triggered) {
            // TODO(joshuan): Do not hardcode this
            this.estimatedDuration = 400;
            group.register(this);
        }
        return (React.createElement("div", { ref: function (node) { return (_this._node = node); }, className: no_important_1.css(styles.paragraph) },
            children,
            !isNaN(x) &&
                !isNaN(y) &&
                !isNaN(a) &&
                !isNaN(b) &&
                (!group || this.state.triggered) && (React.createElement(_RoughEllipse_1.default, { x: x, y: y, width: a * 2, height: b * 2, roughness: roughStyle.roughness, stroke: roughStyle.stroke, strokeWidth: roughStyle.strokeWidth, duration: 400, delay: delay }))));
    };
    return _RoughCircledBox;
}(React.Component));
var styles = no_important_1.StyleSheet.create({
    paragraph: {
        display: "inline-block",
    },
});
/**
 * Render an inline-block element that has a rough ellipse around it.
 *
 * The ellipse is calculated to just touch the rendered block element, but
 * you can give the ellipse more or less space by adjusting the margins.
 *
 * ![Screen capture](media://RoughCircledBox.gif)
 *
 * **Props**: [[RoughCircledBoxProps]]
 *
 * @noInheritDoc
 */
var RoughCircledBox = /** @class */ (function (_super) {
    __extends(RoughCircledBox, _super);
    function RoughCircledBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @hidden */
    RoughCircledBox.prototype.render = function () {
        var props = this.props;
        return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, function (group) { return React.createElement(_RoughCircledBox, __assign({ group: group }, props)); }));
    };
    return RoughCircledBox;
}(React.Component));
exports.RoughCircledBox = RoughCircledBox;
//# sourceMappingURL=RoughCircledBox.js.map