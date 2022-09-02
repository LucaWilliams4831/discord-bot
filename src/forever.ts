import { Monitor } from 'forever-monitor';

const child = new Monitor('dist/src/index.js', {
  max: 1,
  silent: false,
});

child.start();
