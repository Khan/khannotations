import * as React from "react";
import { Options as RoughJSOptions } from "./vendor/rough/src/core";
declare type Props = RoughJSOptions & {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    duration: number;
    delay: number;
};
declare type State = {
    d: string | null;
    pathStyle: {
        [key: string]: string | number;
    };
};
export default class RoughLine extends React.PureComponent<Props, State> {
    state: State;
    render(): "" | JSX.Element | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    _reset: () => void;
}
export {};
//# sourceMappingURL=_RoughLine.d.ts.map