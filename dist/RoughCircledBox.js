"use strict";
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
const _MeasureLines_1 = require("./_MeasureLines");
const _RoughEllipse_1 = __importDefault(require("./_RoughEllipse"));
const no_important_1 = require("aphrodite/no-important");
const durand_kerner_1 = __importDefault(require("durand-kerner"));
const _isIE_1 = __importDefault(require("./_isIE"));
const AnimationGroup_1 = require("./AnimationGroup");
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
    let d = h - w;
    // From https://math.stackexchange.com/questions/623922/ellipse-bounding-rectangle/623933#623933 we know that:
    //
    //  [1] b = a + 1/2 * d
    //  [2] w^2/(2a^2) + h^2/(2a+d)^2 = 1
    // Expanding and rearranging [2], we get:
    //  16*a^4 + 16*d*a^3 + (4*d^2 - 4*b^2 - 4*w^2)*a^2 - 4*d*w^2*a - w^2*d^2
    //  = 0
    // This can be rearranged into a quartic, which we can get the roots for.
    // (Note: x^0 is the first coefficient and x^4 is the last)
    let roots = durand_kerner_1.default([
        -w * w * d * d,
        -4 * d * w * w,
        4 * d * d - 4 * h * h - 4 * w * w,
        16 * d,
        16,
    ]);
    // The real parts are stored in roots[0] and the imaginary parts are stored
    // in roots[1]. I think there is only ever one real positive solution. If
    // I'm wrong, we pick the wider one.
    let a = 0;
    for (let i = 0; i < roots[0].length; ++i) {
        if (Math.abs(roots[1][i]) < 1e5) {
            a = Math.max(a, roots[0][i]);
        }
    }
    let b = a + 0.5 * d;
    return {
        a,
        b,
    };
}
/**
 * Connected implementation of [[RoughCircledBox]].
 */
class _RoughCircledBox extends React.Component {
    constructor() {
        super(...arguments);
        /** @ignore */
        this.state = {
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
        this.trigger = () => {
            this.setState({
                triggered: true,
            });
        };
        this.estimatedDuration = null;
        this._node = null;
        this._interval = null;
    }
    /** @ignore */
    componentDidMount() {
        if (_isIE_1.default()) {
            return;
        }
        this._interval = setInterval(() => {
            if (this._node) {
                let offset = _MeasureLines_1.cumulativeOffset(this._node);
                const boundingRect = this._node.getBoundingClientRect();
                const marginBottom = this.props.marginBottom || 0;
                const marginLeft = this.props.marginLeft || 0;
                const marginRight = this.props.marginRight || 0;
                const marginTop = this.props.marginTop || 0;
                const x = offset.left +
                    boundingRect.width / 2 -
                    marginLeft / 2 +
                    marginRight / 2;
                const y = offset.top +
                    boundingRect.height / 2 -
                    marginTop / 2 +
                    marginBottom / 2;
                const width = boundingRect.width + marginLeft + marginRight;
                const height = boundingRect.height + marginTop + marginBottom;
                if (x !== this.state.x ||
                    y !== this.state.y ||
                    width !== this.state.width ||
                    height !== this.state.height ||
                    marginBottom !== this.state.marginBottom ||
                    marginLeft !== this.state.marginLeft ||
                    marginRight !== this.state.marginRight ||
                    marginTop !== this.state.marginTop) {
                    let bb = getEllipseBoundingRectangle(width, height);
                    this.setState({
                        x,
                        y,
                        width,
                        height,
                        a: bb.a,
                        b: bb.b,
                        marginBottom,
                        marginLeft,
                        marginRight,
                        marginTop,
                    });
                }
            }
        }, 500);
    }
    /** @ignore */
    componentWillUnmount() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        if (this.props.group) {
            this.props.group.unregister(this);
        }
    }
    /** @ignore */
    render() {
        const { children, delay, roughStyle, group } = this.props;
        const { x, y, a, b } = this.state;
        if (_isIE_1.default()) {
            return children;
        }
        if (group && !this.state.triggered) {
            // TODO(joshuan): Do not hardcode this
            this.estimatedDuration = 400;
            group.register(this);
        }
        return (React.createElement("div", { ref: node => (this._node = node), className: no_important_1.css(styles.paragraph) },
            children,
            !isNaN(x) &&
                !isNaN(y) &&
                !isNaN(a) &&
                !isNaN(b) &&
                (!group || this.state.triggered) && (React.createElement(_RoughEllipse_1.default, { x: x, y: y, width: a * 2, height: b * 2, roughness: roughStyle.roughness, stroke: roughStyle.stroke, strokeWidth: roughStyle.strokeWidth, duration: 400, delay: delay }))));
    }
}
const styles = no_important_1.StyleSheet.create({
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
class RoughCircledBox extends React.Component {
    /** @hidden */
    render() {
        const { props } = this;
        return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, group => React.createElement(_RoughCircledBox, Object.assign({ group: group }, props))));
    }
}
exports.RoughCircledBox = RoughCircledBox;
//# sourceMappingURL=RoughCircledBox.js.map