import { asyncExec } from './asyncExec';
import logger from '../logger';

export async function getGitTag(): Promise<string> {
  const cmd = await asyncExec('git describe --tags --abbrev=0');
  return cmd.stdout.trim();
}

export async function getGitURL(): Promise<string> {
  const cmd = await asyncExec('git ls-remote --get-url');
  return cmd.stdout.trim();
}

export async function getCurrentBranch(): Promise<string> {
  const cmd = await asyncExec('git branch --show-current');
  return cmd.stdout.trim();
}

export function splitRepoURL(url: string) {
  const matcher = url.match(/:.*\./g);
  if (!matcher?.length) {
    throw new Error('URL for repo did not match expected pattern');
  }
  const splits = matcher[0].replaceAll(':', '').replaceAll('//', '').split('/');
  return {
    owner: splits.at(-2),
    repo: splits.at(-1)?.replace('.', ''),
  };
}

export async function getGitInformation() {
  const latestTag = await getGitTag();
  const gitURL = await getGitURL();
  const { owner, repo } = splitRepoURL(gitURL);
  return {
    latestTag,
    owner,
    repo,
  };
}

export async function gitPushWithTags() {
  const currentBranch = await getCurrentBranch();
  logger.info(
    'Git Push',
    `Warning, pushing to ${currentBranch} including tags`
  );
  const cmd = await asyncExec(`git push --follow-tags origin ${currentBranch}`);
  return cmd.stdout.trim();
}
