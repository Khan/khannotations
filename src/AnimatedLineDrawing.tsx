import * as React from "react";

import {
    AnimationGroup,
    Animate,
    ConnectToAnimationGroup,
} from "./AnimationGroup";
import {AnimationStrategy} from "./AnimationStrategy";
import InternalLineDrawing from "./_LineDrawing";

/**
 * Props for [[AnimatedLineDrawing]]
 */
export interface AnimatedLineDrawingProps {
    /**
     * If true, do not render a wrapping svg
     */
    bare?: boolean;

    /**
     * A string for hovertext and screenreaders.
     *
     * If this animated line should not be visible to screenreaders, pass
     * null instead.
     */
    title: string | null;

    /**
     * A string describing the line drawing in more detail, for screenreaders.
     *
     * Set this property if the line animation is complex and meaningful, and
     * "title" cannot fully explain the line drawing.
     */
    desc?: string;

    /**
     * The rules to describe how quickly this component should animate.
     */
    animation: AnimationStrategy;

    /**
     * Defines the path to be drawn.
     *
     * This is the same as the d property on an SVG `<path>` element.
     * See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
     */
    d: string;

    /**
     * CSS styles for `<path>` elements that will be drawn.
     *
     * Keep in mind the following gotchas:
     *  - [[AnimatedLineDrawing]] animates using stroke-dasharray and
     *    stroke-dashoffset, so you can't specify those properties here.
     *  - [[AnimatedLineDrawing]] may render multiple paths for a single
     *    path you passed in. Specifically, it renders a seperate path for
     *    every `M` command in the path. This style applies to all these paths.
     */
    pathStyle: React.CSSProperties;

    /**
     * Class applies to the `<svg>` element rendered, if applicable
     */
    className?: string;

    /**
     * Class applied to the `<path>` element this component renders.
     */
    pathClassName?: string;

    /**
     * Percentage delay between segments.
     *
     * This is the percentage of the time spent animating that should be
     * reserved between the path's `M` commands. If 0 (the default), all time
     * will be spent drawing. If 0.1, 90% of the time will be spent drawing,
     * and 10% of the time will be spent waiting between segments.
     */
    delayRatio?: number;
}

type State = {
    triggered: boolean;
    width: number;
    height: number;
};

/**
 * Connected implementation of [[AnimatedLineDrawing]].
 */
class _AnimatedLineDrawing
    extends React.Component<
        AnimatedLineDrawingProps & {group: AnimationGroup | null},
        State
    >
    implements Animate {
    /** @hidden */
    state: State = {
        triggered: false,
        width: 0,
        height: 0,
    };

    /** @hidden */
    componentDidMount() {
        if (this.props.group) {
            this.props.group.register(this);
        }
    }

    /** @hidden */
    componentDidUpdate(
        prevProps: AnimatedLineDrawingProps & {group: AnimationGroup | null},
    ) {
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

    trigger = () => {
        this.setState({
            triggered: true,
        });
    };

    estimatedDuration: number | null = null;

    /** @hidden */
    static getDerivedStateFromProps(
        props: AnimatedLineDrawingProps,
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

        let tempDiv = document.createElement("div");
        tempDiv.setAttribute(
            "style",
            "position:absolute; visibility:hidden; width:0; height:0",
        );
        document.body.appendChild(tempDiv);
        let tempSvg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
        );
        tempDiv.appendChild(tempSvg);
        tempSvg.appendChild(pathEl);
        const strokeWidth = parseInt(String(props.pathStyle.strokeWidth)) || 1;
        const {width, height} = paths.reduce(
            (memo, pathD) => {
                pathEl.setAttribute("d", pathD);
                const bbox = pathEl.getBBox();
                memo.width = Math.max(
                    memo.width,
                    bbox.x + bbox.width + strokeWidth,
                );
                memo.height = Math.max(
                    memo.height,
                    bbox.y + bbox.height + strokeWidth,
                );
                return memo;
            },
            {width: 0, height: 0},
        );

        document.body.removeChild(tempDiv);

        return {...state, width, height};
    }

    /** @hidden */
    render() {
        let {animation, className, delayRatio, title, bare} = this.props;
        const {width, height} = this.state;

        let duration;
        let delay;
        if (animation.animation === "none") {
            duration = 0;
            delay = 0;
        } else if (animation.animation === "duration") {
            duration = animation.duration;
            delay = animation.delay;
        } else {
            let x = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path",
            );
            x.setAttribute("d", this.props.d);
            let len = x.getTotalLength();

            duration = (len * 10) / animation.speed;
            delay = animation.delay;
        }

        if (duration !== this.estimatedDuration && this.props.group) {
            this.estimatedDuration = duration + delay;
            this.props.group.register(this);
        }

        if (!this.state.triggered && this.props.group) {
            return <div className={className} />;
        }
        return (
            <InternalLineDrawing
                title={title}
                className={className || ""}
                delay={delay}
                duration={duration}
                d={this.props.d}
                pathStyle={this.props.pathStyle}
                pathClassName={this.props.pathClassName}
                width={width}
                height={height}
                consistentDirection={true}
                delayRatio={delayRatio}
                bare={bare}
            />
        );
    }
}

/**
 * Animate the stroke of an SVG path.
 *
 * This is generally a block element, but that can be changed by passing in
 * a `className`.
 *
 * **AnimatedLineDrawing** renders an `<svg>` element with a viewport from
 * (0, 0) to the bottom right of the provided path.
 *
 * Assuming a non-empty `d` parameter, the `<svg>` element will have one or
 * more `<path>` children, one for every `M` command.
 *
 * This component animates using the stroke-dasharray/stroke-dashoffset
 * hack described at https://css-tricks.com/svg-line-animation-works
 *
 * ![Screen capture](media://AnimatedLineDrawing.gif)
 *
 * **Props**: [[AnimatedLineDrawingProps]]
 *
 * @noInheritDoc
 */
export class AnimatedLineDrawing extends React.Component<
    AnimatedLineDrawingProps
> {
    /** @hidden */
    render() {
        const {props} = this;

        return (
            <ConnectToAnimationGroup>
                {group => <_AnimatedLineDrawing group={group} {...props} />}
            </ConnectToAnimationGroup>
        );
    }
}
