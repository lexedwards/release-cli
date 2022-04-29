import lint from '@commitlint/lint';
import { rules } from '@commitlint/config-conventional';
import logger from '~/src/logger';

export function printExampleCommit() {
  logger.log(`Valid Commit Examples:

<type>(<scope>): <message>

feat: new feature
fix(scope): bug in scope
feat: breaking change in API
chore(deps): update dependencies
`);
}

export async function lintCommit(value: string) {
  logger.info(`Linter`, `Validating: "${value}"`);
  try {
    if (!value) {
      throw new Error(`Passed an empty commit`);
    }
    const report = await lint(value, rules);
    if (!report.valid) {
      logger.error(
        `Failed linting rules`,
        ...report.errors.map(
          (rulesError, i) => `${i + 1}: ${rulesError.message}`
        )
      );
      throw new Error('Commit message is not valid');
    }
  } catch (err) {
    if (err instanceof Error) logger.error(err.message);
    printExampleCommit();
    return Promise.reject(err);
  }
}
