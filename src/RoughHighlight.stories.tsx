import React from "react";
import {storiesOf} from "@storybook/react";
import {css} from "aphrodite/no-important";

import {AnimationStrategy} from "./AnimationStrategy";
import storyStyle from "./_storyStyle";
import {RoughHighlight} from "./RoughHighlight";

const roughStyle = {
    roughness: 2,
    fill: "red",
};

let speedAnimation: AnimationStrategy = {
    animation: "speed",
    speed: 5,
    delay: 200,
};

storiesOf("RoughHighlight", module)
    .add("basic", () => (
        <h2 className={css(storyStyle.story)}>
            Lorem{" "}
            <RoughHighlight roughStyle={roughStyle} animation={speedAnimation}>
                ipsum dolor
            </RoughHighlight>{" "}
            sit amet.
        </h2>
    ))
    .add("words are inline", () => (
        <h2 className={css(storyStyle.story)}>
            Lorem{" "}
            <RoughHighlight roughStyle={roughStyle} animation={speedAnimation}>
                ipsumdolorsitametdolorsitamet
            </RoughHighlight>
            , has solet
        </h2>
    ))
    .add("multi-line", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughHighlight roughStyle={roughStyle} animation={speedAnimation}>
                Lorem ipsum dolor sit amet, has solet qualisque ex, an nam
                tantas legere dicunt.
            </RoughHighlight>
        </h2>
    ))
    .add("stacking context sanity", () => (
        <div style={{zIndex: 5000}}>
            <h2 className={css(storyStyle.story)} style={{zIndex: 5}}>
                Lorem{" "}
                <RoughHighlight
                    roughStyle={roughStyle}
                    animation={speedAnimation}
                >
                    ipsumdolorsitametdolorsitamet
                </RoughHighlight>
                , has solet
                <div
                    style={{
                        zIndex: 1,
                        position: "absolute",
                        left: 20,
                        top: 20,
                        width: 100,
                        height: 100,
                        backgroundColor: "purple",
                    }}
                />
            </h2>
            <h2 className={css(storyStyle.story)} style={{zIndex: 5}}>
                Lorem{" "}
                <RoughHighlight
                    roughStyle={roughStyle}
                    animation={speedAnimation}
                >
                    ipsumdolorsitametdolorsitamet
                </RoughHighlight>
                , has solet
                <div
                    style={{
                        zIndex: 0,
                        position: "absolute",
                        left: 20,
                        top: 20,
                        width: 100,
                        height: 100,
                        backgroundColor: "purple",
                    }}
                />
            </h2>
            <h2 className={css(storyStyle.story)}>
                Lorem{" "}
                <RoughHighlight
                    roughStyle={roughStyle}
                    animation={speedAnimation}
                >
                    ipsumdolorsitametdolorsitamet
                </RoughHighlight>
                , has solet
                <div
                    style={{
                        zIndex: -1,
                        position: "absolute",
                        left: 20,
                        top: 20,
                        width: 100,
                        height: 100,
                        backgroundColor: "purple",
                    }}
                />
            </h2>
            <h2 className={css(storyStyle.story)}>
                Lorem{" "}
                <RoughHighlight
                    roughStyle={roughStyle}
                    animation={speedAnimation}
                >
                    ipsumdolorsitametdolorsitamet
                </RoughHighlight>
                , has solet
                <div
                    style={{
                        position: "absolute",
                        left: 20,
                        top: 20,
                        width: 100,
                        height: 100,
                        backgroundColor: "purple",
                    }}
                />
            </h2>
        </div>
    ));
