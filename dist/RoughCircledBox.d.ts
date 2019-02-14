import * as React from "react";
/**
 * Define what the ellipse drawn looks like.
 */
export interface RoughCircledBoxStyle {
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
     */
    strokeWidth: number;
}
/**
 * Props for [[RoughCircledBox]]
 */
export interface RoughCircledBoxProps {
    delay: number;
    children: React.ReactNode | React.ReactNodeArray;
    roughStyle: RoughCircledBoxStyle;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
}
/**
 * Render an inline-block element that has a rough ellipse around it.
 *
 * The ellipse is calculated to just touch the rendered block element, but
 * you can give the ellipse more or less space by adjusting the margins.
 *
 * ![Screen capture](media://RoughCircledBox.gif)
 *
 * **Props**: [[RoughCircledBoxProps]]
 *
 * @noInheritDoc
 */
export declare class RoughCircledBox extends React.Component<RoughCircledBoxProps> {
    /** @hidden */
    render(): JSX.Element;
}
//# sourceMappingURL=RoughCircledBox.d.ts.map