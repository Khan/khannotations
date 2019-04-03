import * as React from "react";
import {StyleSheet, css} from "aphrodite/no-important";

interface InternalLineDrawingProps {
    delay: number;
    duration: number;

    /// If true, do not render a wrapping svg.
    bare?: boolean;

    /// The title of the SVG, or `null` if it should be hidden to
    /// screenreaders.
    title: string | null;

    /// A longer description, for screenreaders, if this is a complex
    /// drawing.
    desc?: string;

    d: string;
    pathStyle: React.CSSProperties;
    pathClassName?: string;
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
    uniqueId: string | null;
};

export default class InternalLineDrawing extends React.PureComponent<
    InternalLineDrawingProps
> {
    state: State = {
        pathLengths: [],
        paths: [],
        uniqueId: null,
    };

    render() {
        const {
            title,
            delay,
            duration,
            pathStyle,
            consistentDirection,
            className,
            style,
            width,
            height,
            delayRatio,
            desc,
            bare,
            pathClassName,
        } = this.props;

        const {paths, pathLengths, uniqueId} = this.state;
        let durationMultiplier = 1.0 - (delayRatio || 0);

        const contents = paths.map((path, i) => (
            <path
                key={`${i}_${duration}_${durationMultiplier}_${delay}_${
                    pathLengths[i]
                }`}
                style={{
                    ...pathStyle,
                    strokeDasharray: pathLengths[i],
                    strokeDashoffset:
                        (i % 2 === 0 || consistentDirection ? 1 : -1) *
                        pathLengths[i],
                    animationDelay: `${delay +
                        (i * duration) / paths.length}ms`,
                    animationDuration: `${(duration * durationMultiplier) /
                        paths.length}ms`,
                }}
                className={`${css(styles.animatedLine)} ${pathClassName || ""}`}
                d={path}
            />
        ));

        if (bare) {
            return contents;
        }

        return (
            <svg
                viewBox={width && height ? `0 0 ${width} ${height}` : undefined}
                className={
                    className == null ? css(styles.absoluteOverlay) : className
                }
                style={style}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden={title === null ? true : false}
                aria-labelledby={`${uniqueId}_title ${uniqueId}_desc`}
            >
                {title && uniqueId ? (
                    <title id={`${uniqueId}_title`}>{title}</title>
                ) : null}
                {desc && uniqueId ? (
                    <desc id={`${uniqueId}_desc`}>{desc}</desc>
                ) : null}
                <g>{contents}</g>
            </svg>
        );
    }

    componentDidMount() {
        this.setState({
            uniqueId: `_khannotations_LineDrawing_${Math.random()}`,
        });
    }

    static getDerivedStateFromProps(
        props: InternalLineDrawingProps,
        state: State,
    ): State {
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
            uniqueId: state.uniqueId,
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
        // Chrome/Safari round positioning aggressively in fractional
        // zoom levels. The rounding is very problematic at very low
        // sizes, so I'm using 100 here instead of 1.
        width: 100,
        height: 100,
        pointerEvents: "none",
    },
});
