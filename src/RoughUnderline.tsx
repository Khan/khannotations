import * as React from "react";

import RoughLine from "./_RoughLine";
import MeasureLines from "./_MeasureLines";
import {
    AnimationGroup,
    Animate,
    ConnectToAnimationGroup,
} from "./AnimationGroup";
import {AnimationStrategy} from "./AnimationStrategy";

/**
 * The line has a fixed "bowed" value.
 */
export interface BowingStrategyFixed {
    bowing: "fixed";
    /**
     * Numerical value indicating how curvy the lines are when drawing a
     * sketch. A value of 0 will cause straight lines. Default value is 1.
     */
    amount: number;
}

/**
 * The longer the line, the less curved it is.
 */
export interface BowingStrategyInverse {
    bowing: "inverse";

    /**
     * Bowing amount per inverse pixel.
     *
     * A typical value is 300.
     */
    ratio: number;
}

/**
 * Define how to resolve how bowed (curved) the underline is.
 */
export type BowingStrategy = BowingStrategyFixed | BowingStrategyInverse;

/**
 * Define what the underline looks like.
 */
export interface UnderlineStyle {
    /**
     * Numerical value indicating how rough the drawing is. A rectangle with
     * the roughness of 0 would be a perfect rectangle.
     *
     * There is no upper limit to this value, but a value over 10 is mostly
     * useless.
     */
    roughness: number;
    /**
     * String value representing the color of the drawn objects.
     */
    stroke: string;
    /**
     * Numerical value to set the width of the strokes (in pixels).
     *
     * Can be specicied in any of the
     * [ways to describe color in CSS](https://developer.mozilla.org/en-US/docs/Web/HTML/Applying_color#How_to_describe_a_color).
     */
    strokeWidth: number;
    /**
     * Determines how curvy the line is.
     */
    bowing: BowingStrategy;
    /**
     * Numerical value to set how high above the bottom of the bounding box
     * the underline is (in pixels).
     */
    lift: number;
}

/**
 * Props for [[RoughUnderline]].
 */
export interface RoughUnderlineProps {
    /**
     * The rules to describe how quickly this component should animate.
     */
    animation: AnimationStrategy;
    roughStyle: UnderlineStyle;
    children: React.ReactChild | Array<React.ReactChild>;
}

type State = {
    triggered: boolean;
};

/**
 * Connected implementation of [[RoughUnderline]].
 */
class _RoughUnderline
    extends React.Component<
        RoughUnderlineProps & {group: AnimationGroup | null},
        State
    >
    implements Animate {
    /** @hidden */
    state: State = {
        triggered: false,
    };

    trigger = () => {
        this.setState({
            triggered: true,
        });
    };

    estimatedDuration: number | null = null;

    /** @hidden */
    componentDidMount() {
        if (this.props.group) {
            this.props.group.register(this);
        }
    }

    /** @hidden */
    componentDidUpdate(
        prevProps: RoughUnderlineProps & {group: AnimationGroup | null},
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
    /** @hidden */
    render() {
        const {animation, roughStyle, children, group} = this.props;

        return (
            <MeasureLines text={children}>
                {lines => {
                    let durations: Array<number>;
                    let gap: number;

                    let totalLength = lines.reduce(
                        (memo, line) => memo + line.right - line.left,
                        0,
                    );

                    if (animation.animation === "none") {
                        durations = lines.map(() => 0);
                    } else if (animation.animation === "duration") {
                        gap = Math.min(
                            100,
                            (animation.duration / lines.length) * 0.05,
                        );

                        let animateTime =
                            animation.duration - gap * (lines.length - 1);

                        durations = lines.map(
                            line =>
                                ((line.right - line.left) / totalLength) *
                                animateTime,
                        );
                    } else if (animation.animation === "speed") {
                        gap = 100;
                        durations = lines.map(
                            line =>
                                ((line.right - line.left) * 10) /
                                animation.speed,
                        );
                    } else {
                        throw new Error("Invalid animation type.");
                    }

                    let timeSoFar =
                        animation.animation === "none" ? 0 : animation.delay;

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

                    return (
                        <>
                            {lines.map(({left, right, bottom}, i) => {
                                let bowing;
                                if (roughStyle.bowing.bowing === "fixed") {
                                    bowing = roughStyle.bowing.amount;
                                } else {
                                    bowing =
                                        roughStyle.bowing.ratio /
                                        (right - left);
                                }

                                return (
                                    <RoughLine
                                        key={i}
                                        x1={left}
                                        x2={right}
                                        y1={bottom - roughStyle.lift}
                                        y2={bottom - roughStyle.lift}
                                        roughness={roughStyle.roughness}
                                        stroke={roughStyle.stroke}
                                        strokeWidth={roughStyle.strokeWidth}
                                        duration={durations[i]}
                                        delay={delays[i]}
                                        bowing={bowing}
                                    />
                                );
                            })}
                        </>
                    );
                }}
            </MeasureLines>
        );
    }
}

/**
 * Draw an animated underline underneath some inline text.
 *
 * ![Screen capture](media://RoughUnderline.gif)
 *
 * **Props**: [[RoughUnderlineProps]]
 *
 * @noInheritDoc
 */
export class RoughUnderline extends React.Component<RoughUnderlineProps> {
    /** @hidden */
    render() {
        const {props} = this;

        return (
            <ConnectToAnimationGroup>
                {group => <_RoughUnderline group={group} {...props} />}
            </ConnectToAnimationGroup>
        );
    }
}
