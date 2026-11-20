import {copyFile, cp, lstat, mkdir, mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildCozyWorld} from './build-cozy-world.mjs';
import {startServer} from './serve.mjs';

export async function startCozyCommonEngineQa({port=0, root=process.cwd()}={}) {
  const output = await mkdtemp(join(tmpdir(),'myfarm-common-engine-qa-'));
  await mkdir(join(output,'play'));
  await cp(resolve(root,'game/client/assets'),join(output,'play/assets'),{
    recursive:true,
    async filter(input) {
      if ((await lstat(input)).isSymbolicLink()) throw new Error('Symlinks are not QA build inputs.');
      return true;
    },
  });
  await copyFile(resolve(root,'dist/_headers'),join(output,'_headers'));
  const receipt = await buildCozyWorld(root,{qaDistRoot:output});
  const server = await startServer(port, output);
  const origin = 'http://127.0.0.1:' + server.address().port;
  return {
    origin, output, receipt,
    async close() {
      server.closeAllConnections();
      await new Promise(resolveClose => server.close(resolveClose));
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.MYFARM_QA_PORT ?? 4189);
  const {origin} = await startCozyCommonEngineQa({port});
  console.log('MyFarmTwin Common Engine QA ' + origin + '/play/');
}
