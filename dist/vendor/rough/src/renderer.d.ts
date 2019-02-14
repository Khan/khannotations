import { ResolvedOptions, Op, OpSet } from './core';
import { Point } from './geometry';
export declare function line(x1: number, y1: number, x2: number, y2: number, o: ResolvedOptions): OpSet;
export declare function linearPath(points: Point[], close: boolean, o: ResolvedOptions): OpSet;
export declare function polygon(points: Point[], o: ResolvedOptions): OpSet;
export declare function rectangle(x: number, y: number, width: number, height: number, o: ResolvedOptions): OpSet;
export declare function curve(points: Point[], o: ResolvedOptions): OpSet;
export declare function ellipse(x: number, y: number, width: number, height: number, o: ResolvedOptions): OpSet;
export declare function arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean, roughClosure: boolean, o: ResolvedOptions): OpSet;
export declare function svgPath(path: string, o: ResolvedOptions): OpSet;
export declare function solidFillPolygon(points: Point[], o: ResolvedOptions): OpSet;
export declare function patternFillPolygon(points: Point[], o: ResolvedOptions): OpSet;
export declare function patternFillEllipse(cx: number, cy: number, width: number, height: number, o: ResolvedOptions): OpSet;
export declare function patternFillArc(x: number, y: number, width: number, height: number, start: number, stop: number, o: ResolvedOptions): OpSet;
export declare function randOffset(x: number, o: ResolvedOptions): number;
export declare function randOffsetWithRange(min: number, max: number, o: ResolvedOptions): number;
export declare function doubleLineOps(x1: number, y1: number, x2: number, y2: number, o: ResolvedOptions): Op[];
//# sourceMappingURL=renderer.d.ts.map