var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "react-dom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = __importStar(require("react"));
    const react_dom_1 = __importDefault(require("react-dom"));
    const AnimationGroupContext = React.createContext(null);
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
    exports.ConnectToAnimationGroup = AnimationGroupContext.Consumer;
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
    class AnimationGroup extends React.Component {
        constructor() {
            super(...arguments);
            /// Animates that have not been triggered yet.
            this._pending = [];
            /// The Animate that is currently animating.
            this._animating = null;
            /// Animates that have been triggered. Includes _animating.
            this._triggered = [];
            /**
             * Called when an [[Animate]] component is mounted, when the
             * AnimationGroup for that component changes, or when the estimated
             * duration changes.
             *
             * [[Animate]] components must call this according to the rules set out
             * in the documentation for [[Animate]].
             */
            this.register = (component) => {
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
            this.unregister = (component) => {
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
            this._maybeAdvanceAnimation = () => {
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
                    let domNode = react_dom_1.default.findDOMNode(c);
                    if (!(domNode instanceof Element)) {
                        throw new Error("Animate components must render Elements.");
                    }
                    return [domNode, c];
                });
                let nextComponent = components.sort(function (a, b) {
                    if (a[0] === b[0])
                        return 0;
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
                    setTimeout(this._handleAnimationComplete, nextComponent[1].estimatedDuration || 0);
                }
            };
            /// Mark the current animation as completed, and go to the next one if
            /// we're ready.
            this._handleAnimationComplete = () => {
                this._animating = null;
                setTimeout(this._maybeAdvanceAnimation, 0);
            };
        }
        /** @hidden */
        componentDidUpdate(prevProps) {
            if (!this.props.paused && prevProps.paused) {
                setTimeout(this._maybeAdvanceAnimation, 0);
            }
        }
        /** @hidden */
        render() {
            const { children } = this.props;
            return (React.createElement(AnimationGroupContext.Provider, { value: this }, children));
        }
    }
    exports.AnimationGroup = AnimationGroup;
});
//# sourceMappingURL=AnimationGroup.js.map