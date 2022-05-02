import { Octokit } from '@octokit/core';
import { getGitInformation } from '../helpers';
import logger from '../logger';

export interface GithubOptions {
  auth_token?: string;
  owner?: string;
  repo?: string;
}

export async function createGithubRelease({
  auth_token,
  owner,
  repo,
}: GithubOptions) {
  logger.info(`Creating Github Release`);
  try {
    if (!auth_token)
      throw new Error('Publishing Github release requires an auth_token');
    const gitinfo = await getGitInformation();
    const octo = new Octokit({ auth: auth_token });
    const release = await octo.request('POST /repos/{owner}/{repo}/releases', {
      owner: owner || gitinfo.owner || '',
      repo: repo || gitinfo.repo || '',
      tag_name: gitinfo.latestTag,
      generate_release_notes: true,
    });
    logger.success(`Created Github Release`, release.data.html_url);
    return release;
  } catch (error) {
    logger.error(
      'Github Release Error',
      error instanceof Error ? error.message : undefined
    );
    return Promise.reject(error);
  }
}
