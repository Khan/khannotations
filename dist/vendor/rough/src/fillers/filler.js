"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hachure_filler_1 = require("./hachure-filler");
var zigzag_filler_1 = require("./zigzag-filler");
var hatch_filler_1 = require("./hatch-filler");
var dot_filler_1 = require("./dot-filler");
var fillers = {};
function getFiller(o, helper) {
    var fillerName = o.fillStyle || 'hachure';
    if (!fillers[fillerName]) {
        switch (fillerName) {
            case 'zigzag':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new zigzag_filler_1.ZigZagFiller(helper);
                }
                break;
            case 'cross-hatch':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new hatch_filler_1.HatchFiller(helper);
                }
                break;
            case 'dots':
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new dot_filler_1.DotFiller(helper);
                }
                break;
            case 'hachure':
            default:
                fillerName = 'hachure';
                if (!fillers[fillerName]) {
                    fillers[fillerName] = new hachure_filler_1.HachureFiller(helper);
                }
                break;
        }
    }
    return fillers[fillerName];
}
exports.getFiller = getFiller;
//# sourceMappingURL=filler.js.map