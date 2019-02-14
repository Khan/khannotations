import * as React from "react";
import {StyleSheet, css} from "aphrodite/no-important";

export interface AnimationSettings {
    delay: number;
    duration: number;
}

interface InternalLineDrawingProps extends AnimationSettings {
    d: string;
    pathStyle: React.CSSProperties;
    // If true, we don't alternate directions for every path.
    consistentDirection?: boolean;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
    delayRatio?: number;
}

type State = {
    paths: string[];
    pathLengths: number[];
};

export default class InternalLineDrawing extends React.Component<
    InternalLineDrawingProps
> {
    state: State = {
        pathLengths: [],
        paths: [],
    };

    _svg: SVGSVGElement | null = null;

    render() {
        const {
            delay,
            duration,
            pathStyle,
            consistentDirection,
            className,
            style,
            width,
            height,
            delayRatio: delayPercent,
        } = this.props;
        const {paths, pathLengths} = this.state;
        let durationMultiplier = 1.0 - (delayPercent || 0);
        return (
            <svg
                ref={svg => (this._svg = svg)}
                viewBox={width && height ? `0 0 ${width} ${height}` : undefined}
                className={
                    className == null ? css(styles.absoluteOverlay) : className
                }
                style={style}
                preserveAspectRatio="true"
            >
                <g>
                    {paths.map((path, i) => (
                        <path
                            style={{
                                ...pathStyle,
                                strokeDasharray: pathLengths[i],
                                strokeDashoffset:
                                    (i % 2 === 0 || consistentDirection
                                        ? 1
                                        : -1) * pathLengths[i],
                                animationDelay: `${delay +
                                    (i * duration) / paths.length}ms`,
                                animationDuration: `${(duration *
                                    durationMultiplier) /
                                    paths.length}ms`,
                            }}
                            className={css(styles.animatedLine)}
                            key={i}
                            d={path}
                        />
                    ))}
                </g>
            </svg>
        );
    }

    shouldComponentUpdate(newProps: InternalLineDrawingProps, newState: State) {
        let {paths} = this.state;

        return (
            paths.length !== newState.paths.length ||
            paths.some((path, i) => path !== newState.paths[i])
        );
    }

    static getDerivedStateFromProps(props: InternalLineDrawingProps): State {
        const pathEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
        );
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
        };
    }
}

const lineAnimation = {
    to: {
        strokeDashoffset: 0,
    },
};

const styles = StyleSheet.create({
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
