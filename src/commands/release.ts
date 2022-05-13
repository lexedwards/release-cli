import sv from 'standard-version';
import {
  gitPushWithTags,
  npmPublish,
  createNpmPackage,
  isFirstRelease,
} from '~/src/helpers';
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
  const firstRelease = await isFirstRelease();
  await sv({
    firstRelease,
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
  if (dryRun) {
    createNpmPackage();
    return;
  }
  await gitPushWithTags();
  if (npm) {
    await npmPublish(NPM_TOKEN);
  }
  if (github && github_access) {
    await createGithubRelease(github_access);
  }
}
