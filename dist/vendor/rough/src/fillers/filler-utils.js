"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geometry_1 = require("../geometry");
var hachure_1 = require("../utils/hachure");
function lineLength(line) {
    var p1 = line[0];
    var p2 = line[1];
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
exports.lineLength = lineLength;
function getIntersectingLines(line, points) {
    var intersections = [];
    var s1 = new geometry_1.Segment([line[0], line[1]], [line[2], line[3]]);
    for (var i = 0; i < points.length; i++) {
        var s2 = new geometry_1.Segment(points[i], points[(i + 1) % points.length]);
        if (s1.intersects(s2)) {
            intersections.push([s1.xi, s1.yi]);
        }
    }
    return intersections;
}
exports.getIntersectingLines = getIntersectingLines;
function affine(x, y, cx, cy, sinAnglePrime, cosAnglePrime, R) {
    var A = -cx * cosAnglePrime - cy * sinAnglePrime + cx;
    var B = R * (cx * sinAnglePrime - cy * cosAnglePrime) + cy;
    var C = cosAnglePrime;
    var D = sinAnglePrime;
    var E = -R * sinAnglePrime;
    var F = R * cosAnglePrime;
    return [
        A + C * x + D * y,
        B + E * x + F * y
    ];
}
exports.affine = affine;
function hachureLinesForPolygon(points, o) {
    var ret = [];
    if (points && points.length) {
        var left = points[0][0];
        var right = points[0][0];
        var top_1 = points[0][1];
        var bottom = points[0][1];
        for (var i = 1; i < points.length; i++) {
            left = Math.min(left, points[i][0]);
            right = Math.max(right, points[i][0]);
            top_1 = Math.min(top_1, points[i][1]);
            bottom = Math.max(bottom, points[i][1]);
        }
        var angle = o.hachureAngle;
        var gap = o.hachureGap;
        if (gap < 0) {
            gap = o.strokeWidth * 4;
        }
        gap = Math.max(gap, 0.1);
        var radPerDeg = Math.PI / 180;
        var hachureAngle = (angle % 180) * radPerDeg;
        var cosAngle = Math.cos(hachureAngle);
        var sinAngle = Math.sin(hachureAngle);
        var tanAngle = Math.tan(hachureAngle);
        var it_1 = new hachure_1.HachureIterator(top_1 - 1, bottom + 1, left - 1, right + 1, gap, sinAngle, cosAngle, tanAngle);
        var rect = void 0;
        while ((rect = it_1.nextLine()) != null) {
            var lines = getIntersectingLines(rect, points);
            for (var i = 0; i < lines.length; i++) {
                if (i < (lines.length - 1)) {
                    var p1 = lines[i];
                    var p2 = lines[i + 1];
                    ret.push([p1, p2]);
                }
            }
        }
    }
    return ret;
}
exports.hachureLinesForPolygon = hachureLinesForPolygon;
function hachureLinesForEllipse(helper, cx, cy, width, height, o) {
    var ret = [];
    var rx = Math.abs(width / 2);
    var ry = Math.abs(height / 2);
    rx += helper.randOffset(rx * 0.05, o);
    ry += helper.randOffset(ry * 0.05, o);
    var angle = o.hachureAngle;
    var gap = o.hachureGap;
    if (gap <= 0) {
        gap = o.strokeWidth * 4;
    }
    var fweight = o.fillWeight;
    if (fweight < 0) {
        fweight = o.strokeWidth / 2;
    }
    var radPerDeg = Math.PI / 180;
    var hachureAngle = (angle % 180) * radPerDeg;
    var tanAngle = Math.tan(hachureAngle);
    var aspectRatio = ry / rx;
    var hyp = Math.sqrt(aspectRatio * tanAngle * aspectRatio * tanAngle + 1);
    var sinAnglePrime = aspectRatio * tanAngle / hyp;
    var cosAnglePrime = 1 / hyp;
    var gapPrime = gap / ((rx * ry / Math.sqrt((ry * cosAnglePrime) * (ry * cosAnglePrime) + (rx * sinAnglePrime) * (rx * sinAnglePrime))) / rx);
    var halfLen = Math.sqrt((rx * rx) - (cx - rx + gapPrime) * (cx - rx + gapPrime));
    for (var xPos = cx - rx + gapPrime; xPos < cx + rx; xPos += gapPrime) {
        halfLen = Math.sqrt((rx * rx) - (cx - xPos) * (cx - xPos));
        var p1 = affine(xPos, cy - halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
        var p2 = affine(xPos, cy + halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
        ret.push([p1, p2]);
    }
    return ret;
}
exports.hachureLinesForEllipse = hachureLinesForEllipse;
//# sourceMappingURL=filler-utils.js.map