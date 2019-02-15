import * as React from "react";
export interface AnimationSettings {
    delay: number;
    duration: number;
}
interface InternalLineDrawingProps extends AnimationSettings {
    title: string | null;
    desc?: string;
    d: string;
    pathStyle: React.CSSProperties;
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
export default class InternalLineDrawing extends React.Component<InternalLineDrawingProps> {
    state: State;
    _svg: SVGSVGElement | null;
    render(): JSX.Element;
    shouldComponentUpdate(newProps: InternalLineDrawingProps, newState: State): boolean;
    componentDidMount(): void;
    static getDerivedStateFromProps(props: InternalLineDrawingProps, state: State): State;
}
export {};
//# sourceMappingURL=_LineDrawing.d.ts.map