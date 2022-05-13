import chalk from 'chalk';
import { inspect } from 'node:util';
import pkg from '~/package.json';

export function deepLog(data: unknown) {
  return inspect(data, { showHidden: false, depth: null, colors: false });
}

const cliName = Object.keys(pkg.bin)[0];

export const errorStyle = chalk.red;
export const infoStyle = chalk.green;
export const warnStyle = chalk.yellow;
export const logStyle = chalk.gray;
export const successStyle = chalk.cyan;

function error(context: string, ...data: unknown[]) {
  console.log('');
  console.error(errorStyle.bold(`[${cliName}]: 🚨 ${context} `));
  for (const info of data) {
    console.error(logStyle(info));
  }
}

function info(context: string, ...data: unknown[]) {
  console.log('');
  console.info(infoStyle.bold(`[${cliName}]: ✨ ${context}`));
  for (const info of data) {
    console.info(logStyle(info));
  }
}
function warn(context: string, ...data: unknown[]) {
  console.log('');
  console.warn(warnStyle.bold(`[${cliName}]: ⚠️  ${context}`));
  for (const info of data) {
    console.warn(logStyle(info));
  }
}
function log(context: string, ...data: unknown[]) {
  console.log('');
  console.log(logStyle.bold(`[${cliName}]: ${context}`));
  for (const info of data) {
    console.log(logStyle(info));
  }
}
function success(context: string, ...data: unknown[]) {
  console.log('');
  console.log(successStyle.bold(`[${cliName}]: 🚀 ${context}`));
  for (const info of data) {
    console.log(logStyle(info));
  }
}
function debug(...data: unknown[]) {
  if (!process.env.DEBUG) return;
  console.log('');
  for (const info of data) {
    console.log(logStyle(info));
  }
}

export default {
  log,
  warn,
  info,
  error,
  success,
  debug,
};
