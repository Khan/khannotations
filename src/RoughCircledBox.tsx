import * as React from "react";
import {cumulativeOffset} from "./_MeasureLines";
import RoughEllipse from "./_RoughEllipse";
import {StyleSheet, css} from "aphrodite/no-important";
import getRoots from "durand-kerner";
import isIE from "./_isIE";
import {
    AnimationGroup,
    Animate,
    ConnectToAnimationGroup,
} from "./AnimationGroup";

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
     *
     * Can be specicied in any of the
     * [ways to describe color in CSS](https://developer.mozilla.org/en-US/docs/Web/HTML/Applying_color#How_to_describe_a_color).
     */
    stroke: string;
    /**
     * Numerical value to set the width of the strokes (in pixels).
     */
    strokeWidth: number;
}

/**
 * Calculate the dimensions of an ellipse that bounds the provided rectangle.
 *
 * (w, h) represents the width and height of a rectangle centered around an
 * arbitrary point.
 *
 * The values (a, b) represent the horizontal and vertical *RADII* of an
 * ellipse that, if centered around the same point, bounds the rectangle.
 *
 * This is somewhat slow to calculate because it uses durand-kerner, and
 * so the result should be memozied.
 */
function getEllipseBoundingRectangle(
    w: number,
    h: number,
): {a: number; b: number} {
    // This simplifies our arithmetic.
    let d = h - w;

    // From https://math.stackexchange.com/questions/623922/ellipse-bounding-rectangle/623933#623933 we know that:
    //
    //  [1] b = a + 1/2 * d
    //  [2] w^2/(2a^2) + h^2/(2a+d)^2 = 1

    // Expanding and rearranging [2], we get:
    //  16*a^4 + 16*d*a^3 + (4*d^2 - 4*b^2 - 4*w^2)*a^2 - 4*d*w^2*a - w^2*d^2
    //  = 0

    // This can be rearranged into a quartic, which we can get the roots for.
    // (Note: x^0 is the first coefficient and x^4 is the last)
    let roots = getRoots([
        -w * w * d * d,
        -4 * d * w * w,
        4 * d * d - 4 * h * h - 4 * w * w,
        16 * d,
        16,
    ]);

    // The real parts are stored in roots[0] and the imaginary parts are stored
    // in roots[1]. I think there is only ever one real positive solution. If
    // I'm wrong, we pick the wider one.
    let a = 0;
    for (let i = 0; i < roots[0].length; ++i) {
        if (Math.abs(roots[1][i]) < 1e5) {
            a = Math.max(a, roots[0][i]);
        }
    }

    let b = a + 0.5 * d;

    return {
        a,
        b,
    };
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

type State = {
    triggered: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    a: number;
    b: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
};

/**
 * Connected implementation of [[RoughCircledBox]].
 */
class _RoughCircledBox
    extends React.Component<
        RoughCircledBoxProps & {group: AnimationGroup | null},
        State
    >
    implements Animate {
    /** @ignore */
    state: State = {
        triggered: false,
        x: NaN,
        y: NaN,
        width: NaN,
        height: NaN,
        a: NaN,
        b: NaN,
        marginLeft: NaN,
        marginRight: NaN,
        marginTop: NaN,
        marginBottom: NaN,
    };

    trigger = () => {
        this.setState({
            triggered: true,
        });
    };

    estimatedDuration: number | null = null;

    private _node: HTMLParagraphElement | null = null;
    private _interval: NodeJS.Timer | null = null;

    /** @ignore */
    componentDidMount() {
        if (isIE()) {
            return;
        }

        this._interval = setInterval(() => {
            if (this._node) {
                let offset = cumulativeOffset(this._node);
                const boundingRect = this._node.getBoundingClientRect();
                const marginBottom = this.props.marginBottom || 0;
                const marginLeft = this.props.marginLeft || 0;
                const marginRight = this.props.marginRight || 0;
                const marginTop = this.props.marginTop || 0;
                const x =
                    offset.left +
                    boundingRect.width / 2 -
                    marginLeft / 2 +
                    marginRight / 2;
                const y =
                    offset.top +
                    boundingRect.height / 2 -
                    marginTop / 2 +
                    marginBottom / 2;

                const width = boundingRect.width + marginLeft + marginRight;
                const height = boundingRect.height + marginTop + marginBottom;

                if (
                    x !== this.state.x ||
                    y !== this.state.y ||
                    width !== this.state.width ||
                    height !== this.state.height ||
                    marginBottom !== this.state.marginBottom ||
                    marginLeft !== this.state.marginLeft ||
                    marginRight !== this.state.marginRight ||
                    marginTop !== this.state.marginTop
                ) {
                    let bb = getEllipseBoundingRectangle(width, height);

                    this.setState({
                        x,
                        y,
                        width,
                        height,
                        a: bb.a,
                        b: bb.b,
                        marginBottom,
                        marginLeft,
                        marginRight,
                        marginTop,
                    });
                }
            }
        }, 500);
    }

    /** @ignore */
    componentWillUnmount() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    /** @ignore */
    render() {
        const {children, delay, roughStyle, group} = this.props;
        const {x, y, a, b} = this.state;

        if (isIE()) {
            return children;
        }

        if (group && !this.state.triggered) {
            this.estimatedDuration = 400;
            group.register(this);
        }

        return (
            <div
                ref={node => (this._node = node)}
                className={css(styles.paragraph)}
            >
                {children}
                {!isNaN(x) &&
                    !isNaN(y) &&
                    !isNaN(a) &&
                    !isNaN(b) &&
                    (!group || this.state.triggered) && (
                        <RoughEllipse
                            x={x}
                            y={y}
                            width={a * 2}
                            height={b * 2}
                            roughness={roughStyle.roughness}
                            stroke={roughStyle.stroke}
                            strokeWidth={roughStyle.strokeWidth}
                            duration={400}
                            delay={delay}
                        />
                    )}
            </div>
        );
    }
}

const styles = StyleSheet.create({
    paragraph: {
        display: "inline-block",
    },
});

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
export class RoughCircledBox extends React.Component<RoughCircledBoxProps> {
    /** @hidden */
    render() {
        const {props} = this;

        return (
            <ConnectToAnimationGroup>
                {group => <_RoughCircledBox group={group} {...props} />}
            </ConnectToAnimationGroup>
        );
    }
}
