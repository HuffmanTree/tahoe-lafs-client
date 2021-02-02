"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPath = void 0;
function buildPath(dircap, subdirs = [], filename) {
    return `${dircap}/${subdirs.join('/')}/${filename}`;
}
exports.buildPath = buildPath;
//# sourceMappingURL=utils.js.map