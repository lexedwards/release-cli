import pkg from '~/package.json';
import { infoStyle, logStyle } from '../logger';

export const helpPrefix = `
${infoStyle.bold(`${pkg.name} v${pkg.version}`)}

${logStyle(pkg.description)}
`;
