// /**
//  * @module tahoe-lafs-client
//  */

// import fs from 'fs';
// import FormData from 'form-data';
// import { default as fetch, Response } from 'node-fetch';

// /**
//  * Represents a client for a Tahoe-LAFS network
//  */
// class TahoeLAFSClient {
//   /**
//    * Hostname of the client
//    */
//   readonly hostname: string;

//   /**
//    * Port of the client
//    */
//   readonly port: number;

//   /**
//    * Url of the client
//    */
//   readonly url: string;

//   /**
//    * Creates a TahoeLAFSClient
//    *
//    * @param params
//    * @param params.hostname
//    * @param params.port
//    *
//    * @throws Error Invalid node port
//    */
//   constructor(params: { hostname: string, port: number }) {
//     const prefix = 'http://';
//     const hasPrefix = params.hostname.startsWith(prefix);
    
//     if (!Number.isInteger(params.port) || params.port <= 0) {
//       throw new Error('Invalid node port');
//     }
    
//     this.hostname = params.hostname;
//     this.port = params.port;
//     this.url = `${hasPrefix ? '' : prefix}${this.hostname}:${this.port}/uri`;
//   }

//   /***************************/
//   /* Retrieve file functions */
//   /***************************/

//   /**
//    * Retrieves an existing file from its filecap
//    *
//    * @param filecap Filecap of the file
//    *
//    * @returns Content of the file
//    *
//    * @todo Better filecap verification
//    */
//   async retrieveFile(filecap: string): Promise<Response> {
//     let url = `${this.url}/${filecap}`;

//     return fetch(`${url}`, {
//       method: "GET"
//     });
//   };

//   /**
//    * Retrieves an existing file from its name
//    *
//    * @param dircap Dircap of the filesystem
//    * @param filename Name of the file
//    * @param subdirs Location in the filesystem
//    *
//    * @returns Content of the file
//    */
//   async retrieveFilenode(dircap: string, filemane: string, subdirs?: string[]) {
//     let path = TahoeLAFSClient._buildPath(dircap, filemane, subdirs);

//     return fetch(`${this.url}/${path}`, {
//       method: "GET"
//     });
//   };

//   /*********************************************/
//   /* Gather information on resources functions */
//   /*********************************************/

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

//   /**
//    * Gathers information on an existing resource (file or directory) from its cap
//    *
//    * @param cap Filecap/Dircap of the resource
//    *
//    * @returns Information on the resource
//    *
//    * @todo Better cap verification
//    */
//   async gatherInfo(cap: string): Promise<Response> {
//     let url = `${this.url}/${cap}`;

//     return fetch(`${url}?t=json`, {
//       method: "GET"
//     });
//   };

//   /**
//    * Gathers information on an existing node
//    *
//    * @param dircap Dircap of the filesystem
//    * @param name Name of the resource
//    * @param subdirs Location in the filesystem
//    *
//    * @returns Information on the resource
//    */
//   async gatherNodeInfo(dircap: string, name: string, subdirs?: string[]): Promise<Response> {
//     let path = TahoeLAFSClient._buildPath(dircap, name, subdirs);

//     return fetch(`${this.url}/${path}?t=json`, {
//       method: "GET"
//     });
//   };

//   /*************************/
//   /* Upload file functions */
//   /*************************/

//   /**
//    * Uploads a file not attached to a filesystem
//    *
//    * @param file The full path to the file
//    * @param mutable Mutability of the file
//    *
//    * @returns Filecap of the resulting file
//    */
//   async uploadFile(file: string, mutable: boolean = false): Promise<Response> {
//     const form = new FormData();
//     form.append("file", fs.createReadStream(file));

//     const format = mutable === true ? "sdmf" : "chk";

//     return fetch(`${this.url}?format=${format}`, {
//       method: "PUT",
//       body: form
//     });
//   };

//   /**
//    * Uploads a file not attached to a filesystem from a content
//    *
//    * @param content The content of the file
//    * @param mutable Mutability of the file
//    *
//    * @returns Filecap of the resulting file
//    */
//   async uploadFileFromContent(content: string, mutable: boolean = false): Promise<Response> {
//     const form = new FormData();
//     form.append("file", content);

//     const format = mutable === true ? "sdmf" : "chk";

//     return fetch(`${this.url}?format=${format}`, {
//       method: "PUT",
//       body: form
//     });
//   };

//   /**************************/
//   /* Update files functions */
//   /**************************/

//   /**
//    * Updates an existing file from its filecap
//    *
//    * @param file The full path to the file with new content
//    * @param filecap Filecap of the file
//    *
//    * @returns Filecap of the file
//    */
//   async updateFile(file: string, filecap: string): Promise<Response> {
//     const form = new FormData();
//     form.append("file", fs.createReadStream(file));

//     return fetch(`${this.url}/${filecap}`, {
//       method: "PUT",
//       body: form
//     });
//   };

//   /**
//    * Updates an existing file content from its filecap
//    *
//    * @param content The content of the file
//    * @param filecap Filecap of the file
//    *
//    * @returns Filecap of the file
//    */
//   async updateFileFromContent(content: string, filecap: string): Promise<Response> {
//     const form = new FormData();
//     form.append("file", content);

//     return fetch(`${this.url}/${filecap}`, {
//       method: "PUT",
//       body: form
//     });
//   };

//   /**
//    * Updates an existing filenode or create a new filenode
//    *
//    * @param file The full path to the file with new content
//    * @param dircap Dircap of the filesystem
//    * @param filename Name of the file
//    * @param subdirs Location in the filesystem
//    * @param mutable Mutability of the file
//    *
//    * @returns Filecap of the file
//    */
//   async updateFilenode(file: string, dircap: string, filename: string, subdirs?: string[], mutable: boolean = false): Promise<Response> {
//     let path = TahoeLAFSClient._buildPath(dircap, filename, subdirs);

//     const format = mutable === true ? "sdmf" : "chk";
//     path = `${path}?format=${format}`;

//     const form = new FormData();
//     form.append("file", fs.createReadStream(file));

//     return fetch(`${this.url}/${path}`, {
//       method: "PUT",
//       body: form
//     });
//   };

//   /**
//    * Updates an existing filenode or create a new filenode from a content
//    *
//    * @param content The new content of the file
//    * @param dircap Dircap of the filesystem
//    * @param filename Name of the file
//    * @param subdirs Location in the filesystem
//    * @param mutable Mutability of the file
//    *
//    * @returns Filecap of the file
//    */
//   async updateFilenodeFromContent(content: string, dircap: string, filename: string, subdirs?: string[], mutable: boolean = false): Promise<Response> {
//     let path = TahoeLAFSClient._buildPath(dircap, filename, subdirs);

//     const format = mutable === true ? "sdmf" : "chk";
//     path = `${path}?format=${format}`;

//     const form = new FormData();
//     form.append("file", content);

//     return fetch(`${this.url}/${path}`, {
//       method: "PUT",
//       body: form
//     });
//   };

//   /******************************/
//   /* Create directory functions */
//   /******************************/

//   /**
//    * Creates a mutable directory
//    *
//    * @returns Dircap of the resulting directory
//    */
//   async createDirectory(): Promise<Response> {
//     return fetch(`${this.url}?t=mkdir`, {
//       method: "POST"
//     });
//   };

//   /**
//    * Creates a mutable dirnode
//    *
//    * @param dircap Dircap of the filesystem
//    * @param dirname Name of the directory
//    * @param subdirs Location in the filesystem
//    *
//    * @returns Dircap of the resulting directory
//    */
//   async createDirnode(dircap: string, dirname: string, subdirs?: string[]): Promise<Response> {
//     let path = TahoeLAFSClient._buildPath(dircap, dirname, subdirs);
    
//     return fetch(`${this.url}/${path}?t=mkdir`, {
//       method: "PUT"
//     });
//   };

//   /**
//    * Attaches an existing node
//    *
//    * @param uri URI of the link target
//    * @param dircap Dircap of the link filesystem
//    * @param name Name of the link
//    * @param subdirs Location in the filesystem
//    * @param replace Replace behavior (overwrite by default)
//    *
//    * @returns Cap of the resource
//    *
//    * @todo Use the API for programmatic operations
//    */
//   async addLink(uri: string, dircap: string, name: string, subdirs?: string[], replace: boolean | 'only-files' = true): Promise<Response> {

//     let url = this.url;
//     url = `${url}/${dircap}`;

//     if (subdirs) url = `${url}/${subdirs.join("/")}`;
   
//     const form = new FormData();
//     form.append("uri", uri);
//     form.append("name", name);

//     url = `${url}?t=uri`;
//     url = `${url}&replace=${replace}`;

//     return fetch(url, {
//       method: "POST",
//       body: form
//     });
//   };

//   /**
//    * Unlinks an existing node
//    *
//    * @param dircap Dircap of the filesystem
//    * @param name Name of the resource
//    * @param subdirs Location in the filesystem
//    *
//    * @returns Cap of the resource
//    */
//   async unlinkNode(dircap: string, name: string, subdirs?: string[]): Promise<Response> {
//     let path = TahoeLAFSClient._buildPath(dircap, name, subdirs);

//     return fetch(`${this.url}/${path}`, {
//       method: "DELETE"
//     });
//   };

//   /**
//    * Builds a node path
//    *
//    * @param dircap Dircap of the filesystem
//    * @param name Name of the resource
//    * @param subdirs Location in the filesystem
//    *
//    * @return Node full path
//    *
//    * @todo Better dircap verification
//    */
//   private static _buildPath(dircap: string, name: string, subdirs?: string[]): string {
//     let path = dircap;

//     if (subdirs) path = `${path}/${subdirs.join("/")}`;

//     path = `${path}/${name}`;

//     return path;
//   };

// }

// /**
//  * Expose
//  */
// export = TahoeLAFSClient;

/**
 * @module tahoe-lafs-client
 */

import FormData from 'form-data';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { buildPath } from './utils';

export enum Format {
  CHK = 'CHK',
  MDMF = 'MDMF',
  SDMF = 'SDMF'
}

export type FilecapInfo = {
  ro_uri: string,
  verify_uri: string,
  size: number,
  mutable: boolean,
  format: string
};

/**
 * Represents a client for a Tahoe-LAFS node
 */
export default class TahoeLAFSClient {

  /**
   * Axios client instance
   */
  private _client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this._client = axios.create(config);
  }

  readFilecap(filecap: string): Promise<AxiosResponse<string>> {
    const url = `/uri/${filecap}`;

    return this._client.get(url);
  }

  readFilecapInfo(filecap: string): Promise<AxiosResponse<[string, FilecapInfo]>> {
    const url = `/uri/${filecap}?t=json`;

    return this._client.get(url);
  }

  readFilename(dircap: string, filename: string, subdirs?: Array<string>): Promise<AxiosResponse<string>> {
    const url = `/uri/${buildPath(dircap, subdirs, filename)}`;

    return this._client.get(url);
  }

  uploadFile(content: string, format: Format = Format.CHK): Promise<AxiosResponse<string>> {
    const url = `/uri?format=${format}`;
    const form = new FormData();

    form.append('file', content);

    return this._client.put(url, form);
  }

  uploadFilecap(filecap: string, content: string, format: Format = Format.CHK): Promise<AxiosResponse<string>> {
    const url = `/uri/${filecap}?format=${format}`;
    const form = new FormData();

    form.append('file', content);

    return this._client.put(url, form);
  }

}
