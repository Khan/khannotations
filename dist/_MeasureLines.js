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
const _isIE_1 = __importDefault(require("./_isIE"));
function cumulativeOffset(element) {
    if (!element) {
        return {
            top: 0,
            left: 0,
        };
    }
    return {
        top: element.offsetTop || 0,
        left: element.offsetLeft || 0,
    };
}
exports.cumulativeOffset = cumulativeOffset;
class MeasureLines extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            lines: [],
            style: {},
        };
        this._nodes = [];
        this._interval = null;
    }
    componentDidMount() {
        this._interval = setInterval(() => {
            let lineByBottom = this._nodes.reduce((memo, node) => {
                if (!node) {
                    return memo;
                }
                const { width, height } = node.getBoundingClientRect();
                // These numbers are relative to the nearest
                // "position: relative" parent.
                const left = node.offsetLeft;
                const bottom = node.offsetTop + height;
                const right = node.offsetLeft + width;
                memo[bottom] = memo[bottom] || {
                    left: Infinity,
                    right: -Infinity,
                    top: Infinity,
                    bottom,
                };
                memo[bottom].left = Math.min(memo[bottom].left, left);
                memo[bottom].right = Math.max(memo[bottom].right, right);
                memo[bottom].top = Math.min(memo[bottom].top, node.offsetTop);
                memo[bottom].bottom = bottom;
                return memo;
            }, {});
            let lineBottoms = Object.keys(lineByBottom).map(b => parseFloat(b));
            lineBottoms.sort((a, b) => a - b);
            let lines = lineBottoms.map(bottom => lineByBottom[bottom]);
            if (lines.length !== this.state.lines.length ||
                lines.some((line, idx) => line.bottom !== this.state.lines[idx].bottom ||
                    line.left !== this.state.lines[idx].left ||
                    line.top !== this.state.lines[idx].top ||
                    line.right !== this.state.lines[idx].right)) {
                this.setState({ lines });
            }
        }, 50);
    }
    componentWillUnmount() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }
    render() {
        const { children, text } = this.props;
        if (_isIE_1.default()) {
            return React.createElement("span", { style: { position: "relative" } }, text);
        }
        const nodes = [];
        React.Children.forEach(text, child => {
            if (typeof child === "string") {
                child.split(/\s/g).forEach(word => {
                    nodes.push(word);
                });
            }
            else {
                nodes.push(child);
            }
        });
        const fragments = nodes.map((node, i) => (React.createElement(React.Fragment, { key: i },
            React.createElement("span", { style: { position: "relative" }, ref: ref => (this._nodes[i] = ref) }, node),
            i + 1 !== nodes.length && " ")));
        return (React.createElement(React.Fragment, null,
            this.state.lines.length ? children(this.state.lines) : null,
            fragments));
    }
}
exports.default = MeasureLines;
//# sourceMappingURL=_MeasureLines.js.map