import axios from 'axios';
import FormData from 'form-data';
import { default as chai, expect } from 'chai';

chai.use(require('chai-string'));
chai.use(require('chai-as-promised'));

import TahoeLAFSClient, { Format, FilecapInfo, DircapInfo } from '../src/index';

const http = axios.create({ baseURL: 'http://localhost:4567' });

describe('TahoeLAFSClient (SDMF)', function () {

  const client = new TahoeLAFSClient({ baseURL: 'http://localhost:4567' });
  const content1 = 'hello world 1';
  const form1 = new FormData();

  form1.append('file1', content1);

  let filecapSDMF: string;
  let dircapSDMF: string;

  before(async function () {

    const r1 = await http.put<string>(`/uri?format=${Format.SDMF}`, form1);
    filecapSDMF = r1.data;

    const r2 = await http.post<string>(`/uri?t=mkdir-with-children&format=${Format.SDMF}`, { 'foo.txt': ['filenode', { ro_uri: filecapSDMF }] });
    dircapSDMF = r2.data;

  });

  describe('readFilecap', function() {

    it('should successfully read an existing filecap content', async function () {

      const response = await client.readFilecap(filecapSDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string');

    });

    it('should fail reading content of an invalid filecap', async function() {

      const filecap = 'wrong_filecap';
      const promise = client.readFilecap(filecap);

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 400$/);

    });

  });

  describe('readFilename', function () {

    it('should successfully read an existing filename content', async function () {

      const response = await client.readFilename(dircapSDMF, 'foo.txt');

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string');

    });

    it('should fail reading content of a non existing filename', async function () {

      const promise = client.readFilename(dircapSDMF, 'bar.txt');

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 404$/);

    });

  });

  describe('readCapabilityInfo', function () {

    it('should successfully get info on a filecap', async function () {

      const response = await client.readCapabilityInfo(filecapSDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.instanceOf(Array).and
        .to.have.lengthOf(2);

      const [flag, info] = response.data;

      expect(flag)
        .to.be.a('string').and.
        to.equal('filenode');
      expect(info)
        .to.be.an('object');
      expect(info)
        .to.have.property('rw_uri').and
        .to.be.a('string').and.
        to.startWith('URI:SSK:');
      expect(info)
        .to.have.property('ro_uri').and
        .to.be.a('string').and
        .to.startWith('URI:SSK-RO:');
      expect(info)
        .to.have.property('verify_uri').and
        .to.be.a('string').and
        .to.startWith('URI:SSK-Verifier:');
      expect(info)
        .to.have.property('size').and
        .to.be.a('number').and
        .to.be.greaterThan(0);
      expect(info)
        .to.have.property('mutable').and
        .to.be.a('boolean').and
        .to.be.true;
      expect(info)
        .to.have.property('format').and
        .to.be.a('string').and
        .to.equal(Format.SDMF);

    });

    it('should successfully get info on a dircap', async function () {

      const response = await client.readCapabilityInfo(dircapSDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.instanceOf(Array).and
        .to.have.lengthOf(2);

      const [flag, info] = response.data;

      expect(flag)
        .to.be.a('string').and.
        to.equal('dirnode');
      expect(info)
        .to.be.an('object');
      expect(info)
        .to.have.property('rw_uri')
        .and.to.be.a('string').and
        .to.startWith('URI:DIR2:');
      expect(info)
        .to.have.property('ro_uri').and
        .to.be.a('string').and
        .to.startWith('URI:DIR2-RO:');
      expect(info)
        .to.have.property('verify_uri').and
        .to.be.a('string').and
        .to.startWith('URI:DIR2-Verifier:');
      expect(info)
        .to.have.property('mutable').and
        .to.be.a('boolean').and
        .to.be.true;
      expect(info)
        .to.have.property('children').and
        .to.be.an('object');

    });

    it('should fail getting info on an invalid capability', async function() {

      const capability = 'wrong_capability';
      const response = await client.readCapabilityInfo(capability);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.instanceOf(Array).and
        .to.have.lengthOf(2);

      const [flag, info] = response.data;

      expect(flag)
        .to.be.a('string').and.
        to.equal('unknown');
      expect(info)
        .to.be.an('object').and
        .to.be.empty;

    });

  });

  describe('uploadFile', function () {

    it('should successfully upload a file with no filesystem', async function () {

      const response = await client.uploadFile(content1, Format.SDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:SSK:');

    });

  });

  describe('uploadFilecap', function () {

    it('should successfully upload a filecap', async function () {

      const response = await client.uploadFilecap(filecapSDMF, content1, Format.SDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:SSK:');

    });

  });

  describe('uploadFilename', function () {

    it('should successfully upload an immutable file on a mutable filesystem', async function () {

      const response = await client.uploadFilename(dircapSDMF, 'hello.txt', content1, Format.CHK);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(201);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:CHK:');

    });

    it('should successfully update (discard and replace) an immutable file on a mutable filesystem', async function () {

      const response = await client.uploadFilename(dircapSDMF, 'hello.txt', content1, Format.CHK);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:CHK:');

    });

    it('should successfully upload an mutable file on a mutable filesystem (1/2)', async function () {

      const response = await client.uploadFilename(dircapSDMF, 'world.txt', content1, Format.SDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(201);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:SSK:');

    });

    it('should successfully upload an mutable file on a mutable filesystem (2/2)', async function () {

      const response = await client.uploadFilename(dircapSDMF, '!!.txt', content1, Format.MDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(201);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:MDMF:');

    });

    it('should successfully update a mutable file on a mutable filesystem (1/2)', async function () {

      const response = await client.uploadFilename(dircapSDMF, 'world.txt', content1, Format.SDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:SSK:');

    });

    it('should successfully update a mutable file on a mutable filesystem (2/2)', async function () {

      const response = await client.uploadFilename(dircapSDMF, '!!.txt', content1, Format.MDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:MDMF:');

    });

  });

  describe('createDirectory', function () {

    it('should successfully create an empty directory', async function () {

      const response = await client.createDirectory(Format.SDMF);

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:DIR2:');

    });

    it('should successfully create a directory with contents', async function () {

      const filenode: ['filenode', FilecapInfo] = ['filenode', { ro_uri: filecapSDMF }];
      const dirnode: ['dirnode', DircapInfo] = ['dirnode', { ro_uri: dircapSDMF }];
      const response = await client.createDirectory(Format.SDMF, {
        'file1.txt': filenode,
        'folder1': dirnode
      });

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string').and
        .to.startWith('URI:DIR2:');

    });

  });

  describe('unlinkName', function () {

    it('should successfully unlink an existing filename', async function () {

      const response = await client.unlinkName(dircapSDMF, 'foo.txt');

      expect(response)
        .to.have.property('status').and
        .to.be.a('number').and
        .to.equal(200);
      expect(response)
        .to.have.property('data').and
        .to.be.a('string');

    });

    it('should fail unlinking a non existing filename', async function () {

      const promise = client.unlinkName(dircapSDMF, 'bar.txt');

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 404$/);

    });

  });

});
