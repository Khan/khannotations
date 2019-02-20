var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "aphrodite/no-important"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = __importStar(require("react"));
    const no_important_1 = require("aphrodite/no-important");
    class InternalLineDrawing extends React.Component {
        constructor() {
            super(...arguments);
            this.state = {
                pathLengths: [],
                paths: [],
                uniqueId: null,
            };
            this._svg = null;
        }
        render() {
            const { title, delay, duration, pathStyle, consistentDirection, className, style, width, height, delayRatio, desc, } = this.props;
            const { paths, pathLengths, uniqueId } = this.state;
            let durationMultiplier = 1.0 - (delayRatio || 0);
            return (React.createElement("svg", { ref: svg => (this._svg = svg), viewBox: width && height ? `0 0 ${width} ${height}` : undefined, className: className == null ? no_important_1.css(styles.absoluteOverlay) : className, style: style, preserveAspectRatio: "xMidYMid meet", "aria-hidden": title === null ? true : false, "aria-labelledby": `${uniqueId}_title ${uniqueId}_desc` },
                title && uniqueId ? (React.createElement("title", { id: `${uniqueId}_title` }, title)) : null,
                desc && uniqueId ? (React.createElement("desc", { id: `${uniqueId}_desc` }, desc)) : null,
                React.createElement("g", null, paths.map((path, i) => (React.createElement("path", { style: Object.assign({}, pathStyle, { strokeDasharray: pathLengths[i], strokeDashoffset: (i % 2 === 0 || consistentDirection
                            ? 1
                            : -1) * pathLengths[i], animationDelay: `${delay +
                            (i * duration) / paths.length}ms`, animationDuration: `${(duration *
                            durationMultiplier) /
                            paths.length}ms` }), className: no_important_1.css(styles.animatedLine), key: i, d: path }))))));
        }
        shouldComponentUpdate(newProps, newState) {
            let { paths } = this.state;
            return (paths.length !== newState.paths.length ||
                paths.some((path, i) => path !== newState.paths[i]));
        }
        componentDidMount() {
            this.setState({
                uniqueId: `_khannotations_LineDrawing_${Math.random()}`,
            });
        }
        static getDerivedStateFromProps(props, state) {
            const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const paths = props.d
                .split("M")
                .slice(1)
                .map(p => `M${p}`);
            const pathLengths = paths.map(pathD => {
                pathEl.setAttribute("d", pathD);
                return pathEl.getTotalLength();
            });
            return {
                pathLengths,
                paths,
                uniqueId: state.uniqueId,
            };
        }
    }
    exports.default = InternalLineDrawing;
    const lineAnimation = {
        to: {
            strokeDashoffset: 0,
        },
    };
    const styles = no_important_1.StyleSheet.create({
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
});
//# sourceMappingURL=_LineDrawing.js.map