# tahoe-lafs-client
A javascript client for the [Tahoe-LAFS](https://tahoe-lafs.org/trac/tahoe-lafs) Web API written in Typescript.
> Note: The client has been tested with Tahoe-LAFS v1.12.1

## Getting Started
### Requirements
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- A working Tahoe-LAFS network (see [instructions](https://tahoe-lafs.readthedocs.io/en/tahoe-lafs-1.12.1/running.html))

### Installation
`npm install tahoe-lafs-client --save`

## Tests
Please use `npm test` to ensure the client is working as well as your Tahoe node.

## Usage
### Javascript
``` javascript
// Import the module
const TahoeLAFSClient = require('tahoe-lafs-client');

// Create a new client
const params = {
  hostname: 'localhost',
  port: 3456
};

const client = new TahoeLAFSClient(params);

console.log(client);
/**
 * TahoeLAFSClient {
 *  hostname: 'localhost',
 *  port: 3456,
 *  url: 'http://localhost:3456/uri'
 * }
 */
```

### Typescript
``` typescript
// Import the module
import TahoeLAFSClient from 'tahoe-lafs-client';

// Create a new client
const params = {
  hostname: 'localhost',
  port: 3456
};

const client = new TahoeLAFSClient(params);

console.log(client);
/**
 * TahoeLAFSClient {
 *  hostname: 'localhost',
 *  port: 3456,
 *  url: 'http://localhost:3456/uri'
 * }
 */
```

## Documentation
The documentation is available in the `doc` folder.
