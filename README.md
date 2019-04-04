# Khannotations

Khannotations is a React library for rough, animated, annotations.

It uses [RoughJS](https://roughjs.com/) and is made by
[Khan Academy](https://www.khanacademy.org/).

[![View live demo](https://khan.github.io/khannotations/demo.gif)](https://khan.github.io/khannotations)

## Installation

To add Khannotations to a project, run this from the project directory:

```
npm install --save @khanacademy/khannotations aphrodite
```

If your project uses yarn, instead run this:

```
yarn add @khanacademy/khannotations aphrodite
```

## Usage

### Inline annotations

Khannotations provides two React components that render inline annotations:
RoughHighlight and RoughUnderline. You should be able to replace elements like
`<strong>` or `<u>` with these components.

For example, you could replace the following example:

```jsx
Lorem <u>ipsum</u> dolor sit amet.
```

with:

```jsx
// This example is in TypeScript.
// For JavaScript, omit UnderlineStyle/AnimationStrategy.
import {RoughUnderline, UnderlineStyle, AnimationStrategy} from "@khanacademy/khannotations";

// For JavaScript, omit ": AnimationStategy".
let speedAnimation: AnimationStrategy = {
    animation: "speed",
    speed: 5,
    delay: 100,
};

// For JavaScript, omit ": UnderlineStyle".
let underlineStyle: UnderlineStyle = {
    roughness: 3,
    stroke: "red",
    strokeWidth: 2,
    bowing: {
        bowing: "inverse",
        ratio: 300,
    },
    lift: 3,
};

const MyComponent = () => (
    <span>
        Lorem{" "}
        <RoughUnderline animation={speedAnimation} roughStyle={underlineStyle}>
            ipsum
        </RoughUnderline>{" "}
        dolor sit amet.
    </span>
);
```

Khannotations does not provide defaults, so you'll need to fill out your
animation strategy and styles yourself. If you find yourself doing this a
lot, you can always make a wrapper component that renders an annotation with
your prefered styles. For example, you could make a drop-in replacement for
`<u>` with:

```
const MyUnderline = (props) => (
    <RoughUnderline animation={speedAnimation} roughStyle={underlineStyle}>
        {props.children}
    </RoughUnderline>
);
```

See the [API docs](https://khan.github.io/khannotations/api/) for full usage.

### RoughCircledBox

RoughCircledBox is a block element that draws a rough ellipse just touching
its native bounding box.

### AnimatedLineDrawing

AnimatedLineDrawing is a block element that draws an SVG path.

### AnimatedGroup

If you want the annotations in a document to be rendered sequentially in
DOM order, put your annotations in an AnimatedGroup.

This works for RoughUnderlines, RoughHighlights, RoughCircledBoxes, and
AnimatedLineDrawings.

## Development

Contributions are welcome.

To develop Khannotations, you need Yarn.

To install JS dependencies, run `yarn`.

To open the [storybook](https://storybook.js.org/), run `yarn run storybook`.
This is where you'll probably do most of your work. When you make changes to
a module, it will be automatically updated in the storybook.

To work on the demo page (`./src/_App.tsx`), run `yarn start`.

To build the demo page, API documentation, and production build, run `yarn build`.
The app is built to the following folders:

-   The demo is built to `./docs`
-   The API documentation is built to `./docs/api`
-   The UMD modules are built to `./dist`
