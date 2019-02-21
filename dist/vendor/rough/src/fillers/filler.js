"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hachure_filler_1 = require("./hachure-filler");
const zigzag_filler_1 = require("./zigzag-filler");
const hatch_filler_1 = require("./hatch-filler");
const dot_filler_1 = require("./dot-filler");
const fillers = {};
function getFiller(o, helper) {
    let fillerName = o.fillStyle || 'hachure';
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