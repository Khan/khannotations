"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hasDocument = typeof document !== 'undefined';
var RoughSVGBase = /** @class */ (function () {
    function RoughSVGBase(svg) {
        this.svg = svg;
    }
    Object.defineProperty(RoughSVGBase.prototype, "defs", {
        get: function () {
            var doc = this.svg.ownerDocument || (hasDocument && document);
            if (doc) {
                if (!this._defs) {
                    var dnode = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    if (this.svg.firstChild) {
                        this.svg.insertBefore(dnode, this.svg.firstChild);
                    }
                    else {
                        this.svg.appendChild(dnode);
                    }
                    this._defs = dnode;
                }
            }
            return this._defs || null;
        },
        enumerable: true,
        configurable: true
    });
    RoughSVGBase.prototype.draw = function (drawable) {
        var sets = drawable.sets || [];
        var o = drawable.options || this.getDefaultOptions();
        var doc = this.svg.ownerDocument || window.document;
        var g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
        for (var _i = 0, sets_1 = sets; _i < sets_1.length; _i++) {
            var drawing = sets_1[_i];
            var path = null;
            switch (drawing.type) {
                case 'path': {
                    path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', this.opsToPath(drawing));
                    path.style.stroke = o.stroke;
                    path.style.strokeWidth = o.strokeWidth + '';
                    path.style.fill = 'none';
                    break;
                }
                case 'fillPath': {
                    path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', this.opsToPath(drawing));
                    path.style.stroke = 'none';
                    path.style.strokeWidth = '0';
                    path.style.fill = o.fill || null;
                    break;
                }
                case 'fillSketch': {
                    path = this.fillSketch(doc, drawing, o);
                    break;
                }
                case 'path2Dfill': {
                    path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', drawing.path || '');
                    path.style.stroke = 'none';
                    path.style.strokeWidth = '0';
                    path.style.fill = o.fill || null;
                    break;
                }
                case 'path2Dpattern': {
                    if (!this.defs) {
                        console.error('Cannot render path2Dpattern. No defs/document defined.');
                    }
                    else {
                        var size = drawing.size;
                        var pattern = doc.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                        var id = "rough-" + Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER || 999999));
                        pattern.setAttribute('id', id);
                        pattern.setAttribute('x', '0');
                        pattern.setAttribute('y', '0');
                        pattern.setAttribute('width', '1');
                        pattern.setAttribute('height', '1');
                        pattern.setAttribute('height', '1');
                        pattern.setAttribute('viewBox', "0 0 " + Math.round(size[0]) + " " + Math.round(size[1]));
                        pattern.setAttribute('patternUnits', 'objectBoundingBox');
                        var patternPath = this.fillSketch(doc, drawing, o);
                        pattern.appendChild(patternPath);
                        this.defs.appendChild(pattern);
                        path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', drawing.path || '');
                        path.style.stroke = 'none';
                        path.style.strokeWidth = '0';
                        path.style.fill = "url(#" + id + ")";
                    }
                    break;
                }
            }
            if (path) {
                g.appendChild(path);
            }
        }
        return g;
    };
    RoughSVGBase.prototype.fillSketch = function (doc, drawing, o) {
        var fweight = o.fillWeight;
        if (fweight < 0) {
            fweight = o.strokeWidth / 2;
        }
        var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.opsToPath(drawing));
        path.style.stroke = o.fill || null;
        path.style.strokeWidth = fweight + '';
        path.style.fill = 'none';
        return path;
    };
    return RoughSVGBase;
}());
exports.RoughSVGBase = RoughSVGBase;
//# sourceMappingURL=svg-base.js.map