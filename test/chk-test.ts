import axios from 'axios';
import FormData from 'form-data';
import { default as chai, expect } from 'chai';

chai.use(require('chai-string'));
chai.use(require('chai-as-promised'));

import TahoeLAFSClient, { Format } from '../src/index';

const http = axios.create({ baseURL: 'http://localhost:4567' });

describe('TahoeLAFSClient (CHK)', function () {

  const client = new TahoeLAFSClient({ baseURL: 'http://localhost:4567' });
  const content1 = 'hello world 1';
  const form1 = new FormData();

  form1.append('file1', content1);

  let filecapCHK: string;

  before(function (done) {

    http.put<string>(`/uri?format=${Format.CHK}`, form1)
      .then(response => {
	filecapCHK = response.data;

	done();
      })

  });

  describe('readFilecap', function() {

    it('should successfully read an existing filecap content', async function () {

      const response = await client.readFilecap(filecapCHK);

      expect(response)
	.to.have.property('status').and
	.to.be.a('number').and
	.to.equal(200);
      expect(response)
	.to.have.property('data').and
	.to.be.a('string');

    });

    it('should fail reading content of a non existing filecap', async function () {

      const filecap = 'URI:CHK:ihrbeov7lbvoduupd4qblysj7a:bg5agsdt62jb34hxvxmdsbza6do64f4fg5anxxod2buttbo6udzq:3:10:28733';
      const promise = client.readFilecap(filecap);

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 410$/);

    });

    it('should fail reading content of an invalid filecap', async function() {

      const filecap = 'wrong_filecap';
      const promise = client.readFilecap(filecap);

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 400$/);

    });

  });

  describe('readFilecapInfo', function () {

    it('should successfully get info on a filecap', async function () {

      const response = await client.readFilecapInfo(filecapCHK);

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
	.to.have.property('ro_uri').and
	.to.be.a('string').and
	.to.startWith('URI:CHK:');
      expect(info)
	.to.have.property('verify_uri').and
	.to.be.a('string').and
	.to.startWith('URI:CHK-Verifier:');
      expect(info)
	.to.have.property('size').and
	.to.be.a('number').and
	.to.be.greaterThan(0);
      expect(info)
	.to.have.property('mutable').and
	.to.be.a('boolean').and
	.to.be.false;
      expect(info)
	.to.have.property('format').and
	.to.be.a('string').and
	.to.equal(Format.CHK);

    });

    it('should fail getting info on an invalid filecap', async function() {

      const filecap = 'wrong_filecap';
      const response = await client.readFilecapInfo(filecap);

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

      const response = await client.uploadFile(content1, Format.CHK);

      expect(response)
	.to.have.property('status').and
	.to.be.a('number').and
	.to.equal(200);
      expect(response)
	.to.have.property('data').and
	.to.be.a('string').and
	.to.startWith('URI:CHK:');

    });

  });

  describe('uploadFilecap', function () {

    it('should fail uploading a filecap for an immutable file', async function () {

      const promise = client.uploadFilecap(filecapCHK, content1);

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 500$/);

    });

  });

});
