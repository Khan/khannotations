import * as React from "react";
import rough from "./vendor/rough/src/wrappers/rough";
import {Options as RoughJSOptions} from "./vendor/rough/src/core";
import InternalLineDrawing from "./_LineDrawing";

type Props = RoughJSOptions & {
    x: number;
    y: number;
    width: number;
    height: number;
    duration: number;
    delay: number;
};

type State = {
    d: string | null;
    pathStyle: {[key: string]: any};
};

export default class RoughEllipse extends React.PureComponent<Props> {
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
                    consistentDirection={true}
                />
            )
        );
    }

    componentDidMount() {
        this._reset();
    }

    componentDidUpdate(prevProps: Props) {
        let {x, y, width, height} = this.props;

        if (
            x !== prevProps.x ||
            y !== prevProps.y ||
            width !== prevProps.width ||
            height !== prevProps.height
        ) {
            this._reset();
        }
    }

    _reset = () => {
        let {
            x,
            y,
            width,
            height,
            duration,
            delay,
            stroke,
            strokeWidth,
            ...roughJsOptions
        } = this.props;
        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
            return;
        }

        let roughG = rough.generator(null, null as any);
        const ellipse = roughG.ellipse(x, y, width, height, roughJsOptions);
        this.setState({
            d: roughG.opsToPath(ellipse.sets[0]),
            pathStyle: {
                stroke: stroke || "black",
                strokeWidth: strokeWidth || 1,
                fill: "none",
            },
        });
    };
}
