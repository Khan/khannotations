import * as React from "react";
import { AnimationStrategy } from "./AnimationStrategy";
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
export declare type BowingStrategy = BowingStrategyFixed | BowingStrategyInverse;
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
/**
 * Draw an animated underline underneath some inline text.
 *
 * ![Screen capture](media://RoughUnderline.gif)
 *
 * **Props**: [[RoughUnderlineProps]]
 *
 * @noInheritDoc
 */
export declare class RoughUnderline extends React.Component<RoughUnderlineProps> {
    /** @hidden */
    render(): JSX.Element;
}
//# sourceMappingURL=RoughUnderline.d.ts.map