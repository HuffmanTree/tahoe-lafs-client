"use strict";
/**
 * @module tahoe-lafs-client
 */
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
/**
 * Represents a client for a Tahoe-LAFS network
 */
class TahoeLAFSClient {
    /**
     * Creates a TahoeLAFSClient
     *
     * @param params
     * @param params.hostname
     * @param params.port
     *
     * @throws Error Invalid node port
     */
    constructor(params) {
        const prefix = 'http://';
        const hasPrefix = params.hostname.startsWith(prefix);
        if (!Number.isInteger(params.port) || params.port <= 0) {
            throw new Error('Invalid node port');
        }
        this.hostname = params.hostname;
        this.port = params.port;
        this.url = `${hasPrefix ? '' : prefix}${this.hostname}:${this.port}/uri`;
    }
    /***************************/
    /* Retrieve file functions */
    /***************************/
    /**
     * Retrieves an existing file from its filecap
     *
     * @param filecap Filecap of the file
     *
     * @returns Content of the file
     *
     * @todo Better filecap verification
     */
    retrieveFile(filecap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let url = `${this.url}/${filecap}`;
            return node_fetch_1.default(`${url}`, {
                method: "GET"
            });
        });
    }
    ;
    /**
     * Retrieves an existing file from its name
     *
     * @param dircap Dircap of the filesystem
     * @param filename Name of the file
     * @param subdirs Location in the filesystem
     *
     * @returns Content of the file
     */
    retrieveFilenode(dircap, filemane, subdirs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let path = TahoeLAFSClient._buildPath(dircap, filemane, subdirs);
            return node_fetch_1.default(`${this.url}/${path}`, {
                method: "GET"
            });
        });
    }
    ;
    /*********************************************/
    /* Gather information on resources functions */
    /*********************************************/
    /**
     * Determines the current health on an existing resource (file or directory) from its cap
     *
     * @param cap Filecap/Dircap of the resource
     *
     * @returns Health status of the resource
     *
     * @todo Better cap verification
     */
    checkHealth(cap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let url = `${this.url}/${cap}`;
            return node_fetch_1.default(`${url}?t=check&output=json`, {
                method: "POST"
            });
        });
    }
    ;
    /**
     * Gathers information on an existing resource (file or directory) from its cap
     *
     * @param cap Filecap/Dircap of the resource
     *
     * @returns Information on the resource
     *
     * @todo Better cap verification
     */
    gatherInfo(cap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let url = `${this.url}/${cap}`;
            return node_fetch_1.default(`${url}?t=json`, {
                method: "GET"
            });
        });
    }
    ;
    /**
     * Gathers information on an existing node
     *
     * @param dircap Dircap of the filesystem
     * @param name Name of the resource
     * @param subdirs Location in the filesystem
     *
     * @returns Information on the resource
     */
    gatherNodeInfo(dircap, name, subdirs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let path = TahoeLAFSClient._buildPath(dircap, name, subdirs);
            return node_fetch_1.default(`${this.url}/${path}?t=json`, {
                method: "GET"
            });
        });
    }
    ;
    /*************************/
    /* Upload file functions */
    /*************************/
    /**
     * Uploads a file not attached to a filesystem
     *
     * @param file The full path to the file
     * @param mutable Mutability of the file
     *
     * @returns Filecap of the resulting file
     */
    uploadFile(file, mutable = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("file", fs_1.default.createReadStream(file));
            const format = mutable === true ? "sdmf" : "chk";
            return node_fetch_1.default(`${this.url}?format=${format}`, {
                method: "PUT",
                body: form
            });
        });
    }
    ;
    /**
     * Uploads a file not attached to a filesystem from a content
     *
     * @param content The content of the file
     * @param mutable Mutability of the file
     *
     * @returns Filecap of the resulting file
     */
    uploadFileFromContent(content, mutable = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("file", content);
            const format = mutable === true ? "sdmf" : "chk";
            return node_fetch_1.default(`${this.url}?format=${format}`, {
                method: "PUT",
                body: form
            });
        });
    }
    ;
    /**************************/
    /* Update files functions */
    /**************************/
    /**
     * Updates an existing file from its filecap
     *
     * @param file The full path to the file with new content
     * @param filecap Filecap of the file
     *
     * @returns Filecap of the file
     */
    updateFile(file, filecap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("file", fs_1.default.createReadStream(file));
            return node_fetch_1.default(`${this.url}/${filecap}`, {
                method: "PUT",
                body: form
            });
        });
    }
    ;
    /**
     * Updates an existing file content from its filecap
     *
     * @param content The content of the file
     * @param filecap Filecap of the file
     *
     * @returns Filecap of the file
     */
    updateFileFromContent(content, filecap) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("file", content);
            return node_fetch_1.default(`${this.url}/${filecap}`, {
                method: "PUT",
                body: form
            });
        });
    }
    ;
    /**
     * Updates an existing filenode or create a new filenode
     *
     * @param file The full path to the file with new content
     * @param dircap Dircap of the filesystem
     * @param filename Name of the file
     * @param subdirs Location in the filesystem
     * @param mutable Mutability of the file
     *
     * @returns Filecap of the file
     */
    updateFilenode(file, dircap, filename, subdirs, mutable = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let path = TahoeLAFSClient._buildPath(dircap, filename, subdirs);
            const format = mutable === true ? "sdmf" : "chk";
            path = `${path}?format=${format}`;
            const form = new form_data_1.default();
            form.append("file", fs_1.default.createReadStream(file));
            return node_fetch_1.default(`${this.url}/${path}`, {
                method: "PUT",
                body: form
            });
        });
    }
    ;
    /**
     * Updates an existing filenode or create a new filenode from a content
     *
     * @param content The new content of the file
     * @param dircap Dircap of the filesystem
     * @param filename Name of the file
     * @param subdirs Location in the filesystem
     * @param mutable Mutability of the file
     *
     * @returns Filecap of the file
     */
    updateFilenodeFromContent(content, dircap, filename, subdirs, mutable = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let path = TahoeLAFSClient._buildPath(dircap, filename, subdirs);
            const format = mutable === true ? "sdmf" : "chk";
            path = `${path}?format=${format}`;
            const form = new form_data_1.default();
            form.append("file", content);
            return node_fetch_1.default(`${this.url}/${path}`, {
                method: "PUT",
                body: form
            });
        });
    }
    ;
    /******************************/
    /* Create directory functions */
    /******************************/
    /**
     * Creates a mutable directory
     *
     * @returns Dircap of the resulting directory
     */
    createDirectory() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return node_fetch_1.default(`${this.url}?t=mkdir`, {
                method: "POST"
            });
        });
    }
    ;
    /**
     * Creates a mutable dirnode
     *
     * @param dircap Dircap of the filesystem
     * @param dirname Name of the directory
     * @param subdirs Location in the filesystem
     *
     * @returns Dircap of the resulting directory
     */
    createDirnode(dircap, dirname, subdirs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let path = TahoeLAFSClient._buildPath(dircap, dirname, subdirs);
            return node_fetch_1.default(`${this.url}/${path}?t=mkdir`, {
                method: "PUT"
            });
        });
    }
    ;
    /**
     * Attaches an existing node
     *
     * @param uri URI of the link target
     * @param dircap Dircap of the link filesystem
     * @param name Name of the link
     * @param subdirs Location in the filesystem
     * @param replace Replace behavior (overwrite by default)
     *
     * @returns Cap of the resource
     *
     * @todo Use the API for programmatic operations
     */
    addLink(uri, dircap, name, subdirs, replace = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let url = this.url;
            url = `${url}/${dircap}`;
            if (subdirs)
                url = `${url}/${subdirs.join("/")}`;
            const form = new form_data_1.default();
            form.append("uri", uri);
            form.append("name", name);
            url = `${url}?t=uri`;
            url = `${url}&replace=${replace}`;
            return node_fetch_1.default(url, {
                method: "POST",
                body: form
            });
        });
    }
    ;
    /**
     * Unlinks an existing node
     *
     * @param dircap Dircap of the filesystem
     * @param name Name of the resource
     * @param subdirs Location in the filesystem
     *
     * @returns Cap of the resource
     */
    unlinkNode(dircap, name, subdirs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let path = TahoeLAFSClient._buildPath(dircap, name, subdirs);
            return node_fetch_1.default(`${this.url}/${path}`, {
                method: "DELETE"
            });
        });
    }
    ;
    /**
     * Builds a node path
     *
     * @param dircap Dircap of the filesystem
     * @param name Name of the resource
     * @param subdirs Location in the filesystem
     *
     * @return Node full path
     *
     * @todo Better dircap verification
     */
    static _buildPath(dircap, name, subdirs) {
        let path = dircap;
        if (subdirs)
            path = `${path}/${subdirs.join("/")}`;
        path = `${path}/${name}`;
        return path;
    }
    ;
}
module.exports = TahoeLAFSClient;
//# sourceMappingURL=index.js.map