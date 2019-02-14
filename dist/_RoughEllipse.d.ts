import * as React from "react";
import { Options as RoughJSOptions } from "./vendor/rough/src/core";
declare type Props = RoughJSOptions & {
    x: number;
    y: number;
    width: number;
    height: number;
    duration: number;
    delay: number;
};
declare type State = {
    d: string | null;
    pathStyle: {
        [key: string]: any;
    };
};
export default class RoughEllipse extends React.PureComponent<Props> {
    state: State;
    render(): "" | JSX.Element | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    _reset: () => void;
}
export {};
//# sourceMappingURL=_RoughEllipse.d.ts.map