import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { asyncExec, bytesToHuman, isChildProcessError } from '../helpers';
import logger, { deepLog } from '../logger';

export async function setNpmToken(token?: string) {
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

interface NpmPackageSearch {
  name: string;
  scope: string;
  version: string;
  description: string;
  links: {
    npm: string;
  };
  author: {
    name: string;
    email: string;
    url: string;
  };
  publisher: {
    username: string;
    email: string;
  };
  maintainers: Array<{
    username: string;
    email: string;
  }>;
}

export async function searchReleases(pkgName: string) {
  try {
    const { stdout } = await asyncExec(`npm search ${pkgName} --json`);
    const npmOutput: Array<NpmPackageSearch> = JSON.parse(stdout.trim());
    const exactPackage = npmOutput.find((pkg) => pkg.name === pkgName);
    return exactPackage || Promise.reject(`${pkgName} not found`);
  } catch (error) {
    logger.error(
      `There was an error searching npm for ${pkgName}`,
      deepLog(error)
    );
    return Promise.reject(error);
  }
}

export async function getPackageName() {
  const filePath = `./package.json`;
  try {
    if (existsSync(filePath)) {
      const file = await readFile(filePath, { encoding: 'utf8' });
      const pkgJson = JSON.parse(file);
      return pkgJson.name as string;
    } else {
      throw new Error('Package.json can not be found');
    }
  } catch (error) {
    logger.error(`There was a problem reading root dir's package.json`);
    return Promise.reject(error);
  }
}

export async function isFirstRelease() {
  try {
    const pkgName = await getPackageName();
    await searchReleases(pkgName);
    return false;
  } catch (error) {
    return true;
  }
}

export async function createNpmPackage() {
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
      `npm publish --json ${dryRun ? `--dry-run` : ''}`
    );
    let outputIdentifier = `{
  "id":`;
    let outputStartPos = stdout.search(outputIdentifier);
    let outputObject = stdout.slice(outputStartPos);
    const output: NpmPublishSuccess = JSON.parse(outputObject);
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
