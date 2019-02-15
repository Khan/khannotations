import * as React from "react";
import ReactDOM from "react-dom";

const AnimationGroupContext = React.createContext(
    null as (null | AnimationGroup),
);

/**
 * Pass a parent or grand-parent [[AnimationGroup]] to the child.
 *
 * Components that implement [[Animate]] can use this to get access to an
 * [[AnimationGroup]] that they are rendered inside.
 *
 * If there is no such [[AnimationGroup]], this component passes `null`
 * instead.
 *
 * Example use:
 * ```
 * <ConnectToAnimationGroup>
 *     {group => <AnimatedLineDrawing group={group} {...props} />}
 * </ConnectToAnimationGroup>
 * ```
 */
export const ConnectToAnimationGroup = AnimationGroupContext.Consumer;

export interface AnimateProps {
    /**
     * The group this animation is in, or `null` if the animation should
     * happen immediately.
     */
    group: AnimationGroup | null;
}

/**
 * A component that [[AnimationGroup]] can animate.
 *
 * This component gets access to the AnimationGroup via the
 * `<ConnectToAnimationGroup />` HOC and must:
 *  - call `group.register(this)` in componentDidMount()
 *  - call `group.unregister(this)` in componentWillUnmount()
 *  - call `group.register(this)` whenever `estimatedDuration` changes.
 *  - in componentDidUpdate, if the group changed, unregister from the old
 *    group, and register into the new group.
 *
 * If no group was passed into an Animate, it should be animated
 * immediately.
 *
 * @noInheritDoc
 */
export interface Animate extends React.Component<AnimateProps> {
    /**
     * The estimated duration of the animation this component can provide, or
     * null if the component is not yet ready to animate.
     *
     * If the `estimatedDuration` of any child Animate is `null`, nothing
     * will be animated until every `estimatedDuration` is set.
     */
    estimatedDuration: number | null;

    /**
     * [[AnimationGroup]] calls this when the component should start its
     * animation.
     */
    trigger: () => void;
}

/**
 * Props for [[AnimationGroup]]
 */
export interface AnimationGroupProps {
    /**
     * If true, the animation will not advance to the next step.
     */
    paused?: boolean;

    /**
     * Rendered untouched.
     *
     * Children and their decendents will be able to use
     * [[ConnectToAnimationGroup]] to get access to this
     * [[AnimationGroup]].
     */
    children: React.ReactNode;
}

/**
 * Make child [[Animate]] components animate *one by one* instead of
 * *all at once*.
 *
 * Any [[Animate]] components underneath an **AnimationGroup** will have
 * their animations triggered in DOM order (i.e., the order they appear in
 * your browser's HTML inspector devtool tab).
 *
 * **Props**: [[AnimationGroupProps]]
 *
 * ## Basic use
 *
 * [[RoughUnderline]], [[RoughHighlight]], [[RoughCircledBox]], and
 * [[AnimatedLineDrawing]] implement [[Animate]]. Placing these components
 * underneath an **AnimationGroup** will make them animate one by one.
 *
 * In the following example, the underline for "dolor sit amet" would be
 * animated, and then the underline for "legere dicunt." would be animated.
 * Without **AnimationGroup**, both animations would happen at the same time.
 *
 * ```
 * import {AnimationGroup, RoughUnderline} from "@khanacademy/khannotations";
 *
 * // ...
 *
 * <AnimationGroup>
 *     Lorem ipsum{" "}
 *     <RoughUnderline
 *         animation={speedAnimation}
 *         roughStyle={testStyle}
 *     >
 *         dolor sit amet
 *     </RoughUnderline>
 *     , has solet qualisque ex, an nam tantas{" "}
 *     <RoughUnderline
 *         animation={speedAnimation}
 *         roughStyle={testStyle}
 *     >
 *         legere dicunt.
 *     </RoughUnderline>
 * </AnimationGroup>
 * ```
 *
 * Because **AnimationGroup** uses React Context, [[RoughUnderline]] doesn't
 * need to be a direct child of AnimationGroup. For example, this would also
 * work:
 *
 * ```
 * import {AnimationGroup, RoughUnderline} from "@khanacademy/khannotations";
 *
 * // ...
 *
 * const Dolor = () => (
 *     <RoughUnderline
 *         animation={speedAnimaiton}
 *         roughStyle={testStyle}
 *     >
 *         dolor sit amet
 *     </RoughUnderline>
 * );
 *
 *
 * // ...
 *
 * <AnimationGroup>
 *     <Dolor />
 *     <Dolor />
 * </AnimationGroup>
 * ```
 *
 * ## Pausing
 *
 * An **AnimationGroup** can be paused by setting `paused={true}`. When a
 * group is paused, the group will not advance to the next animation. This
 * could be used, for example, to not render annotations until the user has
 * scrolled to them.
 *
 * ## Making custom [[Animate]] components
 *
 * You can add your own animated components to an AnimationGroup.
 *
 * First, the component you want to add to an animated group needs to implement
 * the [[Animate]] interface.
 *
 * Then, you need to pass it an instance of an AnimationGroup. This can be
 * done via the [[ConnectToAnimationGroup]] component:
 *
 * ```
 * import {ConnectToAnimationGroup} from "@khanacademy/khannotations";
 *
 * // ...
 *
 * const ConnectedCustomComponent = (props: Props) => (
 *     <ConnectToAnimationGroup>
 *         {group => <CustomComponent group={group} {...props} />}
 *     </ConnectToAnimationGroup>
 * );
 * ```
 *
 * @noInheritDoc
 */
export class AnimationGroup extends React.Component<AnimationGroupProps> {
    /// Animates that have not been triggered yet.
    private _pending: Array<Animate> = [];
    /// The Animate that is currently animating.
    private _animating: Animate | null = null;
    /// Animates that have been triggered. Includes _animating.
    private _triggered: Array<Animate> = [];

    /**
     * Called when an [[Animate]] component is mounted, when the
     * AnimationGroup for that component changes, or when the estimated
     * duration changes.
     *
     * [[Animate]] components must call this according to the rules set out
     * in the documentation for [[Animate]].
     */
    register = (component: Animate) => {
        if (this._triggered.indexOf(component) > -1) {
            return;
        }

        if (this._pending.indexOf(component) === -1) {
            this._pending = [...this._pending, component];
        }
        setTimeout(this._maybeAdvanceAnimation, 0);
    };

    /**
     * Called when an [[Animate]] component is unmounted, or when the
     * AnimationGroup for that [[Animate]] changes.
     *
     * [[Animate]] components must call this according to the rules set out
     * in the documentation for [[Animate]].
     */
    unregister = (component: Animate) => {
        this._pending = this._pending.filter(c => c !== component);
        this._triggered = this._triggered.filter(c => c !== component);
        this._animating =
            this._animating === component ? null : this._animating;
        setTimeout(this._maybeAdvanceAnimation, 0);
    };

    /// Start the next animation, if we're ready.
    ///
    /// We're ready if nothing is being animated, all child Animates
    /// have estimated durations, and we're not paused.
    private _maybeAdvanceAnimation = () => {
        if (this.props.paused) {
            return;
        }

        if (this._animating) {
            return;
        }
        if (this._pending.some(c => c.estimatedDuration === null)) {
            // Wait until all components are estimated.
            return;
        }

        let components = this._pending.map(c => {
            let domNode = ReactDOM.findDOMNode(c);
            if (!(domNode instanceof Element)) {
                throw new Error("Animate components must render Elements.");
            }
            return [domNode, c] as [Element, Animate];
        });

        let nextComponent = components.sort(function(a, b) {
            if (a[0] === b[0]) return 0;
            if (a[0].compareDocumentPosition(b[0]) & 2) {
                // b comes before a
                return 1;
            }
            return -1;
        })[0];

        if (nextComponent) {
            this._animating = nextComponent[1];
            this._pending = this._pending.filter(c => c !== this._animating);
            this._triggered = [...this._triggered, nextComponent[1]];
            nextComponent[1].trigger();
            setTimeout(
                this._handleAnimationComplete,
                nextComponent[1].estimatedDuration || 0,
            );
        }
    };

    /// Mark the current animation as completed, and go to the next one if
    /// we're ready.
    private _handleAnimationComplete = () => {
        this._animating = null;
        setTimeout(this._maybeAdvanceAnimation, 0);
    };

    /** @hidden */
    componentDidUpdate(prevProps: AnimationGroupProps) {
        if (!this.props.paused && prevProps.paused) {
            setTimeout(this._maybeAdvanceAnimation, 0);
        }
    }

    /** @hidden */
    render() {
        const {children} = this.props;

        return (
            <AnimationGroupContext.Provider value={this}>
                {children}
            </AnimationGroupContext.Provider>
        );
    }
}
