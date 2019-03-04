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
const AnimationGroup_1 = require("./AnimationGroup");
const _LineDrawing_1 = __importDefault(require("./_LineDrawing"));
/**
 * Connected implementation of [[AnimatedLineDrawing]].
 */
class _AnimatedLineDrawing extends React.Component {
    constructor() {
        super(...arguments);
        /** @hidden */
        this.state = {
            triggered: false,
            width: 0,
            height: 0,
        };
        this.trigger = () => {
            this.setState({
                triggered: true,
            });
        };
        this.estimatedDuration = null;
    }
    /** @hidden */
    componentDidMount() {
        if (this.props.group) {
            this.props.group.register(this);
        }
    }
    /** @hidden */
    componentDidUpdate(prevProps) {
        if (this.props.group !== prevProps.group) {
            if (prevProps.group) {
                prevProps.group.unregister(this);
            }
            if (this.props.group) {
                this.props.group.register(this);
            }
        }
    }
    /** @hidden */
    componentWillUnmount() {
        if (this.props.group) {
            this.props.group.unregister(this);
        }
    }
    /** @hidden */
    static getDerivedStateFromProps(props, state) {
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const paths = props.d
            .split("M")
            .slice(1)
            .map(p => `M${p}`);
        let tempDiv = document.createElement("div");
        tempDiv.setAttribute("style", "position:absolute; visibility:hidden; width:0; height:0");
        document.body.appendChild(tempDiv);
        let tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tempDiv.appendChild(tempSvg);
        tempSvg.appendChild(pathEl);
        const strokeWidth = parseInt(String(props.pathStyle.strokeWidth)) || 1;
        const { width, height } = paths.reduce((memo, pathD) => {
            pathEl.setAttribute("d", pathD);
            const bbox = pathEl.getBBox();
            memo.width = Math.max(memo.width, bbox.x + bbox.width + strokeWidth);
            memo.height = Math.max(memo.height, bbox.y + bbox.height + strokeWidth);
            return memo;
        }, { width: 0, height: 0 });
        document.body.removeChild(tempDiv);
        return Object.assign({}, state, { width, height });
    }
    /** @hidden */
    render() {
        let { animation, className, delayRatio, title, bare } = this.props;
        const { width, height } = this.state;
        let duration;
        let delay;
        if (animation.animation === "none") {
            duration = 0;
            delay = 0;
        }
        else if (animation.animation === "duration") {
            duration = animation.duration;
            delay = animation.delay;
        }
        else {
            let x = document.createElementNS("http://www.w3.org/2000/svg", "path");
            x.setAttribute("d", this.props.d);
            let len = x.getTotalLength();
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
    }
}
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
class AnimatedLineDrawing extends React.Component {
    /** @hidden */
    render() {
        const { props } = this;
        return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, group => React.createElement(_AnimatedLineDrawing, Object.assign({ group: group }, props))));
    }
}
exports.AnimatedLineDrawing = AnimatedLineDrawing;
//# sourceMappingURL=AnimatedLineDrawing.js.map