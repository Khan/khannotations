/**
 * Don't animate.
 *
 * The animation will be immediately rendered in the finished state.
 */
export interface AnimationStrategyNone {
    animation: "none";
}

/**
 * Animate with a fixed duration.
 *
 * The animation will be in the unstarted state for `delay` msec, animate for
 * `duation` msec, and then stay in the completed state.
 */
export interface AnimationStrategyDuration {
    animation: "duration";

    /**
     * Duration of animation, in msec.
     */
    duration: number;

    /**
     * Delay before animation starts, in msec.
     */
    delay: number;
}

/**
 * Animate with a fixed speed.
 *
 * The component will be in the unstarted state for `delay` msec, animate at a
 * rate of `speed` pixels per 100 msec, and then stay in the completed state.
 *
 * Generally, use this strategy instead of [[AnimationStrategyDuration]] to
 * make your animations more responsive and localizable.
 */
export interface AnimationStrategySpeed {
    animation: "speed";
    /**
     * The speed of stroke rendered, in pixels per 100 msec.
     */
    speed: number;

    /**
     * Delay before animation starts, in msec.
     */
    delay: number;
}

/**
 * Define how a component should be animated.
 *
 * Can be any of the following types:
 *  - [[AnimationStrategyNone]]: Don't animate.
 *  - [[AnimationStrategyDuration]]: Animate with a fixed duration.
 *  - [[AnimationStrategySpeed]]: Animate with a fixed speed.
 *
 * Generally, use [[AnimationStrategySpeed]] instead of
 * [[AnimationStrategyDuration]] to make your animations more responsive and
 * localizable.
 */
export type AnimationStrategy =
    | AnimationStrategyNone
    | AnimationStrategyDuration
    | AnimationStrategySpeed;
