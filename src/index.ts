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

export type CapabilityMetadata = {
  ctime: string,
  mtime: string,
  tahoe: {
    linkcrtime: string,
    linkmotime: string
  }
}

export type FilecapInfo = {
  rw_uri?: string,
  ro_uri: string,
  verify_uri?: string,
  size?: number,
  mutable?: boolean,
  format?: Format,
  metadata?: CapabilityMetadata
};

export type DircapInfo = {
  rw_uri?: string,
  ro_uri: string,
  verify_uri?: string,
  mutable?: boolean,
  format?: Format,
  children?: Record<string, ['filenode', FilecapInfo] | ['dirnode', DircapInfo]>,
  metadata?: CapabilityMetadata
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

  readCapabilityInfo(capability: string): Promise<AxiosResponse<['filenode', FilecapInfo] | ['dirnode', DircapInfo]>> {
    const url = `/uri/${capability}?t=json`;

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

  uploadFilename(dircap: string, filename: string, content: string, format: Format = Format.CHK, subdirs?: Array<string>): Promise<AxiosResponse<string>> {
    const url = `/uri/${buildPath(dircap, subdirs, filename)}?format=${format}`;
    const form = new FormData();

    form.append('file', content);

    return this._client.put(url, form);
  }

  createDirectory(format: Format.SDMF | Format.MDMF = Format.SDMF, children: Record<string, ['filenode', FilecapInfo] | ['dirnode', DircapInfo]> = {}): Promise<AxiosResponse<string>> {
    const url = `/uri?t=mkdir-with-children&format=${format}`;

    return this._client.post(url, children);
  }

  createImmutableDirectory(children: Record<string, ['filenode', FilecapInfo] | ['dirnode', DircapInfo]> = {}): Promise<AxiosResponse<string>> {
    const url = '/uri?t=mkdir-immutable';

    return this._client.post(url, children);
  }

  unlinkName(dircap: string, name: string, subdirs?: Array<string>): Promise<AxiosResponse<string>> {
    const url = `/uri/${buildPath(dircap, subdirs, name)}`;

    return this._client.delete(url);
  }

}
