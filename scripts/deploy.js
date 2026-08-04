import { execSync, spawnSync } from 'child_process';

const BUMP_TYPES = new Set(['pa', 'mi', 'ma']);
const args = process.argv.slice(2);

const bumpType = BUMP_TYPES.has(args[0]) ? args[0] : 'pa';
const pushExtraArgs = BUMP_TYPES.has(args[0]) ? args.slice(1) : args;

execSync(`node scripts/up-version.js ${bumpType}`, { stdio: 'inherit' });

const pushArgs =
  pushExtraArgs.length > 0
    ? ['push', ...pushExtraArgs]
    : ['push', '--set-upstream', 'origin', 'HEAD'];

const result = spawnSync('git', pushArgs, {
  stdio: 'inherit',
});

process.exit(result.status === null ? 1 : result.status);
