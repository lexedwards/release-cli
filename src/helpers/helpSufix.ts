import { logStyle } from '../logger';
import pkg from '~/package.json';

const pkgName = pkg.name;
const cliName = Object.keys(pkg.bin)[0];

export const helpSufix = `
${logStyle.bold(`Example Usage:`)}
${cliName} release --github # Release to Github
${cliName} release --npm # Release to Npm
${cliName} release --github --npm # Release to both

Notes:

The command "${cliName}" can be exchanged for "npx ${pkgName}"
`;
