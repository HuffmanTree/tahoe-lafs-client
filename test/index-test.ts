// TODO: URI checking

import { strict as assert } from 'assert';
import TahoeLAFSClient from '../src';

const params = {
  hostname: "localhost",
  port: 3456
};
const badParams = {
  hostname: "localhost",
  port: 2.4
};
const file = `${__dirname}/hello.txt`;
const newFile = `${__dirname}/hallo.txt`;
var mutableFileUri: string, immutableFileUri: string, mutableDirectoryUri: string;
const subdirs1 = ["this", "is", "the", "first", "path"];
const subdirs2 = ["this", "is", "the", "second", "path"];

let client: TahoeLAFSClient;

describe("TahoeLAFSClient", function() {

  describe("constructor", function() {
    it("should successfully create a TahoeLAFSClient", function () {
      client = new TahoeLAFSClient(params);
      assert(client instanceof TahoeLAFSClient);
    });
    it("should fail creating a TahoeLAFSClient", function () {
      assert.throws(
	() => { new TahoeLAFSClient(badParams) }
      );
    });
  });

  describe("createDirectory", function() {
    it("should successfully create a mutable directory", async function() {
      try {
	const res = await client.createDirectory();
	mutableDirectoryUri = await res.text();
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully create a mutable dirnode", async function() {
      try {
	const res = await client.createDirnode(mutableDirectoryUri, "dir1", subdirs1);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });
  });

  describe("uploadFile", function() {
    it("should successfully upload a mutable file", async function() {
      try {
	let res = await client.uploadFile(file, true);
	assert(res.ok);
	mutableFileUri = await res.text();
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a immutable file", async function() {
      try {
	let res = await client.uploadFile(file, false);
	assert(res.ok);
	immutableFileUri = await res.text();
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a mutable file from content", async function() {
      try {
	let res = await client.uploadFileFromContent("my mutable content", true);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a immutable file from content", async function() {
      try {
	let res = await client.uploadFileFromContent("my immutable content", false);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a mutable filenode", async function() {
      try {
	let res = await client.updateFilenode(file, mutableDirectoryUri, "file1", subdirs1, true);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a immutable filenode", async function() {
      try {
	let res = await client.updateFilenode(file, mutableDirectoryUri, "file2", subdirs2, false);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a mutable filenode from content", async function() {
      try {
	let res = await client.updateFilenodeFromContent("content of 'foo.txt'", mutableDirectoryUri, "foo.txt", subdirs1, true);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully upload a immutable filenode from content", async function() {
      try {
	let res = await client.updateFilenodeFromContent("content of 'bar.txt'", mutableDirectoryUri, "bar.txt", subdirs2, false);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });
  });

  describe("retrieveFile", function() {
    it("should successfully retrieve a file from its URI", async function() {
      try {
	let res = await client.retrieveFile(mutableFileUri);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      };
    });

    it("should successfully retrieve a filenode from its path", async function () {
      try {
	let res = await client.retrieveFilenode(mutableDirectoryUri, "file2", subdirs2);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      };
    });
  });

  describe("updateFile", function() {
    it("should successfully update a mutable file from its URI", async function() {
      try {
	let previousContent = await (await client.retrieveFile(mutableFileUri)).text();
	let res = await client.updateFile(newFile, mutableFileUri);
	let newContent = await (await client.retrieveFile(mutableFileUri)).text();
	assert(res.ok);
	assert(previousContent !== newContent);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully update a mutable filenode from its path", async function() {
      try {
	let previousContent = await (await client.retrieveFilenode(mutableDirectoryUri, "file1", subdirs1)).text();
	let res = await client.updateFilenode(newFile, mutableDirectoryUri, "file1", subdirs1);
	let newContent = await (await client.retrieveFilenode(mutableDirectoryUri, "file1", subdirs1)).text();
	assert(res.ok);
	assert(previousContent !== newContent);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully update a mutable file content from its URI", async function() {
      try {
	let previousContent = await (await client.retrieveFile(mutableFileUri)).text();
	let res = await client.updateFileFromContent("this is the new content of my file", mutableFileUri);
	let newContent = await (await client.retrieveFile(mutableFileUri)).text();
	assert(res.ok);
	assert(previousContent !== newContent);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully update a mutable filenode content from its path", async function() {
      try {
	let previousContent = await (await client.retrieveFilenode(mutableDirectoryUri, "file1", subdirs1)).text();
	let res = await client.updateFilenodeFromContent("this is the new content of my filenode", mutableDirectoryUri, "file1", subdirs1);
	let newContent = await (await client.retrieveFilenode(mutableDirectoryUri, "file1", subdirs1)).text();
	assert(res.ok);
	assert(previousContent !== newContent);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });
  });

  describe("gatherInfo", function() {
    it("should successfully check health of an immutable file from its URI", async function() {
      try {
	let res = await client.checkHealth(immutableFileUri);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully check health of a mutable directory from its URI", async function() {
      try {
	let res = await client.checkHealth(mutableDirectoryUri);
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });
    
    it("should successfully gather info on a mutable file from its URI", async function() {
      try {
	let res = await client.gatherInfo(mutableFileUri);
	let json = await res.json();
	assert(res.ok);
	assert(json[1].mutable);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully gather info on a mutable directory from its URI", async function() {
      try {
	let res = await client.gatherInfo(mutableDirectoryUri);
	let json = await res.json();
	assert(res.ok);
	assert(json[1].mutable);	
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully gather info on a mutable filenode from its path", async function() {
      try {
	let res = await client.gatherNodeInfo(mutableDirectoryUri, "file1", subdirs1);
	let json = await res.json();
	assert(res.ok);
	assert(json[1].mutable);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully gather info on a mutable dirnode from its path", async function() {
      try {
	let res = await client.gatherNodeInfo(mutableDirectoryUri, "dir1", subdirs1);
	let json = await res.json();
	assert(res.ok);
	assert(json[1].mutable);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });
  });

  describe("addLink", function() {
    it("should successfully add a link to a file", async function() {
      try {
	let res = await client.addLink(mutableFileUri, mutableDirectoryUri, "file3");
	assert(res.ok);
        assert(await res.text());
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should fail replacing an existing link", async function() {
      try {
	let res = await client.addLink(mutableFileUri, mutableDirectoryUri, "file3", undefined, false);
	assert(!res.ok);
	assert(res.status === 409);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully replacing an existing link", async function() {
      try {
	let res = await client.addLink(mutableFileUri, mutableDirectoryUri, "file3");
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });

    it("should successfully replacing an existing link", async function() {
      try {
	let res = await client.addLink(mutableFileUri, mutableDirectoryUri, "file3", undefined, "only-files");
	assert(res.ok);
      } catch (err) {
	console.error("err", err.message);
	assert(false);
      }
    });
  });
  
  describe("unlinkFile", function() {
    it("should successfully unlink a node", async function() {
      try {
    	let res = await client.unlinkNode(mutableDirectoryUri, "file1", subdirs1);
	assert(res.ok);
      } catch (err) {
    	console.error("err", err.message);
	assert(false);
      };
    });

    it("should fail unlinking a node", async function() {
      try {
    	let res = await client.unlinkNode(mutableDirectoryUri, "file1", subdirs1);
	assert(!res.ok);
	assert(res.status === 404);
      } catch (err) {
    	console.error("err", err.message);
	assert(false);
      };
    });
  });
});
