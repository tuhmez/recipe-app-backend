import chalk from 'chalk';

interface ILogArgs {
  type: 'log' | 'info' | 'error';
  message: string;
  prefColor?: 'green' | 'yellow' | 'red' | 'cyan';
}

export function LogMessage(args: ILogArgs) {
  let log = console.log;
  let chalkFn: chalk.Chalk = chalk.cyan;

  if (args.type === 'error') {
    log = console.error;
    chalkFn = chalk.red;
  } else if (args.type === 'info') {
    log = console.info;
  }
  
  if (args.prefColor) {
    if (args.prefColor === 'green') {
      chalkFn = chalk.green;
    } else if (args.prefColor === 'yellow') {
      chalkFn = chalk.yellow;
    } else if (args.prefColor === 'red') {
      chalkFn = chalk.red;
    }
  }

  log(chalkFn(args.message));
}