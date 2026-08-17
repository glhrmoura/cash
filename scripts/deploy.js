import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const bumpLog = execSync('node scripts/up-version.js', { encoding: 'utf8' });
process.stdout.write(bumpLog);

const newVersion = bumpLog.match(/→\s*(\S+)/)?.[1];
if (!newVersion) {
  console.error('Could not read new version');
  process.exit(1);
}

execSync('git add package.json public/sw.js');
if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
  execSync('git add yarn.lock');
}
if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
  execSync('git add package-lock.json');
}

let unpushed = 0;
try {
  execSync('git rev-parse --abbrev-ref @{u}', { stdio: 'ignore' });
  unpushed = Number(execSync('git rev-list --count @{u}..HEAD', { encoding: 'utf8' }).trim());
} catch {
  unpushed = 0;
}

if (unpushed > 0) {
  execSync('git commit --amend --no-edit');
} else {
  execSync(`git commit -m "chore: bump version to ${newVersion}"`);
}

const extraArgs = process.argv.slice(2);
const pushArgs =
  extraArgs.length > 0
    ? ['push', ...extraArgs]
    : ['push', '--set-upstream', 'origin', 'HEAD'];

const result = spawnSync('git', pushArgs, {
  stdio: 'inherit',
});

process.exit(result.status === null ? 1 : result.status);
