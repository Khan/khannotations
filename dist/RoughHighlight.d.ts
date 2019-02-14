import * as React from "react";
import { AnimationStrategy } from "./AnimationStrategy";
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
/**
 * Draw an animated highlight behind some inline text.
 *
 * ![Screen capture](media://RoughHighlight.gif)
 *
 * **Props**: [[RoughHighlightProps]]
 *
 * @noInheritDoc
 */
export declare class RoughHighlight extends React.Component<RoughHighlightProps> {
    /** @hidden */
    render(): JSX.Element;
}
//# sourceMappingURL=RoughHighlight.d.ts.map