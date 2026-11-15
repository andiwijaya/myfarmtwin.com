import {startServer} from './serve.mjs';
const server=await startServer(0);
console.log('Local: http://127.0.0.1:'+server.address().port+'/play/glb/');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{server.closeAllConnections();server.close(()=>process.exit(0));});
