import { asyncExec } from './asyncExec';
import logger, { deepLog } from '../logger';

export async function setNpmToken(token?: string): Promise<void> {
  if (!token) return;
  try {
    const { stderr } = await asyncExec(
      `echo "//registry.npmjs.org/:_authToken=${token}" >> ~/.npmrc`
    );
    if (stderr) throw stderr;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export async function npmPublish() {
  try {
    const { stdout, stderr } = await asyncExec('npm publish');
    if (stderr) throw stderr;
    return stdout;
  } catch (error) {
    logger.error(
      `There was an error publishing the Npm Package`,
      deepLog(error)
    );
    return Promise.reject(error);
  }
}
