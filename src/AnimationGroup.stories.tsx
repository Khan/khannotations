import React, {useState} from "react";
import {storiesOf} from "@storybook/react";
import {StyleSheet, css} from "aphrodite/no-important";

import {
    RoughUnderline,
    UnderlineStyle,
    AnimationStrategy,
    AnimationGroup,
    AnimatedLineDrawing,
} from "./lib";
import storyStyle from "./_storyStyle";

let speedAnimation: AnimationStrategy = {
    animation: "speed",
    speed: 5,
    delay: 100,
};

let testStyle: UnderlineStyle = {
    roughness: 3,
    stroke: "red",
    strokeWidth: 2,
    bowing: {
        bowing: "inverse",
        ratio: 300,
    },
    lift: 3,
};

storiesOf("AnimationGroup", module)
    .add("basic", () => (
        <h2 className={css(storyStyle.story)}>
            <AnimationGroup>
                Lorem ipsum{" "}
                <RoughUnderline
                    animation={speedAnimation}
                    roughStyle={testStyle}
                >
                    dolor sit amet
                </RoughUnderline>
                , has solet qualisque ex, an nam tantas{" "}
                <RoughUnderline
                    animation={speedAnimation}
                    roughStyle={testStyle}
                >
                    legere dicunt.
                </RoughUnderline>
                <div>
                    <AnimatedLineDrawing
                        animation={speedAnimation}
                        pathStyle={{
                            stroke: "red",
                            strokeWidth: 7,
                            fill: "none",
                        }}
                        d="M10,219c69.84,8.29,131.42,12.05,200.97,1.62c25.59-3.84,51.68-10.61,71.91-26.75 c24.58-19.6,37.27-50.28,46.93-80.2c9.66-29.92,17.63-61.21,36.09-86.66c7.21-9.94,21.15-19.35,30.64-11.54 c8.03,6.61,4.94,19.37,1.15,29.05c-11.56,29.54-23.11,59.07-34.67,88.61c19.38-27.55,38.77-55.1,58.15-82.64 c3.11-4.42,6.37-8.98,11.04-11.71c4.67-2.73,11.18-3.11,15.11,0.6c6.01,5.66-1.03,20.24-4.93,27.51 c-16.38,30.58-40.39,52.15-56.78,82.73c21.16-24.82,50.22-49.8,71.38-74.62c8.78-10.3,25.83-17.03,37.37-9.96 c7.6,4.66,9.17,15.6,5.9,23.89s-10.15,14.54-16.8,20.47c-22.17,19.78-49.72,48.01-71.89,67.79c19.47-9.73,39.45-28.13,56-39.17 c16.55-11.05,40.88-16.93,54.89-2.8c9.5,9.58,10.29,24.52,10.5,38.01c0.18,11.69,0.09,24.31-6.77,33.77s-23.28,12.53-29.73,2.78 c-4.78-7.21-2.06-17.66-7.12-24.67c-4.76-6.6-14.91-7.25-22.08-3.4c-7.17,3.85-11.9,11-15.75,18.17 c-7.74,14.41-13.15,30.06-15.96,46.18c-1.35,7.73-2.07,15.89,0.62,23.27c2.69,7.37,9.64,13.7,17.48,13.38 c12.34-0.5,20.02-15.92,32.35-16.69c9.18-0.57,17.08,8.06,18.21,17.19c1.13,9.13-3.02,18.17-8.56,25.51 c-18.31,24.26-53.78,33.78-81.78,21.96c-17.63-7.44-31.59-21.95-49.3-29.22c-17.4-7.14-36.85-6.68-55.65-6.11 C228.15,297.79,127.76,303.56,47,306"
                    />
                </div>
            </AnimationGroup>
        </h2>
    ))
    .add("click to animate", () => {
        function ClickToAnimateExample() {
            const [paused, setPaused] = useState(true);

            return (
                <h2 className={css(storyStyle.story)}>
                    <div>
                        <button onClick={() => setPaused(!paused)}>
                            Toggle paused
                        </button>
                    </div>
                    <AnimationGroup paused={paused}>
                        Lorem ipsum{" "}
                        <RoughUnderline
                            animation={speedAnimation}
                            roughStyle={testStyle}
                        >
                            dolor sit amet
                        </RoughUnderline>
                        , has solet qualisque ex, an nam tantas{" "}
                        <RoughUnderline
                            animation={speedAnimation}
                            roughStyle={testStyle}
                        >
                            legere dicunt.
                        </RoughUnderline>
                        <div>
                            <AnimatedLineDrawing
                                animation={speedAnimation}
                                pathStyle={{
                                    stroke: "red",
                                    strokeWidth: 7,
                                    fill: "none",
                                }}
                                d="M10,219c69.84,8.29,131.42,12.05,200.97,1.62c25.59-3.84,51.68-10.61,71.91-26.75 c24.58-19.6,37.27-50.28,46.93-80.2c9.66-29.92,17.63-61.21,36.09-86.66c7.21-9.94,21.15-19.35,30.64-11.54 c8.03,6.61,4.94,19.37,1.15,29.05c-11.56,29.54-23.11,59.07-34.67,88.61c19.38-27.55,38.77-55.1,58.15-82.64 c3.11-4.42,6.37-8.98,11.04-11.71c4.67-2.73,11.18-3.11,15.11,0.6c6.01,5.66-1.03,20.24-4.93,27.51 c-16.38,30.58-40.39,52.15-56.78,82.73c21.16-24.82,50.22-49.8,71.38-74.62c8.78-10.3,25.83-17.03,37.37-9.96 c7.6,4.66,9.17,15.6,5.9,23.89s-10.15,14.54-16.8,20.47c-22.17,19.78-49.72,48.01-71.89,67.79c19.47-9.73,39.45-28.13,56-39.17 c16.55-11.05,40.88-16.93,54.89-2.8c9.5,9.58,10.29,24.52,10.5,38.01c0.18,11.69,0.09,24.31-6.77,33.77s-23.28,12.53-29.73,2.78 c-4.78-7.21-2.06-17.66-7.12-24.67c-4.76-6.6-14.91-7.25-22.08-3.4c-7.17,3.85-11.9,11-15.75,18.17 c-7.74,14.41-13.15,30.06-15.96,46.18c-1.35,7.73-2.07,15.89,0.62,23.27c2.69,7.37,9.64,13.7,17.48,13.38 c12.34-0.5,20.02-15.92,32.35-16.69c9.18-0.57,17.08,8.06,18.21,17.19c1.13,9.13-3.02,18.17-8.56,25.51 c-18.31,24.26-53.78,33.78-81.78,21.96c-17.63-7.44-31.59-21.95-49.3-29.22c-17.4-7.14-36.85-6.68-55.65-6.11 C228.15,297.79,127.76,303.56,47,306"
                            />
                        </div>
                    </AnimationGroup>
                </h2>
            );
        }
        return <ClickToAnimateExample />;
    });
