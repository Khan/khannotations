import * as React from "react";
import {StyleSheet, css} from "aphrodite/no-important";
import rough from "./vendor/rough/src/wrappers/rough";
import {Options as RoughJSOptions} from "./vendor/rough/src/core";

type Props = RoughJSOptions & {
    duration: number;
    delay: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

type State = {
    paths: string[];
    pathLengths: number[];
    pathStyle: {[key: string]: any};
};

export default class RoughRectangle extends React.Component<Props, State> {
    state: State = {
        paths: [],
        pathLengths: [],
        pathStyle: {},
    };
    _svg: SVGSVGElement | null = null;

    render() {
        const {delay, duration, x1, y1, fillStyle} = this.props;
        const {paths, pathLengths, pathStyle} = this.state;
        return (
            <svg
                ref={svg => (this._svg = svg)}
                style={{
                    overflow: "visible",
                    position: "absolute",
                    left: 0,
                    top: 0,
                }}
            >
                <g>
                    {paths.map((path, i) => (
                        <path
                            style={{
                                ...pathStyle,
                                strokeDasharray: pathLengths[i] + 10,
                                strokeDashoffset:
                                    (i % 2 ? -1 : 1) * (pathLengths[i] + 10),
                                transformOrigin: `${x1}px ${y1}px`,
                                animationDelay: `${delay +
                                    (i * duration) / paths.length}ms`,
                                animationDuration: `${duration /
                                    paths.length}ms`,
                                transform:
                                    fillStyle === "solid"
                                        ? "scaleX(0)"
                                        : undefined,
                            }}
                            className={css(
                                fillStyle === "solid"
                                    ? styles.animatedFill
                                    : styles.animatedStroke,
                            )}
                            key={i}
                            d={path}
                        />
                    ))}
                </g>
            </svg>
        );
    }

    componentDidMount() {
        this._reset();
    }

    shouldComponentUpdate(newProps: Props, newState: State) {
        let {x1, y1, x2, y2} = this.props;
        let {paths} = this.state;

        return (
            x1 !== newProps.x1 ||
            x2 !== newProps.x2 ||
            y1 !== newProps.y1 ||
            y2 !== newProps.y2 ||
            paths.length !== newState.paths.length ||
            paths.some((path, idx) => path !== newState.paths[idx])
        );
    }

    componentDidUpdate(prevProps: Props) {
        let {x1, y1, x2, y2} = this.props;

        if (
            x1 !== prevProps.x1 ||
            x2 !== prevProps.x2 ||
            y1 !== prevProps.y1 ||
            y2 !== prevProps.y2
        ) {
            this._reset();
        }
    }

    _reset = () => {
        let {
            x1,
            y1,
            x2,
            y2,
            roughness,
            stroke,
            strokeWidth,
            fill,
            fillStyle,
        } = this.props;
        if (!this._svg) {
            return;
        }
        let rsvg = rough.svg(this._svg);
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
        let pathStyle: {[key: string]: string} = {};

        for (let i = 0; i < pathEl.style.length; ++i) {
            const name = pathEl.style[i];
            // HACK: TS doesn't support indexing style by string.
            const value: string = (pathEl.style as any)[pathEl.style[i]];
            const reactName = name.replace(/-([a-z])/g, g =>
                g[1].toUpperCase(),
            );
            pathStyle[reactName] = value;
        }

        this.setState({
            paths,
            pathLengths,
            pathStyle,
        });
    };
}

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

const styles = StyleSheet.create({
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
