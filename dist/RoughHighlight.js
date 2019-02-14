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
        define(["require", "exports", "react", "./_MeasureLines", "./_RoughRectangle", "./AnimationGroup"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = __importStar(require("react"));
    const _MeasureLines_1 = __importDefault(require("./_MeasureLines"));
    const _RoughRectangle_1 = __importDefault(require("./_RoughRectangle"));
    const AnimationGroup_1 = require("./AnimationGroup");
    /**
     * Connected implementation of [[RoughHighlight]]
     */
    class _RoughHighlight extends React.Component {
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
        render() {
            const { children, animation, roughStyle, group } = this.props;
            return (React.createElement("span", null,
                React.createElement(_MeasureLines_1.default, { text: children }, lines => {
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
                    let timeSoFar = animation.animation === "none"
                        ? 0
                        : animation.delay;
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
                    return (React.createElement(React.Fragment, null, lines.map(({ left, right, top, bottom }, i) => (React.createElement(_RoughRectangle_1.default, { key: i, x1: left, x2: right, y1: top, y2: bottom, roughness: roughStyle.roughness, fill: roughStyle.fill, fillStyle: "solid", stroke: "none", duration: durations[i], delay: delays[i] })))));
                })));
        }
    }
    /**
     * Draw an animated highlight behind some inline text.
     *
     * ![Screen capture](media://RoughHighlight.gif)
     *
     * **Props**: [[RoughHighlightProps]]
     *
     * @noInheritDoc
     */
    class RoughHighlight extends React.Component {
        /** @hidden */
        render() {
            const { props } = this;
            return (React.createElement(AnimationGroup_1.ConnectToAnimationGroup, null, group => React.createElement(_RoughHighlight, Object.assign({ group: group }, props))));
        }
    }
    exports.RoughHighlight = RoughHighlight;
});
//# sourceMappingURL=RoughHighlight.js.map