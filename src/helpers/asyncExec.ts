import { exec } from 'child_process';
import { promisify } from 'util';
const asyncExec = promisify(exec);

interface ChildProcessError {
  killed: boolean;
  code: number;
  signal: unknown;
  cmd: string;
  stdout: string;
  stderr: string;
}

const isChildProcessError = (
  maybeError: unknown
): maybeError is ChildProcessError => {
  return (
    typeof maybeError === 'object' && maybeError !== null && `cmd` in maybeError
  );
};

export { asyncExec, ChildProcessError, isChildProcessError };
