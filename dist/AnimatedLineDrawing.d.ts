import * as React from "react";
import { AnimationStrategy } from "./AnimationStrategy";
/**
 * Props for [[AnimatedLineDrawing]]
 */
export interface AnimatedLineDrawingProps {
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
     * Class applies to the `<svg>` element this component renders.
     */
    className?: string;
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
export declare class AnimatedLineDrawing extends React.Component<AnimatedLineDrawingProps> {
    /** @hidden */
    render(): JSX.Element;
}
//# sourceMappingURL=AnimatedLineDrawing.d.ts.map