import * as React from "react";

type Rect = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

type Props = {
    text: React.ReactChild | Array<React.ReactChild>;
    children: (lines: Array<Rect>) => React.ReactNode;
};

type State = {
    lines: Array<Rect>;
    style: any;
};

export function cumulativeOffset(element: HTMLElement | null) {
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

export default class MeasureLines extends React.Component<Props> {
    state: State = {
        lines: [],
        style: {},
    };
    _nodes: Array<HTMLElement | null> = [];
    _interval: NodeJS.Timeout | null = null;

    componentDidMount() {
        this._interval = setInterval(() => {
            let lineByBottom = this._nodes.reduce(
                (memo, node) => {
                    if (!node) {
                        return memo;
                    }

                    const {width, height} = node.getBoundingClientRect();
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
                    memo[bottom].left = Math.round(Math.min(memo[bottom].left, left));
                    memo[bottom].right = Math.round(Math.max(memo[bottom].right, right));
                    memo[bottom].top = Math.round(Math.min(
                        memo[bottom].top,
                        node.offsetTop,
                    ));
                    memo[bottom].bottom = Math.round(bottom);

                    return memo;
                },
                {} as {[bottom: number]: Rect},
            );

            let lineBottoms = Object.keys(lineByBottom).map(b => parseFloat(b));
            lineBottoms.sort((a, b) => a - b);
            let lines = lineBottoms.map(bottom => lineByBottom[bottom]);

            if (
                lines.length !== this.state.lines.length ||
                lines.some(
                    (line, idx) =>
                        line.bottom !== this.state.lines[idx].bottom ||
                        line.left !== this.state.lines[idx].left ||
                        line.top !== this.state.lines[idx].top ||
                        line.right !== this.state.lines[idx].right,
                )
            ) {
                this.setState({lines});
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
        const {children, text} = this.props;
        const nodes: Array<React.ReactNode> = [];

        React.Children.forEach(text, child => {
            if (typeof child === "string") {
                child.split(/\s/g).forEach(word => {
                    nodes.push(word);
                });
            } else {
                nodes.push(child);
            }
        });

        const fragments = nodes.map((node, i) => (
            <React.Fragment key={i}>
                <span
                    style={{position: "relative"}}
                    ref={ref => (this._nodes[i] = ref)}
                >
                    {node}
                </span>
                {i + 1 !== nodes.length && " "}
            </React.Fragment>
        ));

        return (
            <>
                {this.state.lines.length ? children(this.state.lines) : null}
                {fragments}
            </>
        );
    }
}
