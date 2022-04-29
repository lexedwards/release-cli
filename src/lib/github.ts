import { Octokit } from '@octokit/core';
import { getGitInformation } from '../helpers';

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
  try {
    if (!auth_token)
      throw new Error('Publishing a Github release requires an auth_token');
    const gitinfo = await getGitInformation();
    const octo = new Octokit({ auth: auth_token });
    const release = await octo.request('POST /repos/{owner}/{repo}/releases', {
      owner: owner || gitinfo.owner || '',
      repo: repo || gitinfo.repo || '',
      tag_name: gitinfo.latestTag,
      generate_release_notes: true,
    });
    return release;
  } catch (error) {
    return Promise.reject(error);
  }
}
