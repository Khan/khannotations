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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "./_RoughLine", "./_MeasureLines", "./AnimationGroup"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = __importStar(require("react"));
    const _RoughLine_1 = __importDefault(require("./_RoughLine"));
    const _MeasureLines_1 = __importDefault(require("./_MeasureLines"));
    const AnimationGroup_1 = require("./AnimationGroup");
    /**
     * Connected implementation of [[RoughUnderline]].
     */
    class _RoughUnderline extends React.Component {
        constructor() {
            super(...arguments);
            /** @hidden */
            this.state = {
                triggered: false,
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
        render() {
            const { animation, roughStyle: underlineStyle, children, group, } = this.props;
            return (React.createElement(_MeasureLines_1.default, { text: children }, lines => {
                let durations;
                let gap;
                let totalLength = lines.reduce((memo, line) => memo + line.right - line.left, 0);
                if (animation.animation === "none") {
                    durations = lines.map(() => 0);
                }
                else if (animation.animation === "duration") {
                    gap = Math.min(100, (animation.duration / lines.length) * 0.05);
                    let animateTime = animation.duration - gap * (lines.length - 1);
                    durations = lines.map(line => ((line.right - line.left) / totalLength) *
                        animateTime);
                }
                else if (animation.animation === "speed") {
                    gap = 100;
                    durations = lines.map(line => ((line.right - line.left) * 10) /
                        animation.speed);
                }
                else {
                    throw new Error("Invalid animation type.");
                }
                let timeSoFar = animation.animation === "none" ? 0 : animation.delay;
                let delays = lines.map((line, i) => {
                    let myDelay = timeSoFar;
                    timeSoFar += durations[i] + gap;
                    return myDelay;
                });
                if (group && !this.state.triggered) {
                    this.estimatedDuration = timeSoFar;
                    group.register(this);
                    return null;
                }
                return (React.createElement(React.Fragment, null, lines.map(({ left, right, bottom }, i) => (React.createElement(_RoughLine_1.default, { key: i, x1: left, x2: right, y1: bottom - underlineStyle.lift, y2: bottom - underlineStyle.lift, roughness: underlineStyle.roughness, stroke: underlineStyle.stroke, strokeWidth: underlineStyle.strokeWidth, duration: durations[i], delay: delays[i], bowing: 300 / (right - left) })))));
            }));
        }
    }
    /**
     * Draw an animated underline underneath some inline text.
     *
     * ![Screen capture](media://RoughUnderline.gif)
     *
     * **Props**: [[RoughUnderlineProps]]
     *
     * @noInheritDoc
     */
    class RoughUnderline extends React.Component {
        /** @hidden */
        render() {
            const { props } = this;
            return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, group => React.createElement(_RoughUnderline, Object.assign({ group: group }, props))));
        }
    }
    exports.RoughUnderline = RoughUnderline;
});
//# sourceMappingURL=RoughUnderline.js.map