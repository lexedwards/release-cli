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
    logger.error(
      `There was an error setting Npm Authorization Token`,
      deepLog(error)
    );
    return Promise.reject(error);
  }
}

export async function createNpmPackage(): Promise<string> {
  try {
    const { stdout } = await asyncExec(`npm pack`);
    return stdout.trim();
  } catch (error) {
    logger.error(
      `There was an error creating a Npm release package`,
      deepLog(error)
    );
    return Promise.reject(error);
  }
}

export async function npmPublish() {
  try {
    const { stdout, stderr } = await asyncExec('npm publish');
    if (stderr) throw stderr;
    return stdout.trim();
  } catch (error) {
    logger.error(
      `There was an error publishing the Npm Package`,
      deepLog(error)
    );
    return Promise.reject(error);
  }
}
