import * as React from "react";
import rough from "./vendor/rough/src/wrappers/rough";
import {Options as RoughJSOptions} from "./vendor/rough/src/core";
import InternalLineDrawing from "./_LineDrawing";

type Props = RoughJSOptions & {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    duration: number;
    delay: number;
};

type State = {
    d: string | null;
    pathStyle: {[key: string]: string | number};
};

export default class RoughLine extends React.PureComponent<Props, State> {
    state: State = {
        d: null,
        pathStyle: {},
    };

    render() {
        const {delay, duration} = this.props;
        const {d, pathStyle} = this.state;
        return (
            d && (
                <InternalLineDrawing
                    title={null}
                    delay={delay}
                    duration={duration}
                    d={d}
                    pathStyle={pathStyle}
                />
            )
        );
    }

    componentDidMount() {
        this._reset();
    }

    componentDidUpdate(prevProps: Props) {
        let {x1, y1, x2, y2} = this.props;

        if (
            x1 !== prevProps.x1 ||
            x2 !== prevProps.x2 ||
            y1 !== prevProps.y1 ||
            y2 !== prevProps.y2
        ) {
            this._reset();
        }
    }

    _reset = () => {
        let {
            x1,
            y1,
            x2,
            y2,
            duration,
            delay,
            stroke,
            strokeWidth,
            ...roughJsOptions
        } = this.props;
        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
            return;
        }

        let roughG = rough.generator(null, null as any);
        let line = roughG.line(x1, y1, x2, y2, roughJsOptions);
        this.setState({
            d: roughG.opsToPath(line.sets[0]),
            pathStyle: {
                stroke: stroke || "black",
                strokeWidth: strokeWidth || 1,
                fill: "none",
            },
        });
    };
}
