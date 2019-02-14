import React from "react";
import {storiesOf} from "@storybook/react";
import {css} from "aphrodite/no-important";

import {RoughUnderline, UnderlineStyle} from "../src/RoughUnderline";
import {AnimationStrategy} from "./AnimationStrategy";
import storyStyle from "./_storyStyle";

let speedAnimation: AnimationStrategy = {
    animation: "speed",
    speed: 5,
    delay: 100,
};

let durationAnimation: AnimationStrategy = {
    animation: "duration",
    duration: 500,
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

storiesOf("RoughUnderline", module)
    .add("single word", () => (
        <h2 className={css(storyStyle.story)}>
            Lorem{" "}
            <RoughUnderline animation={speedAnimation} roughStyle={testStyle}>
                ipsum
            </RoughUnderline>{" "}
            dolor sit amet.
        </h2>
    ))
    .add("words are inline", () => (
        <h2 className={css(storyStyle.story)}>
            Lorem{" "}
            <RoughUnderline animation={speedAnimation} roughStyle={testStyle}>
                ipsumdolorsitametdolorsitamet
            </RoughUnderline>
            , has solet
        </h2>
    ))
    .add("multi-line", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughUnderline animation={speedAnimation} roughStyle={testStyle}>
                Lorem ipsum dolor sit amet, has solet qualisque ex, an nam
                tantas legere dicunt.
            </RoughUnderline>
        </h2>
    ))
    .add("non-English", () => (
        <h2 className={css(storyStyle.story)}>
            լոռեմ իպսում դոլոռ սիթ ամեթ, զռիլ լուպթաթում ինծոռռուպթե եու
            <RoughUnderline animation={speedAnimation} roughStyle={testStyle}>
                նեծ, ֆածեթե եվեռթի քուաեքուե նո հիս. ֆածեթե ոռնաթուս թե քուի, նե
                նամ ծասե նոնումը նոմինավի. ծու դուո մոլլիս ռեգիոնե ռեպուդիառե,
                ծոնծեպթամ դիսսենթիունթ սեա եա, եում եխպեթենդա ռեպռեհենդունթ եխ.
                ծու եխեռծի ռեպուդիառե վիմ, գռաեծե սանծթուս սիթ ադ, եխպեթենդա
                ածծոմմոդառե դեթեռռուիսսեթ աթ սեա. քուիս քուոթ բլանդիթ դուո եխ,
                պեռ ինթեգռե մեդիոծռեմ ին.
            </RoughUnderline>
        </h2>
    ))
    .add("speed animation", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughUnderline animation={speedAnimation} roughStyle={testStyle}>
                A
                <br />
                Lorem
                <br />
                ipsum dolor sit amet, has solet qualisque ex, an nam tantas
                legere dicunt.
            </RoughUnderline>

            <br />
            <br />

            <RoughUnderline animation={speedAnimation} roughStyle={testStyle}>
                ipsum dolor sit amet
            </RoughUnderline>
        </h2>
    ))
    .add("duration animation", () => (
        <h2 className={css(storyStyle.story)}>
            <RoughUnderline
                animation={durationAnimation}
                roughStyle={testStyle}
            >
                A
                <br />
                Lorem
                <br />
                ipsum dolor sit amet, has solet qualisque ex, an nam tantas
                legere dicunt.
            </RoughUnderline>

            <br />
            <br />

            <RoughUnderline
                animation={durationAnimation}
                roughStyle={testStyle}
            >
                ipsum dolor sit amet
            </RoughUnderline>
        </h2>
    ));
