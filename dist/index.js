"use strict";
//   /*********************************************/
//   /* Gather information on resources functions */
//   /*********************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
const tslib_1 = require("tslib");
//   /**
//    * Determines the current health on an existing resource (file or directory) from its cap
//    *
//    * @param cap Filecap/Dircap of the resource
//    *
//    * @returns Health status of the resource
//    *
//    * @todo Better cap verification
//    */
//   async checkHealth(cap: string): Promise<Response> {
//     let url = `${this.url}/${cap}`;
//     return fetch(`${url}?t=check&output=json`, {
//       method: "POST"
//     });
//   };
/**
 * @module tahoe-lafs-client
 */
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const utils_1 = require("./utils");
var Format;
(function (Format) {
    Format["CHK"] = "CHK";
    Format["MDMF"] = "MDMF";
    Format["SDMF"] = "SDMF";
})(Format = exports.Format || (exports.Format = {}));
/**
 * Represents a client for a Tahoe-LAFS node
 */
class TahoeLAFSClient {
    constructor(config) {
        this._client = axios_1.default.create(config);
    }
    readFilecap(filecap) {
        const url = `/uri/${filecap}`;
        return this._client.get(url);
    }
    readCapabilityInfo(capability) {
        const url = `/uri/${capability}?t=json`;
        return this._client.get(url);
    }
    readFilename(dircap, filename, subdirs) {
        const url = `/uri/${utils_1.buildPath(dircap, subdirs, filename)}`;
        return this._client.get(url);
    }
    uploadFile(content, format = Format.CHK) {
        const url = `/uri?format=${format}`;
        const form = new form_data_1.default();
        form.append('file', content);
        return this._client.put(url, form);
    }
    uploadFilecap(filecap, content, format = Format.CHK) {
        const url = `/uri/${filecap}?format=${format}`;
        const form = new form_data_1.default();
        form.append('file', content);
        return this._client.put(url, form);
    }
    uploadFilename(dircap, filename, content, format = Format.CHK, subdirs) {
        const url = `/uri/${utils_1.buildPath(dircap, subdirs, filename)}?format=${format}`;
        const form = new form_data_1.default();
        form.append('file', content);
        return this._client.put(url, form);
    }
    createDirectory(format = Format.SDMF, children = {}) {
        const url = `/uri?t=mkdir-with-children&format=${format}`;
        return this._client.post(url, children);
    }
    createImmutableDirectory(children = {}) {
        const url = '/uri?t=mkdir-immutable';
        return this._client.post(url, children);
    }
}
exports.default = TahoeLAFSClient;
//# sourceMappingURL=index.js.map