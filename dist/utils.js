"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPath = void 0;
function buildPath(dircap, subdirs = [], filename) {
    return subdirs.length ? `${dircap}/${subdirs.join('/')}/${filename}` : `${dircap}/${filename}`;
}
exports.buildPath = buildPath;
//# sourceMappingURL=utils.js.map