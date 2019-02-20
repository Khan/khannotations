import React, {Component} from "react";
import {StyleSheet, css} from "aphrodite";

import {AnimationGroup} from "./AnimationGroup";
import {RoughUnderline, UnderlineStyle} from "./RoughUnderline";
import {RoughCircledBox, RoughCircledBoxStyle} from "./RoughCircledBox";
import {AnimationStrategy} from "./AnimationStrategy";
import {RoughHighlight, HighlightStyle} from "./RoughHighlight";
import {AnimatedLineDrawing} from "./AnimatedLineDrawing";

const OFF_BLACK = "#212629";
const KHAN_GREEN_TM = "#14bf96";
const LOGO_SIZE = 40;

let fastAnimation: AnimationStrategy = {
    animation: "speed",
    speed: 5,
    delay: 200,
};

let slowAnimation: AnimationStrategy = {
    animation: "speed",
    speed: 2,
    delay: 200,
};

let underlineStyle: UnderlineStyle = {
    roughness: 1,
    stroke: KHAN_GREEN_TM,
    strokeWidth: 2,
    bowing: {
        bowing: "inverse",
        ratio: 300,
    },
    lift: 0,
};

let linkStyle: UnderlineStyle = {
    ...underlineStyle,
    stroke: "blue",
};

let roughCircledBoxStyle: RoughCircledBoxStyle = {
    roughness: 2,
    stroke: KHAN_GREEN_TM,
    strokeWidth: 2,
};

let highlightStyle: HighlightStyle = {
    fill: KHAN_GREEN_TM,
    roughness: 1.5,
};

const Logo = () => (
    <div className={css(styles.logo)}>
        <svg
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            viewBox="0 0 24.710121870040894 23.279998779296875"
            style={{overflow: "visible"}}
            aria-hidden={true}
        >
            <path
                fill={KHAN_GREEN_TM}
                d="M2.31,5.8A3.56,3.56,0,0,0,.66,8.6V19.4a3.56,3.56,0,0,0,1.65,2.8L12,27.62a3.75,3.75,0,0,0,3.3,0L25,22.2a3.56,3.56,0,0,0,1.65-2.8V8.6A3.56,3.56,0,0,0,25,5.8L15.31.38a3.75,3.75,0,0,0-3.3,0Z"
            />
        </svg>
        <AnimatedLineDrawing
            title="Khan Academy logo"
            animation={slowAnimation}
            pathStyle={{
                stroke: "white",
                fill: "none",
                strokeWidth: 1,
                strokeLinejoin: "bevel",
                strokeLinecap: "round",
            }}
            className={css(styles.logoPath)}
            d="M23.61,11.32c-5.38,0-9.4,4.46-9.4,9.93v.23H13.13v-.23c0-5.47-4-9.91-9.42-9.93,0,.34,0,.69,0,1a9.91,9.91,0,0,0,6.4,9.32,10.47,10.47,0,0,0,3.59.64,10.64,10.64,0,0,0,3.62-.64,9.92,9.92,0,0,0,6.39-9.32C23.66,12,23.64,11.66,23.61,11.32ZM10.66,8.74a3,3 0 1,0 6,0a3,3 0 1,0 -6,0"
        />
    </div>
);

const MyLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactChild;
}) => (
    <a href={href} className={css(styles.link)}>
        <RoughUnderline animation={fastAnimation} roughStyle={linkStyle}>
            {children}
        </RoughUnderline>
    </a>
);

const MyHighlight = ({children}: {children: string}) => (
    <RoughHighlight roughStyle={highlightStyle} animation={fastAnimation}>
        {children}
    </RoughHighlight>
);

const MyUnderline = ({children}: {children: string}) => (
    <RoughUnderline animation={fastAnimation} roughStyle={underlineStyle}>
        {children}
    </RoughUnderline>
);

class App extends Component<{}, {key: number | undefined}> {
    state = {
        key: undefined,
    };

    render() {
        return (
            <AnimationGroup key={this.state.key}>
                <div className={css(styles.pageContainer)}>
                    <h1>
                        <Logo />
                        Kh
                        <MyHighlight>annotations</MyHighlight>
                    </h1>
                    <p className={css(styles.paragraph)}>
                        Khannotations is a React library for{" "}
                        <MyUnderline>rough</MyUnderline>,{" "}
                        <RoughUnderline
                            animation={fastAnimation}
                            roughStyle={underlineStyle}
                        >
                            animated
                        </RoughUnderline>
                        , annotations.
                    </p>
                    <p className={css(styles.paragraph)}>
                        It uses{" "}
                        <MyLink href="https://roughjs.com/">RoughJS</MyLink> and
                        is made by{" "}
                        <MyLink href="https://www.khanacademy.org/">
                            Khan Academy
                        </MyLink>
                        .
                    </p>
                    <div className={css(styles.moreOptions)}>
                        <a href="javascript:void(0)" onClick={this._reset}>
                            Run demo again
                        </a>{" "}
                        &middot;{" "}
                        <RoughCircledBox
                            roughStyle={roughCircledBoxStyle}
                            delay={200}
                        >
                            <a href="http://khan.github.io/khannotations/api">
                                Continue to docs &raquo;
                            </a>
                        </RoughCircledBox>
                    </div>
                </div>
            </AnimationGroup>
        );
    }

    _reset = () => {
        this.setState({
            key: Math.random(),
        });
    };
}

export default App;

const styles = StyleSheet.create({
    pageContainer: {
        maxWidth: 768,
        margin: "auto",
        fontFamily:
            '"Comic Sans MS", "Comic Sans", "Chalkboard", "ChalkboardSE-Regular", cursive, sans-serif',
        color: OFF_BLACK,
        position: "relative",
        paddingBottom: 40,
    },
    paragraph: {
        fontSize: 20,
        lineHeight: 1.3,
    },
    logoPath: {
        display: "inline-block",
        position: "absolute",
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        marginBottom: -16,
        left: 0,
        top: 0,
    },
    logo: {
        display: "inline-block",
        marginRight: 12,
        position: "relative",
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        verticalAlign: -4,
    },
    moreOptions: {
        marginTop: 40,
    },
    link: {
        color: "blue",
        textDecoration: "none",
        [":hover"]: {
            color: OFF_BLACK,
        },
    },
});
