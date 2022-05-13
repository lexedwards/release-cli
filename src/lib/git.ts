import { asyncExec } from '../helpers';
import logger, { deepLog } from '../logger';

export async function getGitTag() {
  const cmd = await asyncExec('git describe --tags --abbrev=0');
  return cmd.stdout.trim();
}

export async function getGitURL() {
  const cmd = await asyncExec('git ls-remote --get-url');
  return cmd.stdout.trim();
}

export async function getGitCommit() {
  const cmd = await asyncExec(`git log -1 --pretty=%B`);
  return cmd.stdout.trim();
}

export async function getCurrentBranch() {
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
  try {
    const currentBranch = await getCurrentBranch();
    logger.info(
      'Pushing updated to repo',
      `Warning, pushing to ${currentBranch} including tags`
    );
    const { stdout } = await asyncExec(
      `git push --follow-tags origin ${currentBranch}`
    );
    return stdout.trim();
  } catch (error) {
    logger.error(`Error pushing to remote repository`, deepLog(error));
    return Promise.reject(error);
  }
}
