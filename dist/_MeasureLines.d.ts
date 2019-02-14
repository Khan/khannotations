/// <reference types="node" />
import * as React from "react";
declare type Rect = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
declare type Props = {
    text: React.ReactChild | Array<React.ReactChild>;
    children: (lines: Array<Rect>) => React.ReactNode;
};
declare type State = {
    lines: Array<Rect>;
    style: any;
};
export declare function cumulativeOffset(element: HTMLElement | null): {
    top: number;
    left: number;
};
export default class MeasureLines extends React.Component<Props> {
    state: State;
    _nodes: Array<HTMLElement | null>;
    _interval: NodeJS.Timeout | null;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=_MeasureLines.d.ts.map