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
        define(["require", "exports", "react", "aphrodite/no-important", "./vendor/rough/src/wrappers/rough"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = __importStar(require("react"));
    const no_important_1 = require("aphrodite/no-important");
    const rough_1 = __importDefault(require("./vendor/rough/src/wrappers/rough"));
    class RoughRectangle extends React.Component {
        constructor() {
            super(...arguments);
            this.state = {
                paths: [],
                pathLengths: [],
                pathStyle: {},
            };
            this._svg = null;
            this._reset = () => {
                let { x1, y1, x2, y2, roughness, stroke, strokeWidth, fill, fillStyle, } = this.props;
                if (!this._svg) {
                    return;
                }
                let rsvg = rough_1.default.svg(this._svg);
                const sline = rsvg.rectangle(x1, y1, x2 - x1, y2 - y1, {
                    roughness,
                    stroke,
                    strokeWidth,
                    fill,
                    fillStyle,
                    fillWeight: 4,
                });
                const pathEl = sline.querySelector("path");
                if (!pathEl) {
                    return;
                }
                const paths = (pathEl.getAttribute("d") || "")
                    .split("M")
                    .slice(1)
                    .map(v => `M${v}`);
                const pathLengths = paths.map(pathD => {
                    pathEl.setAttribute("d", paths[0]);
                    return pathEl.getTotalLength();
                });
                let pathStyle = {};
                for (let i = 0; i < pathEl.style.length; ++i) {
                    const name = pathEl.style[i];
                    // HACK: TS doesn't support indexing style by string.
                    const value = pathEl.style[pathEl.style[i]];
                    const reactName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());
                    pathStyle[reactName] = value;
                }
                this.setState({
                    paths,
                    pathLengths,
                    pathStyle,
                });
            };
        }
        render() {
            const { delay, duration, x1, y1, fillStyle } = this.props;
            const { paths, pathLengths, pathStyle } = this.state;
            return (React.createElement("svg", { ref: svg => (this._svg = svg), style: {
                    overflow: "visible",
                    position: "absolute",
                    left: 0,
                    top: 0,
                } },
                React.createElement("g", null, paths.map((path, i) => (React.createElement("path", { style: Object.assign({}, pathStyle, { strokeDasharray: pathLengths[i] + 10, strokeDashoffset: (i % 2 ? -1 : 1) * (pathLengths[i] + 10), transformOrigin: `${x1}px ${y1}px`, animationDelay: `${delay +
                            (i * duration) / paths.length}ms`, animationDuration: `${duration /
                            paths.length}ms`, transform: fillStyle === "solid"
                            ? "scaleX(0)"
                            : undefined }), className: no_important_1.css(fillStyle === "solid"
                        ? styles.animatedFill
                        : styles.animatedStroke), key: i, d: path }))))));
        }
        componentDidMount() {
            this._reset();
        }
        shouldComponentUpdate(newProps, newState) {
            let { x1, y1, x2, y2 } = this.props;
            let { paths } = this.state;
            return (x1 !== newProps.x1 ||
                x2 !== newProps.x2 ||
                y1 !== newProps.y1 ||
                y2 !== newProps.y2 ||
                paths.length !== newState.paths.length ||
                paths.some((path, idx) => path !== newState.paths[idx]));
        }
        componentDidUpdate(prevProps) {
            let { x1, y1, x2, y2 } = this.props;
            if (x1 !== prevProps.x1 ||
                x2 !== prevProps.x2 ||
                y1 !== prevProps.y1 ||
                y2 !== prevProps.y2) {
                this._reset();
            }
        }
    }
    exports.default = RoughRectangle;
    const lineAnimation = {
        to: {
            strokeDashoffset: 0,
        },
    };
    const scaleAnimation = {
        from: {
            transform: "scaleX(0)",
        },
        to: {
            transform: "scaleX(1)",
        },
    };
    const styles = no_important_1.StyleSheet.create({
        animatedStroke: {
            animationName: lineAnimation,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
        },
        animatedFill: {
            animationName: scaleAnimation,
            animationTimingFunction: "learner",
            animationFillMode: "forwards",
        },
    });
});
//# sourceMappingURL=_RoughRectangle.js.map