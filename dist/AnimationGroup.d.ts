import * as React from "react";
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
export declare const ConnectToAnimationGroup: React.ExoticComponent<React.ConsumerProps<AnimationGroup | null>>;
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
 * import {AnimationGroup, RoughUnderline} from "@khan/khannotations";
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
 * import {AnimationGroup, RoughUnderline} from "@khan/khannotations";
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
 * import {ConnectToAnimationGroup} from "@khan/khannotations";
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
export declare class AnimationGroup extends React.Component<AnimationGroupProps> {
    private _pending;
    private _animating;
    private _triggered;
    /**
     * Called when an [[Animate]] component is mounted, when the
     * AnimationGroup for that component changes, or when the estimated
     * duration changes.
     *
     * [[Animate]] components must call this according to the rules set out
     * in the documentation for [[Animate]].
     */
    register: (component: Animate) => void;
    /**
     * Called when an [[Animate]] component is unmounted, or when the
     * AnimationGroup for that [[Animate]] changes.
     *
     * [[Animate]] components must call this according to the rules set out
     * in the documentation for [[Animate]].
     */
    unregister: (component: Animate) => void;
    private _maybeAdvanceAnimation;
    private _handleAnimationComplete;
    /** @hidden */
    componentDidUpdate(prevProps: AnimationGroupProps): void;
    /** @hidden */
    render(): JSX.Element;
}
//# sourceMappingURL=AnimationGroup.d.ts.map