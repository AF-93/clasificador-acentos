import { seed } from './seed.js';

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});