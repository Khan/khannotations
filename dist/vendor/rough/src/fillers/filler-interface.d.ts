import { ResolvedOptions, OpSet, Op } from '../core';
import { Point } from '../geometry';
export interface PatternFiller {
    fillPolygon(points: Point[], o: ResolvedOptions): OpSet;
    fillEllipse(cx: number, cy: number, width: number, height: number, o: ResolvedOptions): OpSet;
}
export interface RenderHelper {
    randOffset(x: number, o: ResolvedOptions): number;
    randOffsetWithRange(min: number, max: number, o: ResolvedOptions): number;
    ellipse(x: number, y: number, width: number, height: number, o: ResolvedOptions): OpSet;
    doubleLineOps(x1: number, y1: number, x2: number, y2: number, o: ResolvedOptions): Op[];
}
//# sourceMappingURL=filler-interface.d.ts.map