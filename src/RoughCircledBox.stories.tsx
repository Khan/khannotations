import React from "react";
import {storiesOf} from "@storybook/react";
import {css} from "aphrodite/no-important";

import {RoughCircledBox, RoughCircledBoxStyle} from "../src/RoughCircledBox";
import storyStyle from "./_storyStyle";

const roughStyle: RoughCircledBoxStyle = {
    roughness: 2,
    stroke: "red",
    strokeWidth: 2,
};

storiesOf("RoughCircledBox", module)
    .add("basic", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughCircledBox delay={0} roughStyle={roughStyle}>
                Lorem ipsum dolor sit amet.
            </RoughCircledBox>
        </h2>
    ))
    .add("positive margins", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughCircledBox
                roughStyle={roughStyle}
                delay={0}
                marginTop={20}
                marginBottom={20}
                marginLeft={20}
                marginRight={20}
            >
                Lorem ipsum dolor sit amet.
            </RoughCircledBox>
        </h2>
    ))
    .add("negative margins", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughCircledBox
                roughStyle={roughStyle}
                delay={0}
                marginTop={-20}
                marginBottom={-20}
                marginLeft={-20}
                marginRight={-20}
            >
                Lorem ipsum dolor sit amet.
            </RoughCircledBox>
        </h2>
    ))
    .add("right overlap", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughCircledBox
                roughStyle={roughStyle}
                delay={0}
                marginTop={0}
                marginBottom={0}
                marginLeft={0}
                marginRight={-100}
            >
                Lorem ipsum dolor sit amet.
            </RoughCircledBox>
        </h2>
    ))
    .add("bottom overlap", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughCircledBox
                roughStyle={roughStyle}
                delay={0}
                marginTop={0}
                marginBottom={-40}
                marginLeft={0}
                marginRight={0}
            >
                Lorem ipsum dolor sit amet.
            </RoughCircledBox>
        </h2>
    ));
