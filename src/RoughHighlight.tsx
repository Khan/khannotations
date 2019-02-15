import * as React from "react";

import MeasureLineWidths from "./_MeasureLines";
import RoughRectangle from "./_RoughRectangle";
import {AnimationStrategy} from "./AnimationStrategy";
import {
    AnimationGroup,
    Animate,
    ConnectToAnimationGroup,
} from "./AnimationGroup";

/**
 * Define what the highlight looks like.
 */
export interface HighlightStyle {
    /**
     * Numerical value indicating how rough the drawing is. A rectangle with
     * the roughness of 0 would be a perfect rectangle.
     *
     * There is no upper limit to this value, but a value over 10 is mostly
     * useless.
     */
    roughness: number;
    /**
     * String value representing the color used to fill a shape.
     *
     * Can be specicied in any of the
     * [ways to describe color in CSS](https://developer.mozilla.org/en-US/docs/Web/HTML/Applying_color#How_to_describe_a_color).
     */
    fill: string;
}

/**
 * Props for [[RoughHighlight]]
 */
export interface RoughHighlightProps {
    /**
     * The rules to describe how quickly this component should animate.
     */
    animation: AnimationStrategy;
    children: string;
    roughStyle: HighlightStyle;
}

interface State {
    triggered: boolean;
}

/**
 * Connected implementation of [[RoughHighlight]]
 */
class _RoughHighlight
    extends React.Component<
        RoughHighlightProps & {group: AnimationGroup | null},
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
    render() {
        const {children, animation, roughStyle, group} = this.props;

        return (
            <span>
                <MeasureLineWidths text={children}>
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
                            animation.animation === "none"
                                ? 0
                                : animation.delay;

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
                                {lines.map(({left, right, top, bottom}, i) => (
                                    <RoughRectangle
                                        key={i}
                                        x1={left}
                                        x2={right}
                                        y1={top}
                                        y2={bottom}
                                        roughness={roughStyle.roughness}
                                        fill={roughStyle.fill}
                                        fillStyle="solid"
                                        stroke="none"
                                        duration={durations[i]}
                                        delay={delays[i]}
                                    />
                                ))}
                            </>
                        );
                    }}
                </MeasureLineWidths>
            </span>
        );
    }
}

/**
 * Draw an animated highlight behind some inline text.
 *
 * ![Screen capture](media://RoughHighlight.gif)
 *
 * **Props**: [[RoughHighlightProps]]
 *
 * @noInheritDoc
 */
export class RoughHighlight extends React.Component<RoughHighlightProps> {
    /** @hidden */
    render() {
        const {props} = this;
        return (
            <ConnectToAnimationGroup>
                {group => <_RoughHighlight group={group} {...props} />}
            </ConnectToAnimationGroup>
        );
    }
}
