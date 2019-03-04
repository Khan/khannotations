import * as React from "react";
interface InternalLineDrawingProps {
    delay: number;
    duration: number;
    bare?: boolean;
    title: string | null;
    desc?: string;
    d: string;
    pathStyle: React.CSSProperties;
    pathClassName?: string;
    consistentDirection?: boolean;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
    delayRatio?: number;
}
declare type State = {
    paths: string[];
    pathLengths: number[];
    uniqueId: string | null;
};
export default class InternalLineDrawing extends React.PureComponent<InternalLineDrawingProps> {
    state: State;
    render(): JSX.Element | JSX.Element[];
    componentDidMount(): void;
    static getDerivedStateFromProps(props: InternalLineDrawingProps, state: State): State;
}
export {};
//# sourceMappingURL=_LineDrawing.d.ts.map