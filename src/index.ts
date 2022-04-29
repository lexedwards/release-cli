import { program } from 'commander';
import process from 'process';
import pkg from '../package.json';
import { lintCommit } from './commands/lint';
import { release } from './commands/release';
import { helpPrefix, helpSufix } from './helpers';
import 'dotenv/config';

program.name(Object.keys(pkg.bin)[0]);
program.version(pkg.version);
program.addHelpText(`before`, helpPrefix);
program.addHelpText(`after`, helpSufix);

program
  .command('release')
  .description('Create a Changelog and optionally release packages')
  .option(
    '--npm',
    'Release to Npm - An authorized user or "NPM_TOKEN" required in envs'
  )
  .option('--github', 'Release to Github - "GITHUB_TOKEN" required in envs')
  .option('--dryRun', 'Run command without changing sourcecode or git')
  .action((opts) =>
    release({
      ...opts,
      NPM_TOKEN: process.env.NPM_TOKEN,
      github_access: {
        auth_token: process.env.GITHUB_TOKEN,
        owner: process.env.OWNER,
        repo: process.env.REPO,
      },
    })
  );

program
  .command('lint <commit>')
  .description(
    'Lint a string representing a commit message to conform to Conventional standards'
  )
  .action(lintCommit);

export async function bootstrap() {
  process.title = 'Release CLI';
  try {
    await program.parseAsync();
  } catch (error) {
    process.exit(1);
  }
}
