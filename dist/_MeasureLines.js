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
var _isIE_1 = __importDefault(require("./_isIE"));
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
var MeasureLines = /** @class */ (function (_super) {
    __extends(MeasureLines, _super);
    function MeasureLines() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            lines: [],
            style: {},
        };
        _this._nodes = [];
        _this._interval = null;
        return _this;
    }
    MeasureLines.prototype.componentDidMount = function () {
        var _this = this;
        this._interval = setInterval(function () {
            var lineByBottom = _this._nodes.reduce(function (memo, node) {
                if (!node) {
                    return memo;
                }
                var _a = node.getBoundingClientRect(), width = _a.width, height = _a.height;
                // These numbers are relative to the nearest
                // "position: relative" parent.
                var left = node.offsetLeft;
                var bottom = node.offsetTop + height;
                var right = node.offsetLeft + width;
                memo[bottom] = memo[bottom] || {
                    left: Infinity,
                    right: -Infinity,
                    top: Infinity,
                    bottom: bottom,
                };
                memo[bottom].left = Math.min(memo[bottom].left, left);
                memo[bottom].right = Math.max(memo[bottom].right, right);
                memo[bottom].top = Math.min(memo[bottom].top, node.offsetTop);
                memo[bottom].bottom = bottom;
                return memo;
            }, {});
            var lineBottoms = Object.keys(lineByBottom).map(function (b) { return parseFloat(b); });
            lineBottoms.sort(function (a, b) { return a - b; });
            var lines = lineBottoms.map(function (bottom) { return lineByBottom[bottom]; });
            if (lines.length !== _this.state.lines.length ||
                lines.some(function (line, idx) {
                    return line.bottom !== _this.state.lines[idx].bottom ||
                        line.left !== _this.state.lines[idx].left ||
                        line.top !== _this.state.lines[idx].top ||
                        line.right !== _this.state.lines[idx].right;
                })) {
                _this.setState({ lines: lines });
            }
        }, 50);
    };
    MeasureLines.prototype.componentWillUnmount = function () {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    };
    MeasureLines.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, text = _a.text;
        if (_isIE_1.default()) {
            return React.createElement("span", { style: { position: "relative" } }, text);
        }
        var nodes = [];
        React.Children.forEach(text, function (child) {
            if (typeof child === "string") {
                child.split(/\s/g).forEach(function (word) {
                    nodes.push(word);
                });
            }
            else {
                nodes.push(child);
            }
        });
        var fragments = nodes.map(function (node, i) { return (React.createElement(React.Fragment, { key: i },
            React.createElement("span", { style: { position: "relative" }, ref: function (ref) { return (_this._nodes[i] = ref); } }, node),
            i + 1 !== nodes.length && " ")); });
        return (React.createElement(React.Fragment, null,
            this.state.lines.length ? children(this.state.lines) : null,
            fragments));
    };
    return MeasureLines;
}(React.Component));
exports.default = MeasureLines;
//# sourceMappingURL=_MeasureLines.js.map