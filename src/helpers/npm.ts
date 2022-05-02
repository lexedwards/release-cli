import { asyncExec, isChildProcessError } from './asyncExec';
import logger, { deepLog } from '../logger';
import { bytesToHuman } from './bytesToHuman';

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
    const { stdout, stderr } = await asyncExec(`npm pack --json`);
    logger.info(`Npm Package`, stderr);
    return stdout.trim();
  } catch (error) {
    logger.error(
      `There was an error creating a Npm release package`,
      deepLog(error)
    );
    return Promise.reject(error);
  }
}

export interface NpmPublishSuccess {
  id: string;
  name: string;
  version: string;
  size: number;
  unpackedSize: number;
  shasum: string;
  integrity: string;
  filename: string;
  files: Array<{
    path: string;
    size: number;
    mode: number;
  }>;
  entryCount: number;
  bundles: Array<unknown>;
}

export interface NpmPublishError {
  error: {
    code: string;
    summary: string;
    detail: string;
  };
}

export async function npmPublish(NPM_TOKEN?: string, dryRun?: boolean) {
  logger.info(`Publishing to Npm`);
  try {
    await setNpmToken(NPM_TOKEN);
    const { stdout } = await asyncExec(
      `npm publish --json${dryRun ? ` --dry-run` : ''}`
    );
    const output: NpmPublishSuccess = JSON.parse(stdout);
    logger.success(
      'Npm Package Published',
      `Package: ${output.name} v${output.version}`,
      `Size:    ${bytesToHuman(output.unpackedSize)} (compressed ${bytesToHuman(
        output.size
      )})`,
      `Url:     https://npmjs.com/package/${output.name}`
    );
    return output;
  } catch (error) {
    let errorMessage = error;
    if (isChildProcessError(error)) {
      errorMessage = error.stderr.trim();
    }
    logger.error(
      `There was an error publishing the Npm Package`,
      deepLog(errorMessage)
    );
    return Promise.reject(errorMessage);
  }
}
