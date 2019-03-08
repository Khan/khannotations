"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hasDocument = typeof document !== 'undefined';
var RoughCanvasBase = /** @class */ (function () {
    function RoughCanvasBase(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }
    RoughCanvasBase.prototype.draw = function (drawable) {
        var sets = drawable.sets || [];
        var o = drawable.options || this.getDefaultOptions();
        var ctx = this.ctx;
        for (var _i = 0, sets_1 = sets; _i < sets_1.length; _i++) {
            var drawing = sets_1[_i];
            switch (drawing.type) {
                case 'path':
                    ctx.save();
                    ctx.strokeStyle = o.stroke;
                    ctx.lineWidth = o.strokeWidth;
                    this._drawToContext(ctx, drawing);
                    ctx.restore();
                    break;
                case 'fillPath':
                    ctx.save();
                    ctx.fillStyle = o.fill || '';
                    this._drawToContext(ctx, drawing);
                    ctx.restore();
                    break;
                case 'fillSketch':
                    this.fillSketch(ctx, drawing, o);
                    break;
                case 'path2Dfill': {
                    this.ctx.save();
                    this.ctx.fillStyle = o.fill || '';
                    var p2d = new Path2D(drawing.path);
                    this.ctx.fill(p2d);
                    this.ctx.restore();
                    break;
                }
                case 'path2Dpattern': {
                    var doc = this.canvas.ownerDocument || (hasDocument && document);
                    if (doc) {
                        var size = drawing.size;
                        var hcanvas = doc.createElement('canvas');
                        var hcontext = hcanvas.getContext('2d');
                        var bbox = this.computeBBox(drawing.path);
                        if (bbox && (bbox.width || bbox.height)) {
                            hcanvas.width = this.canvas.width;
                            hcanvas.height = this.canvas.height;
                            hcontext.translate(bbox.x || 0, bbox.y || 0);
                        }
                        else {
                            hcanvas.width = size[0];
                            hcanvas.height = size[1];
                        }
                        this.fillSketch(hcontext, drawing, o);
                        this.ctx.save();
                        this.ctx.fillStyle = this.ctx.createPattern(hcanvas, 'repeat');
                        var p2d = new Path2D(drawing.path);
                        this.ctx.fill(p2d);
                        this.ctx.restore();
                    }
                    else {
                        console.error('Cannot render path2Dpattern. No defs/document defined.');
                    }
                    break;
                }
            }
        }
    };
    RoughCanvasBase.prototype.computeBBox = function (d) {
        if (hasDocument) {
            try {
                var ns = 'http://www.w3.org/2000/svg';
                var svg = document.createElementNS(ns, 'svg');
                svg.setAttribute('width', '0');
                svg.setAttribute('height', '0');
                var pathNode = self.document.createElementNS(ns, 'path');
                pathNode.setAttribute('d', d);
                svg.appendChild(pathNode);
                document.body.appendChild(svg);
                var bbox = pathNode.getBBox();
                document.body.removeChild(svg);
                return bbox;
            }
            catch (err) { }
        }
        return null;
    };
    RoughCanvasBase.prototype.fillSketch = function (ctx, drawing, o) {
        var fweight = o.fillWeight;
        if (fweight < 0) {
            fweight = o.strokeWidth / 2;
        }
        ctx.save();
        ctx.strokeStyle = o.fill || '';
        ctx.lineWidth = fweight;
        this._drawToContext(ctx, drawing);
        ctx.restore();
    };
    RoughCanvasBase.prototype._drawToContext = function (ctx, drawing) {
        ctx.beginPath();
        for (var _i = 0, _a = drawing.ops; _i < _a.length; _i++) {
            var item = _a[_i];
            var data = item.data;
            switch (item.op) {
                case 'move':
                    ctx.moveTo(data[0], data[1]);
                    break;
                case 'bcurveTo':
                    ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
                    break;
                case 'qcurveTo':
                    ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
                    break;
                case 'lineTo':
                    ctx.lineTo(data[0], data[1]);
                    break;
            }
        }
        if (drawing.type === 'fillPath') {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    };
    return RoughCanvasBase;
}());
exports.RoughCanvasBase = RoughCanvasBase;
//# sourceMappingURL=canvas-base.js.map