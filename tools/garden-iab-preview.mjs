import {resolve} from 'node:path';
import {startServer} from './serve.mjs';
// Task-owned local preview for the internal browser; never takes port 4177.
const server=await startServer(0,resolve('qa-artifacts/garden/build/dist'));
console.log('Garden internal-browser preview: http://127.0.0.1:'+server.address().port+'/play/');
const close=()=>{server.closeAllConnections();server.close(()=>process.exit(0));};
process.on('SIGINT',close);process.on('SIGTERM',close);
