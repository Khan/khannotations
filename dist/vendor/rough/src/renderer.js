"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("./path");
var filler_1 = require("./fillers/filler");
var helper = {
    randOffset: randOffset,
    randOffsetWithRange: randOffsetWithRange,
    ellipse: ellipse,
    doubleLineOps: doubleLineOps
};
function line(x1, y1, x2, y2, o) {
    return { type: 'path', ops: _doubleLine(x1, y1, x2, y2, o) };
}
exports.line = line;
function linearPath(points, close, o) {
    var len = (points || []).length;
    if (len > 2) {
        var ops = [];
        for (var i = 0; i < (len - 1); i++) {
            ops = ops.concat(_doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
        }
        if (close) {
            ops = ops.concat(_doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
        }
        return { type: 'path', ops: ops };
    }
    else if (len === 2) {
        return line(points[0][0], points[0][1], points[1][0], points[1][1], o);
    }
    return { type: 'path', ops: [] };
}
exports.linearPath = linearPath;
function polygon(points, o) {
    return linearPath(points, true, o);
}
exports.polygon = polygon;
function rectangle(x, y, width, height, o) {
    var points = [
        [x, y], [x + width, y], [x + width, y + height], [x, y + height]
    ];
    return polygon(points, o);
}
exports.rectangle = rectangle;
function curve(points, o) {
    var o1 = _curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
    var o2 = _curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
    return { type: 'path', ops: o1.concat(o2) };
}
exports.curve = curve;
function ellipse(x, y, width, height, o) {
    var increment = (Math.PI * 2) / o.curveStepCount;
    var rx = Math.abs(width / 2);
    var ry = Math.abs(height / 2);
    rx += _offsetOpt(rx * 0.05, o);
    ry += _offsetOpt(ry * 0.05, o);
    var o1 = _ellipse(increment, x, y, rx, ry, 1, increment * _offset(0.1, _offset(0.4, 1, o), o), o);
    var o2 = _ellipse(increment, x, y, rx, ry, 1.5, 0, o);
    return { type: 'path', ops: o1.concat(o2) };
}
exports.ellipse = ellipse;
function arc(x, y, width, height, start, stop, closed, roughClosure, o) {
    var cx = x;
    var cy = y;
    var rx = Math.abs(width / 2);
    var ry = Math.abs(height / 2);
    rx += _offsetOpt(rx * 0.01, o);
    ry += _offsetOpt(ry * 0.01, o);
    var strt = start;
    var stp = stop;
    while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
    }
    if ((stp - strt) > (Math.PI * 2)) {
        strt = 0;
        stp = Math.PI * 2;
    }
    var ellipseInc = (Math.PI * 2) / o.curveStepCount;
    var arcInc = Math.min(ellipseInc / 2, (stp - strt) / 2);
    var o1 = _arc(arcInc, cx, cy, rx, ry, strt, stp, 1, o);
    var o2 = _arc(arcInc, cx, cy, rx, ry, strt, stp, 1.5, o);
    var ops = o1.concat(o2);
    if (closed) {
        if (roughClosure) {
            ops = ops.concat(_doubleLine(cx, cy, cx + rx * Math.cos(strt), cy + ry * Math.sin(strt), o));
            ops = ops.concat(_doubleLine(cx, cy, cx + rx * Math.cos(stp), cy + ry * Math.sin(stp), o));
        }
        else {
            ops.push({ op: 'lineTo', data: [cx, cy] });
            ops.push({ op: 'lineTo', data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)] });
        }
    }
    return { type: 'path', ops: ops };
}
exports.arc = arc;
function svgPath(path, o) {
    path = (path || '').replace(/\n/g, ' ').replace(/(-\s)/g, '-').replace('/(\s\s)/g', ' ');
    var p = new path_1.RoughPath(path);
    if (o.simplification) {
        var fitter = new path_1.PathFitter(p.linearPoints, p.closed);
        var d = fitter.fit(o.simplification);
        p = new path_1.RoughPath(d);
    }
    var ops = [];
    var segments = p.segments || [];
    for (var i = 0; i < segments.length; i++) {
        var s = segments[i];
        var prev = i > 0 ? segments[i - 1] : null;
        var opList = _processSegment(p, s, prev, o);
        if (opList && opList.length) {
            ops = ops.concat(opList);
        }
    }
    return { type: 'path', ops: ops };
}
exports.svgPath = svgPath;
// Fills
function solidFillPolygon(points, o) {
    var ops = [];
    if (points.length) {
        var offset = o.maxRandomnessOffset || 0;
        var len = points.length;
        if (len > 2) {
            ops.push({ op: 'move', data: [points[0][0] + _offsetOpt(offset, o), points[0][1] + _offsetOpt(offset, o)] });
            for (var i = 1; i < len; i++) {
                ops.push({ op: 'lineTo', data: [points[i][0] + _offsetOpt(offset, o), points[i][1] + _offsetOpt(offset, o)] });
            }
        }
    }
    return { type: 'fillPath', ops: ops };
}
exports.solidFillPolygon = solidFillPolygon;
function patternFillPolygon(points, o) {
    return filler_1.getFiller(o, helper).fillPolygon(points, o);
}
exports.patternFillPolygon = patternFillPolygon;
function patternFillEllipse(cx, cy, width, height, o) {
    return filler_1.getFiller(o, helper).fillEllipse(cx, cy, width, height, o);
}
exports.patternFillEllipse = patternFillEllipse;
function patternFillArc(x, y, width, height, start, stop, o) {
    var cx = x;
    var cy = y;
    var rx = Math.abs(width / 2);
    var ry = Math.abs(height / 2);
    rx += _offsetOpt(rx * 0.01, o);
    ry += _offsetOpt(ry * 0.01, o);
    var strt = start;
    var stp = stop;
    while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
    }
    if ((stp - strt) > (Math.PI * 2)) {
        strt = 0;
        stp = Math.PI * 2;
    }
    var increment = (stp - strt) / o.curveStepCount;
    var points = [];
    for (var angle = strt; angle <= stp; angle = angle + increment) {
        points.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
    }
    points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
    points.push([cx, cy]);
    return patternFillPolygon(points, o);
}
exports.patternFillArc = patternFillArc;
function randOffset(x, o) {
    return _offsetOpt(x, o);
}
exports.randOffset = randOffset;
function randOffsetWithRange(min, max, o) {
    return _offset(min, max, o);
}
exports.randOffsetWithRange = randOffsetWithRange;
function doubleLineOps(x1, y1, x2, y2, o) {
    return _doubleLine(x1, y1, x2, y2, o);
}
exports.doubleLineOps = doubleLineOps;
// Private helpers
function _offset(min, max, ops) {
    return ops.roughness * ((Math.random() * (max - min)) + min);
}
function _offsetOpt(x, ops) {
    return _offset(-x, x, ops);
}
function _doubleLine(x1, y1, x2, y2, o) {
    var o1 = _line(x1, y1, x2, y2, o, true, false);
    var o2 = _line(x1, y1, x2, y2, o, true, true);
    return o1.concat(o2);
}
function _line(x1, y1, x2, y2, o, move, overlay) {
    var lengthSq = Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
    var offset = o.maxRandomnessOffset || 0;
    if ((offset * offset * 100) > lengthSq) {
        offset = Math.sqrt(lengthSq) / 10;
    }
    var halfOffset = offset / 2;
    var divergePoint = 0.2 + Math.random() * 0.2;
    var midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
    var midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
    midDispX = _offsetOpt(midDispX, o);
    midDispY = _offsetOpt(midDispY, o);
    var ops = [];
    var randomHalf = function () { return _offsetOpt(halfOffset, o); };
    var randomFull = function () { return _offsetOpt(offset, o); };
    if (move) {
        if (overlay) {
            ops.push({
                op: 'move', data: [
                    x1 + randomHalf(),
                    y1 + randomHalf()
                ]
            });
        }
        else {
            ops.push({
                op: 'move', data: [
                    x1 + _offsetOpt(offset, o),
                    y1 + _offsetOpt(offset, o)
                ]
            });
        }
    }
    if (overlay) {
        ops.push({
            op: 'bcurveTo', data: [
                midDispX + x1 + (x2 - x1) * divergePoint + randomHalf(),
                midDispY + y1 + (y2 - y1) * divergePoint + randomHalf(),
                midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomHalf(),
                midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomHalf(),
                x2 + randomHalf(),
                y2 + randomHalf()
            ]
        });
    }
    else {
        ops.push({
            op: 'bcurveTo', data: [
                midDispX + x1 + (x2 - x1) * divergePoint + randomFull(),
                midDispY + y1 + (y2 - y1) * divergePoint + randomFull(),
                midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomFull(),
                midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomFull(),
                x2 + randomFull(),
                y2 + randomFull()
            ]
        });
    }
    return ops;
}
function _curveWithOffset(points, offset, o) {
    var ps = [];
    ps.push([
        points[0][0] + _offsetOpt(offset, o),
        points[0][1] + _offsetOpt(offset, o),
    ]);
    ps.push([
        points[0][0] + _offsetOpt(offset, o),
        points[0][1] + _offsetOpt(offset, o),
    ]);
    for (var i = 1; i < points.length; i++) {
        ps.push([
            points[i][0] + _offsetOpt(offset, o),
            points[i][1] + _offsetOpt(offset, o),
        ]);
        if (i === (points.length - 1)) {
            ps.push([
                points[i][0] + _offsetOpt(offset, o),
                points[i][1] + _offsetOpt(offset, o),
            ]);
        }
    }
    return _curve(ps, null, o);
}
function _curve(points, closePoint, o) {
    var len = points.length;
    var ops = [];
    if (len > 3) {
        var b = [];
        var s = 1 - o.curveTightness;
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        for (var i = 1; (i + 2) < len; i++) {
            var cachedVertArray = points[i];
            b[0] = [cachedVertArray[0], cachedVertArray[1]];
            b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
            b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
            b[3] = [points[i + 1][0], points[i + 1][1]];
            ops.push({ op: 'bcurveTo', data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
        }
        if (closePoint && closePoint.length === 2) {
            var ro = o.maxRandomnessOffset;
            ops.push({ op: 'lineTo', data: [closePoint[0] + _offsetOpt(ro, o), closePoint[1] + _offsetOpt(ro, o)] });
        }
    }
    else if (len === 3) {
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        ops.push({
            op: 'bcurveTo', data: [
                points[1][0], points[1][1],
                points[2][0], points[2][1],
                points[2][0], points[2][1]
            ]
        });
    }
    else if (len === 2) {
        ops = ops.concat(_doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
    }
    return ops;
}
function _ellipse(increment, cx, cy, rx, ry, offset, overlap, o) {
    var radOffset = _offsetOpt(0.5, o) - (Math.PI / 2);
    var points = [];
    points.push([
        _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment),
        _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)
    ]);
    for (var angle = radOffset; angle < (Math.PI * 2 + radOffset - 0.01); angle = angle + increment) {
        points.push([
            _offsetOpt(offset, o) + cx + rx * Math.cos(angle),
            _offsetOpt(offset, o) + cy + ry * Math.sin(angle)
        ]);
    }
    points.push([
        _offsetOpt(offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5),
        _offsetOpt(offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)
    ]);
    points.push([
        _offsetOpt(offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap),
        _offsetOpt(offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)
    ]);
    points.push([
        _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5),
        _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)
    ]);
    return _curve(points, null, o);
}
function _arc(increment, cx, cy, rx, ry, strt, stp, offset, o) {
    var radOffset = strt + _offsetOpt(0.1, o);
    var points = [];
    points.push([
        _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment),
        _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)
    ]);
    for (var angle = radOffset; angle <= stp; angle = angle + increment) {
        points.push([
            _offsetOpt(offset, o) + cx + rx * Math.cos(angle),
            _offsetOpt(offset, o) + cy + ry * Math.sin(angle)
        ]);
    }
    points.push([
        cx + rx * Math.cos(stp),
        cy + ry * Math.sin(stp)
    ]);
    points.push([
        cx + rx * Math.cos(stp),
        cy + ry * Math.sin(stp)
    ]);
    return _curve(points, null, o);
}
function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
    var ops = [];
    var ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
    var f = [0, 0];
    for (var i = 0; i < 2; i++) {
        if (i === 0) {
            ops.push({ op: 'move', data: [path.x, path.y] });
        }
        else {
            ops.push({ op: 'move', data: [path.x + _offsetOpt(ros[0], o), path.y + _offsetOpt(ros[0], o)] });
        }
        f = [x + _offsetOpt(ros[i], o), y + _offsetOpt(ros[i], o)];
        ops.push({
            op: 'bcurveTo', data: [
                x1 + _offsetOpt(ros[i], o), y1 + _offsetOpt(ros[i], o),
                x2 + _offsetOpt(ros[i], o), y2 + _offsetOpt(ros[i], o),
                f[0], f[1]
            ]
        });
    }
    path.setPosition(f[0], f[1]);
    return ops;
}
function _processSegment(path, seg, prevSeg, o) {
    var ops = [];
    switch (seg.key) {
        case 'M':
        case 'm': {
            var delta = seg.key === 'm';
            if (seg.data.length >= 2) {
                var x = +seg.data[0];
                var y = +seg.data[1];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                var ro = 1 * (o.maxRandomnessOffset || 0);
                x = x + _offsetOpt(ro, o);
                y = y + _offsetOpt(ro, o);
                path.setPosition(x, y);
                ops.push({ op: 'move', data: [x, y] });
            }
            break;
        }
        case 'L':
        case 'l': {
            var delta = seg.key === 'l';
            if (seg.data.length >= 2) {
                var x = +seg.data[0];
                var y = +seg.data[1];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                ops = ops.concat(_doubleLine(path.x, path.y, x, y, o));
                path.setPosition(x, y);
            }
            break;
        }
        case 'H':
        case 'h': {
            var delta = seg.key === 'h';
            if (seg.data.length) {
                var x = +seg.data[0];
                if (delta) {
                    x += path.x;
                }
                ops = ops.concat(_doubleLine(path.x, path.y, x, path.y, o));
                path.setPosition(x, path.y);
            }
            break;
        }
        case 'V':
        case 'v': {
            var delta = seg.key === 'v';
            if (seg.data.length) {
                var y = +seg.data[0];
                if (delta) {
                    y += path.y;
                }
                ops = ops.concat(_doubleLine(path.x, path.y, path.x, y, o));
                path.setPosition(path.x, y);
            }
            break;
        }
        case 'Z':
        case 'z': {
            if (path.first) {
                ops = ops.concat(_doubleLine(path.x, path.y, path.first[0], path.first[1], o));
                path.setPosition(path.first[0], path.first[1]);
                path.first = null;
            }
            break;
        }
        case 'C':
        case 'c': {
            var delta = seg.key === 'c';
            if (seg.data.length >= 6) {
                var x1 = +seg.data[0];
                var y1 = +seg.data[1];
                var x2 = +seg.data[2];
                var y2 = +seg.data[3];
                var x = +seg.data[4];
                var y = +seg.data[5];
                if (delta) {
                    x1 += path.x;
                    x2 += path.x;
                    x += path.x;
                    y1 += path.y;
                    y2 += path.y;
                    y += path.y;
                }
                var ob = _bezierTo(x1, y1, x2, y2, x, y, path, o);
                ops = ops.concat(ob);
                path.bezierReflectionPoint = [x + (x - x2), y + (y - y2)];
            }
            break;
        }
        case 'S':
        case 's': {
            var delta = seg.key === 's';
            if (seg.data.length >= 4) {
                var x2 = +seg.data[0];
                var y2 = +seg.data[1];
                var x = +seg.data[2];
                var y = +seg.data[3];
                if (delta) {
                    x2 += path.x;
                    x += path.x;
                    y2 += path.y;
                    y += path.y;
                }
                var x1 = x2;
                var y1 = y2;
                var prevKey = prevSeg ? prevSeg.key : '';
                var ref = null;
                if (prevKey === 'c' || prevKey === 'C' || prevKey === 's' || prevKey === 'S') {
                    ref = path.bezierReflectionPoint;
                }
                if (ref) {
                    x1 = ref[0];
                    y1 = ref[1];
                }
                var ob = _bezierTo(x1, y1, x2, y2, x, y, path, o);
                ops = ops.concat(ob);
                path.bezierReflectionPoint = [x + (x - x2), y + (y - y2)];
            }
            break;
        }
        case 'Q':
        case 'q': {
            var delta = seg.key === 'q';
            if (seg.data.length >= 4) {
                var x1 = +seg.data[0];
                var y1 = +seg.data[1];
                var x = +seg.data[2];
                var y = +seg.data[3];
                if (delta) {
                    x1 += path.x;
                    x += path.x;
                    y1 += path.y;
                    y += path.y;
                }
                var offset1 = 1 * (1 + o.roughness * 0.2);
                var offset2 = 1.5 * (1 + o.roughness * 0.22);
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset1, o), path.y + _offsetOpt(offset1, o)] });
                var f = [x + _offsetOpt(offset1, o), y + _offsetOpt(offset1, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset1, o), y1 + _offsetOpt(offset1, o),
                        f[0], f[1]
                    ]
                });
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset2, o), path.y + _offsetOpt(offset2, o)] });
                f = [x + _offsetOpt(offset2, o), y + _offsetOpt(offset2, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset2, o), y1 + _offsetOpt(offset2, o),
                        f[0], f[1]
                    ]
                });
                path.setPosition(f[0], f[1]);
                path.quadReflectionPoint = [x + (x - x1), y + (y - y1)];
            }
            break;
        }
        case 'T':
        case 't': {
            var delta = seg.key === 't';
            if (seg.data.length >= 2) {
                var x = +seg.data[0];
                var y = +seg.data[1];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                var x1 = x;
                var y1 = y;
                var prevKey = prevSeg ? prevSeg.key : '';
                var ref = null;
                if (prevKey === 'q' || prevKey === 'Q' || prevKey === 't' || prevKey === 'T') {
                    ref = path.quadReflectionPoint;
                }
                if (ref) {
                    x1 = ref[0];
                    y1 = ref[1];
                }
                var offset1 = 1 * (1 + o.roughness * 0.2);
                var offset2 = 1.5 * (1 + o.roughness * 0.22);
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset1, o), path.y + _offsetOpt(offset1, o)] });
                var f = [x + _offsetOpt(offset1, o), y + _offsetOpt(offset1, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset1, o), y1 + _offsetOpt(offset1, o),
                        f[0], f[1]
                    ]
                });
                ops.push({ op: 'move', data: [path.x + _offsetOpt(offset2, o), path.y + _offsetOpt(offset2, o)] });
                f = [x + _offsetOpt(offset2, o), y + _offsetOpt(offset2, o)];
                ops.push({
                    op: 'qcurveTo', data: [
                        x1 + _offsetOpt(offset2, o), y1 + _offsetOpt(offset2, o),
                        f[0], f[1]
                    ]
                });
                path.setPosition(f[0], f[1]);
                path.quadReflectionPoint = [x + (x - x1), y + (y - y1)];
            }
            break;
        }
        case 'A':
        case 'a': {
            var delta = seg.key === 'a';
            if (seg.data.length >= 7) {
                var rx = +seg.data[0];
                var ry = +seg.data[1];
                var angle = +seg.data[2];
                var largeArcFlag = +seg.data[3];
                var sweepFlag = +seg.data[4];
                var x = +seg.data[5];
                var y = +seg.data[6];
                if (delta) {
                    x += path.x;
                    y += path.y;
                }
                if (x === path.x && y === path.y) {
                    break;
                }
                if (rx === 0 || ry === 0) {
                    ops = ops.concat(_doubleLine(path.x, path.y, x, y, o));
                    path.setPosition(x, y);
                }
                else {
                    for (var i = 0; i < 1; i++) {
                        var arcConverter = new path_1.RoughArcConverter([path.x, path.y], [x, y], [rx, ry], angle, largeArcFlag ? true : false, sweepFlag ? true : false);
                        var segment = arcConverter.getNextSegment();
                        while (segment) {
                            var ob = _bezierTo(segment.cp1[0], segment.cp1[1], segment.cp2[0], segment.cp2[1], segment.to[0], segment.to[1], path, o);
                            ops = ops.concat(ob);
                            segment = arcConverter.getNextSegment();
                        }
                    }
                }
            }
            break;
        }
        default:
            break;
    }
    return ops;
}
//# sourceMappingURL=renderer.js.map