import sv from 'standard-version';
import logger from '../logger';
import { gitPushWithTags, npmPublish, setNpmToken } from '~/src/helpers';
import { createGithubRelease, GithubOptions } from '../lib';
export interface ReleaseOptions {
  dryRun?: boolean;
  npm?: boolean;
  github?: boolean;
  NPM_TOKEN?: string;
  github_access?: GithubOptions;
}

export async function release({
  dryRun,
  npm,
  github,
  NPM_TOKEN,
  github_access,
}: ReleaseOptions) {
  try {
    await sv({
      dryRun,
      types: [
        { type: 'feat', section: 'Features' },
        { type: 'fix', section: 'Bug Fixes' },
        { type: 'chore', hidden: true },
        { type: 'docs', hidden: true },
        { type: 'style', hidden: false, section: 'Other Changes' },
        { type: 'refactor', hidden: true },
        { type: 'perf', hidden: false, section: 'Other Changes' },
        { type: 'test', hidden: false, section: 'Other Changes' },
      ],
      silent: true,
    });
    if (dryRun) return;
    await gitPushWithTags();
    if (npm) {
      logger.info(`Publishing to Npm`);
      await setNpmToken(NPM_TOKEN);
      const output = await npmPublish();
      logger.success(`Npm Package Published`, output);
    }
    if (github && github_access) {
      logger.info(`Creating Github Release`);
      const release = await createGithubRelease(github_access);
      logger.success(`Github Release Created`, release.data.html_url);
    }
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}
