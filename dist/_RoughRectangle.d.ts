import * as React from "react";
import { Options as RoughJSOptions } from "./vendor/rough/src/core";
declare type Props = RoughJSOptions & {
    duration: number;
    delay: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
declare type State = {
    paths: string[];
    pathLengths: number[];
    pathStyle: {
        [key: string]: any;
    };
};
export default class RoughRectangle extends React.Component<Props, State> {
    state: State;
    _svg: SVGSVGElement | null;
    render(): JSX.Element;
    componentDidMount(): void;
    shouldComponentUpdate(newProps: Props, newState: State): boolean;
    componentDidUpdate(prevProps: Props): void;
    _reset: () => void;
}
export {};
//# sourceMappingURL=_RoughRectangle.d.ts.map