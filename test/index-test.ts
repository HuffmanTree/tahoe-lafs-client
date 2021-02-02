import axios from 'axios';
import FormData from 'form-data';
import { default as chai, expect } from 'chai';

chai.use(require('chai-as-promised'));

import TahoeLAFSClient from '../src/index';

const http = axios.create({ baseURL: 'http://localhost:4567' });

describe('TahoeLAFSClient', function () {

  const client = new TahoeLAFSClient({ baseURL: 'http://localhost:4567' });
  const content1 = 'hello world 1';
  const form1 = new FormData();

  form1.append('file1', content1);

  let filecap1: string;

  before(function(done) {
    http.put<string>('/uri', form1)
      .then(response => {
	filecap1 = response.data;

	console.log(filecap1);

	done();
      })

  });

  describe('readFilecap', function() {

    it('should successfully read an existing filecap', async function () {

      const response = await client.readFilecap(filecap1);

      expect(response)
	.to.have.property('status').and
	.to.be.a('number').and
	.to.equal(200);
      expect(response)
	.to.have.property('data').and
	.to.be.a('string');

    });

    it('should fail reading a non existing filecap', async function () {

      const filecap = 'URI:CHK:ihrbeov7lbvoduupd4qblysj7a:bg5agsdt62jb34hxvxmdsbza6do64f4fg5anxxod2buttbo6udzq:3:10:28733';
      const promise = client.readFilecap(filecap);

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 410$/);

    });

    it('should fail reading an invalid filecap', async function() {

      const filecap = 'wrong_filecap';
      const promise = client.readFilecap(filecap);

      await expect(promise).to.be.rejectedWith(/^Request failed with status code 400$/);

    });

  });

  describe('readFilecapInfo', function () {

    it('should successfully get info on a filecap', async function () {

      const response = await client.readFilecapInfo(filecap1);

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
	.to.be.a('string');
      expect(info)
	.to.have.property('verify_uri').and
	.to.be.a('string');
      expect(info)
	.to.have.property('size').and
	.to.be.a('number');
      expect(info)
	.to.have.property('mutable').and
	.to.be.a('boolean');
      expect(info)
	.to.have.property('format').and
	.to.be.a('string');

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

});
